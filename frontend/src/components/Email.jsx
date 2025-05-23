import { useState, useEffect } from "react";
import axios from "axios";

export const UserEmail = () => {
    const [email, setEmail] = useState("Loading...");

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("You are not authenticated. Please sign in.");
                    return;
                }

                const response = await axios.get('http://localhost:3000/api/v1/user/me', {
                    headers: {
                        Authorization: token
                    }
                });

                setEmail(response.data.username);
            } catch (error) {
                console.error("Failed to fetch email:", error);
                setEmail("Error fetching email");
            }
        };

        fetchEmail();
    }, []);

    return (
        <div className="font-semibold text-lg">
            Email: {email}
        </div>
    );
};
