// backend/routes/account.js
const express = require('express');
const mongoose = require('mongoose');
const { authMiddleware } = require('../middleware');
const { User,Account,TransferHistory } = require('../db');

const router = express.Router();

// Get Balance Route
router.get("/balance", authMiddleware, async (req, res) => {
    console.log("hello");
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
});

// router.get("/transactionsrecent", authMiddleware, async (req, res) => {
//     try {
//         const userId = req.userId;

//         const recentTransfers = await TransferHistory.find({ from: userId })
//             .sort({ timestamp: -1 }) // Most recent first
//             .limit(10)
//             .lean();

//         // Fetch user names and accountIds for the recipients
//         const enrichedTransfers = await Promise.all(
//             recentTransfers.map(async (tx) => {
//                 const user = await User.findOne({ _id: tx.to }).lean();
//                 const account = await Account.findOne({ userId: tx.to }).lean();

//                 return {
//                     ...tx,
//                     recipientName: user ? user.firstName : "Unknown",
//                     recipientAccountId: account ? account.userId : "Unknown"
//                 };
//             })
//         );

//         res.json({
//             message: "Recent transfers fetched successfully",
//             transactions: enrichedTransfers
//         });
//     } catch (error) {
//         console.error("Error fetching recent transactions:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });

router.get("/transactionsrecent", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;

        // Get both sent and received transactions
        const allTransfers = await TransferHistory.find({
            $or: [{ from: userId }, { to: userId }]
        })
            .sort({ timestamp: -1 }) // Most recent first
            .limit(10)
            .lean();

        const enrichedTransfers = await Promise.all(
            allTransfers.map(async (tx) => {
                // Determine if the transaction was sent or received
                const isSent = tx.from.toString() === userId;

                const counterpartyId = isSent ? tx.to : tx.from;
                const counterpartyUser = await User.findById(counterpartyId).lean();
                const counterpartyAccount = await Account.findOne({ userId: counterpartyId }).lean();

                return {
                    ...tx,
                    direction: isSent ? "sent" : "received",
                    counterpartyName: counterpartyUser ? counterpartyUser.firstName : "Unknown",
                    counterpartyAccountId: counterpartyAccount ? counterpartyAccount.userId : "Unknown"
                };
            })
        );

        res.json({
            message: "Recent transactions fetched successfully",
            transactions: enrichedTransfers
        });
    } catch (error) {
        console.error("Error fetching recent transactions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        console.log("Initiating transfer:", { from: req.userId, to, amount });

        if (amount <= 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Transfer amount must be greater than zero" });
        }

        const account = await Account.findOne({ userId: req.userId }).session(session);
        if (!account) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Sender account not found" });
        }

        if (account.balance < amount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Recipient account not found" });
        }

        // 🔍 Anomaly Detection Rules
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        const recentTransfers = await TransferHistory.find({
            from: req.userId,
            timestamp: { $gte: oneMinuteAgo }
        }).session(session);

        // 🚨 Rule 1: Too many rapid transfers
        if (recentTransfers.length >= 3) {
            console.warn(`🚨 Anomaly Detected: More than 3 transfers in 1 minute by ${req.userId}`);
            console.log(`📧 Email Alert to User ${req.userId}: "Too many transfers in a short period detected. Transfer blocked."`);
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: "Too many rapid transfers. Transaction blocked and user notified." });
        }

        // 🚨 Rule 2: Large withdrawal (e.g., > 80% of balance)
        if (amount > account.balance * 0.8) {
            console.warn(`🚨 Anomaly Detected: Large withdrawal (${amount}) by ${req.userId}`);
            console.log(`📧 Email Alert to User ${req.userId}: "Large withdrawal attempt detected. Transfer blocked."`);
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: "Suspiciously large transfer. Transaction blocked and user notified." });
        }

        // ✅ Perform the transfer
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        // 📝 Log the transfer
        await TransferHistory.create([{ from: req.userId, to, amount }], { session });

        await session.commitTransaction();
        session.endSession();

        const updatedAccount = await Account.findOne({ userId: req.userId });

        res.json({
            message: "Transfer successful",
            balance: updatedAccount.balance
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error during transfer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = router;
