import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUpRight, FiClock, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import { Appbar } from '../components/Appbar';

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState('all'); // 'all', 'sent', 'received'

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/v1/account/transactionsrecent", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTransactions(response.data.transactions);
      setError("");
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError("Unable to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(txn => {
    if (filter === 'sent') return txn.direction === 'sent';
    if (filter === 'received') return txn.direction === 'received';
    return true;
  });

  const getTransactionColor = (direction) => {
    return direction === 'received' ? 'text-green-500' : 'text-red-500';
  };

  const getTransactionIcon = (direction) => {
    return direction === 'received' ? '⬇️' : '⬆️';
  };

  return (
    <div> <Appbar/>
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-800"
        >
          Transaction History
        </motion.h2>
        
        <div className="flex space-x-2 bg-gray-200 p-1 rounded-full">
          {['all', 'sent', 'received'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 text-sm rounded-full transition-all ${
                filter === f 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-3"
          />
          <p className="text-gray-500">Loading transactions...</p>
        </div>
      ) : error ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-8 bg-red-50 rounded-lg"
        >
          <FiAlertCircle className="text-red-500 mr-2" />
          <p className="text-red-600">{error}</p>
        </motion.div>
      ) : filteredTransactions.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-gray-400"
        >
          <FiClock className="text-4xl mb-3" />
          <p>No transactions found</p>
          <button 
            onClick={fetchTransactions}
            className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Refresh
          </button>
        </motion.div>
      ) : (
        <motion.ul className="space-y-4">
          <AnimatePresence>
            {filteredTransactions.map((txn) => (
              <motion.li
                key={txn._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${txn.direction === 'received' ? 'bg-green-100' : 'bg-red-100'} mr-4`}>
                    <span className={`text-lg ${getTransactionColor(txn.direction)}`}>
                      {getTransactionIcon(txn.direction)}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800">
                        {txn.counterpartyName || "Unknown User"}
                      </h3>
                      <span className={`font-semibold ${getTransactionColor(txn.direction)}`}>
                        {txn.direction === 'received' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between mt-1">
                      <p className="text-sm text-gray-500">
                        {txn.description || (txn.direction === 'sent' ? "Payment sent" : "Payment received")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(txn.timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    
                    {txn.status && (
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          txn.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : txn.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {txn.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
      
      <div className="mt-6 flex justify-end">
        <button 
          onClick={fetchTransactions}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiArrowUpRight className="mr-2" />
          Refresh Transactions
        </button>
      </div>
    </div>
    </div>
  );
};

export default RecentTransactions;
