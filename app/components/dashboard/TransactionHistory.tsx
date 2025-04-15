import React from 'react'
import { Transaction } from '../../common/typescript-type/transaction'
import { db, ref } from '../../firebase/firebase';
import { remove } from 'firebase/database';


type Props = {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
};
const TransactionHistory = ({ transactions, setTransactions }: Props) => {

    const handleDeleteTransaction = async (id:string) => {
        const getloggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        const userId = Object.keys(getloggedInUser)[0];

        const transactionRef = ref(db, `transactions/${userId}/${id}`);

        try {
            await remove(transactionRef); // Remove from Firebase

            // Update local UI
            setTransactions((prev) => prev.filter((tx) => tx.id !== id));
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
            {transactions.length === 0 ? (
                <p className="text-gray-500">No transactions yet.</p>
            ) : (
                <ul className="space-y-2">
                    {transactions.map((tx) => (
                        <>
                            <li className="border p-2 rounded shadow-sm flex justify-between">
                                <p><strong>{tx.type}</strong>  — ₹{tx.amount}</p>
                                <button
                                    onClick={() => handleDeleteTransaction(tx.id)}
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </li>
                        </>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TransactionHistory