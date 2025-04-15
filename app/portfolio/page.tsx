"use client";
import React, { useEffect, useState } from "react";
import { db, ref, get } from "../firebase/firebase";

type UserSummary = {
    userId: string;
    name: string;
    email: string;
    totalExpense: number;
    totalSavings: number;
    totalInvestment: number;
};

const Portfolio = () => {
    const [userSummaries, setUserSummaries] = useState<UserSummary[]>([]);
    const getloggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    const loggedInUserId = Object.keys(getloggedInUser)[0];

    useEffect(() => {
        const fetchUsersAndTransactions = async () => {
            const usersRef = ref(db, "users");
            const usersSnap = await get(usersRef);

            const transactionsRef = ref(db, "transactions");
            const transactionsSnap = await get(transactionsRef);

            if (usersSnap.exists()) {
                const usersData = usersSnap.val();
                const transactionsData = transactionsSnap.exists() ? transactionsSnap.val() : {};

                const summaries: UserSummary[] = [];

                // usersData structure: { email_key: { uniqueUserId: { name, email, ... } } }
                Object.values(usersData).forEach((userGroup: any) => {
                    const userId = Object.keys(userGroup)[0];
                    const userDetails = userGroup[userId];

                    if (userId === loggedInUserId) return; // skip logged-in user

                    const userTransactions = transactionsData[userId] || {};
                    let totalExpense = 0,
                        totalSavings = 0,
                        totalInvestment = 0;

                    Object.values(userTransactions).forEach((tx: any) => {
                        if (tx.category === "Expense") totalExpense += parseFloat(tx.amount);
                        else if (tx.category === "Savings") totalSavings += parseFloat(tx.amount);
                        else if (tx.category === "Investment") totalInvestment += parseFloat(tx.amount);
                    });

                    summaries.push({
                        userId,
                        name: userDetails.name,
                        email: userDetails.email,
                        totalExpense,
                        totalSavings,
                        totalInvestment,
                    });
                });

                setUserSummaries(summaries);
            }
        };

        fetchUsersAndTransactions();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">User Portfolios</h2>
            <div className="flex overflow-x-auto space-x-6 pb-4">
                {userSummaries.map((user) => (
                    <div
                        key={user.userId}
                        className="min-w-[320px] bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex-shrink-0 transition hover:shadow-2xl hover:scale-105 duration-200"
                    >
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-400 mt-1">ID: {user.userId}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 mt-4">
                            <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg flex justify-between items-center text-sm font-medium">
                                Expense <span>₹{user.totalExpense}</span>
                            </div>
                            <div className="bg-green-50 text-green-600 px-3 py-2 rounded-lg flex justify-between items-center text-sm font-medium">
                                Savings <span>₹{user.totalSavings}</span>
                            </div>
                            <div className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg flex justify-between items-center text-sm font-medium">
                                Investment <span>₹{user.totalInvestment}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Portfolio;
