import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiLogOut, FiClock, FiDollarSign, FiHome } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export const Appbar = () => {
    const [userData, setUserData] = useState({
        firstName: "U",
        lastName: "",
        email: ""
    });
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await axios.get('http://localhost:3000/api/v1/user/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUserData({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email
                });

            } catch (error) {
                console.error("Failed to fetch user details:", error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signin");
        setDropdownVisible(false);
    };

    const menuItems = [
        { 
            name: "Dashboard", 
            icon: <FiHome className="mr-2" />, 
            action: () => navigate("/dashboard") 
        },
        { 
            name: "Recent Transactions", 
            icon: <FiClock className="mr-2" />, 
            action: () => navigate("/recent-transactions") 
        }
    ];

    return (
        <header className="sticky top-0 z-50 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <button 
                            className="md:hidden mr-4 text-2xl"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <FiX /> : <FiMenu />}
                        </button>
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="text-2xl font-bold tracking-wider cursor-pointer flex items-center"
                            onClick={() => navigate("/dashboard")}
                        >
                            <span className="bg-white text-indigo-600 px-2 py-1 rounded mr-2">PW</span>
                            <span className="hidden sm:inline">PayWallet</span>
                        </motion.div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-6 items-center">
                        {menuItems.map((item) => (
                            <motion.button
                                key={item.name}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                                onClick={item.action}
                            >
                                {item.icon}
                                {item.name}
                            </motion.button>
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className="relative">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => setDropdownVisible(!dropdownVisible)}
                        >
                            <div className="hidden sm:block text-sm text-white/80">
                                Hi, {userData.firstName}
                            </div>
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white border-2 border-white/30">
                                    {userData.firstName[0].toUpperCase()}
                                    {userData.lastName && userData.lastName[0].toUpperCase()}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>
                        </motion.div>

                        <AnimatePresence>
                            {dropdownVisible && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl overflow-hidden z-50"
                                >
                                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                                        <p className="text-sm font-medium text-gray-900">
                                            {userData.firstName} {userData.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {userData.email}
                                        </p>
                                    </div>
                                    <div className="py-1">
                                        {menuItems.map((item) => (
                                            <button
                                                key={item.name}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => {
                                                    item.action();
                                                    setDropdownVisible(false);
                                                }}
                                            >
                                                {item.icon}
                                                {item.name}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="py-1 border-t border-gray-200">
                                        <button
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            onClick={handleLogout}
                                        >
                                            <FiLogOut className="mr-2" />
                                            Sign out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden mt-4 bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden"
                        >
                            {menuItems.map((item) => (
                                <motion.button
                                    key={item.name}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center w-full px-4 py-3 text-white hover:bg-white/20"
                                    onClick={() => {
                                        item.action();
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    {item.icon}
                                    {item.name}
                                </motion.button>
                            ))}
                            <div className="border-t border-white/20">
                                <button
                                    className="flex items-center w-full px-4 py-3 text-white hover:bg-white/20"
                                    onClick={handleLogout}
                                >
                                    <FiLogOut className="mr-2" />
                                    Sign out
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};