"use client"
import React, { useEffect, useState } from 'react'
import TransactionHistory from './TransactionHistory'
import TransactionChart from './TransactionChart'
import { Category,Transaction } from '../common/types/transaction'

 
const TransactionForm = () => {
    const [type, setType] = useState('')
    const [category, setCategory] = useState<Category>('Expense')
    const [amount, setAmount] = useState('')

    const [transactions, setTransactions] = useState<Transaction[]>([])


    useEffect(() => {
        const saved = localStorage.getItem('transactions');
        if (saved) {
            setTransactions(JSON.parse(saved));
        }
    }, []);


    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions))
    }, [transactions])

    function handleMakeTransaction(e: React.FormEvent) {
        e.preventDefault()
        const newTransaction:Transaction = {
            id: Date.now(),
            type,
            category,
            amount: parseFloat(amount),
        }
        const updatedTransactions = [...transactions, newTransaction]
        setTransactions(updatedTransactions)
        setType('')
        setCategory('Expense')
        setAmount('')

    }

    console.log(transactions, "transactions--")

    return (
        <div className="p-4 max-w-5xl mx-auto mt-4">

            {/* Flex container to align Chart + Form side by side */}
            <div className="flex flex-col md:flex-row gap-8">

                {/* Left: Chart */}
                <div className="md:w-1/2 w-full">
                    <TransactionChart transactions={transactions} />
                </div>

                {/* Right: Form + History */}
                <div className="md:w-1/2 w-full">
                    <form onSubmit={handleMakeTransaction} className="">
                        <h2 className="text-xl font-semibold mb-4 text-center">Transaction</h2>

                        <input
                            type="text"
                            placeholder="e.g. House Rent, Salary"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full p-2 mb-3 border rounded"
                            required
                        />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as Category)}
                            className="w-full p-2 mb-3 border rounded"
                        >
                            <option>Expense</option>
                            <option>Savings</option>
                            <option>Investment</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 mb-3 border rounded"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
                        >
                            Make Transaction
                        </button>
                    </form>

                    {/* History below form */}
                    <div className="mt-14">
                        <TransactionHistory
                            transactions={transactions}
                            setTransactions={setTransactions}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

}

export default TransactionForm