import { useState, useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";

export const Dashboard = () => {
    const [balance, setBalance] = useState("Loading...");

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("You are not authenticated. Please sign in.");
                    return;
                }

                const response = await axios.get('http://localhost:3000/api/v1/account/balance', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Set balance if response is successful
                setBalance(response.data.balance);

            } catch (error) {
                console.error("Failed to fetch balance:", error);
                setBalance("Error fetching balance");
            }
        };

        fetchBalance();
    }, []);

    return (
        <div>
             <Appbar/>
            <div className="m-8">
                <Balance value={balance} />
                
                <Users />
            </div>
        </div>
    );
};
