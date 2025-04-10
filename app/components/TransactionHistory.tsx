import React from 'react'
import { Transaction } from '../common/types/transaction'

type Props = {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
};
const TransactionHistory = ({ transactions, setTransactions }:Props) => {

    function handleDeleteTransaction(id: number) {
        const updatedTransactions = transactions.filter((tx) => tx.id !== id)
        setTransactions(updatedTransactions)
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions))
    }
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
            {transactions.length === 0 ? (
                <p className="text-gray-500">No transactions yet.</p>
            ) : (
                <ul className="space-y-2">
                    {transactions.map((tx) => (
                        <>
                            <li key={tx.id} className="border p-2 rounded shadow-sm flex justify-between">
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