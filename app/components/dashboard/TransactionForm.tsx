"use client";
import React, { useEffect, useState } from "react";
import TransactionHistory from "./TransactionHistory";
import TransactionChart from "./TransactionChart";
import { Category, Transaction } from "../../common/typescript-type/transaction";
import { db, ref, set, push, get, child, query, orderByChild, onValue } from '../../firebase/firebase';

const TransactionForm = () => {
  const [type, setType] = useState("");
  const [category, setCategory] = useState<Category>("Expense");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({})
  console.log("loggedInUserDetails--", loggedInUserDetails,transactions)
  // Fetch from Firebase on mount
  useEffect(() => {
    const getloggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const userId = Object.keys(getloggedInUser)[0];
    const transactionsRef = ref(db, `transactions/${userId}`);
    const unsubscribe = onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val();
      console.log('particularTransData--',data)
      if (data) {
        const loadedTransactions = Object.values(data) as Transaction[];
        setTransactions(loadedTransactions);
      }
    });

    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  useEffect(() => {
    const getloggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (getloggedInUser) {
      console.log("User info:", getloggedInUser);
      // const userId=Object.keys(loggedInUser)[0];  
      // const userPassword=loggedInUser[userId].password;
      setLoggedInUserDetails(getloggedInUser)
      //   setUserDetails(user); // useState
    }
  }, []);
  // Save to Firebase
  function saveToFirebase(updatedTransactions: Transaction[]) {
    const getloggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const userId = Object.keys(getloggedInUser)[0];
    const transactionsRef = ref(db, `transactions/${userId}`);
    // const transactionMap: Record<string, Transaction> = {};
    // console.log("updatedTrans--",updatedTransactions)
    // updatedTransactions.forEach((tx) => {
    //   transactionMap[tx.id] = tx;
    // });
    // set(transactionsRef, transactionMap);
    const latestTransaction = updatedTransactions[updatedTransactions.length - 1];

    // // Push it with a unique key
    // push(transactionsRef, latestTransaction);

    // Generate a unique key
    const newTransactionRef = push(transactionsRef);

    // Use that key as the id in the transaction
    const transactionWithKey = {
      ...latestTransaction,
      id: newTransactionRef.key, // Set the Firebase key as the ID
    };

    // Save the transaction with the key as ID
    set(newTransactionRef, transactionWithKey);

  }

  function handleMakeTransaction(e: React.FormEvent) {
    e.preventDefault();

    const newTransaction: Transaction = {
      type,
      category,
      amount: parseFloat(amount),
    };

    const updatedTransactions = [...transactions, newTransaction];
    // setTransactions(updatedTransactions);
    saveToFirebase(updatedTransactions);

    setType("");
    setCategory("Expense");
    setAmount("");
  }

  return (
    <div className="p-4 max-w-5xl mx-auto mt-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 w-full">
          <TransactionChart transactions={transactions} />
        </div>

        <div className="md:w-1/2 w-full">
          <form onSubmit={handleMakeTransaction}>
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
};

export default TransactionForm;
