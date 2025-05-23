const JWT_SECRET = "12345678";
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({
            message: "Invalid token"
        });
    }

    // Remove "Bearer " prefix
    const token = authHeader.slice(7);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            return res.status(403).json({
                message: "Error"
            });
        }
    } catch (err) {
        return res.status(403).json({});
    }
};

module.exports = {
    authMiddleware
};
