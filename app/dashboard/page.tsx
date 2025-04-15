"use client"
import React from 'react'
import TransactionForm from '../components/dashboard/TransactionForm'
import { db, ref, get } from '../firebase/firebase'
import { useEffect, useState } from 'react';

const Dashboard = () => {
    // const [userIds, setUserIds] = useState<string[]>([]);
    // const [loggedInUserDetails,setLoggedInUserDetails]=useState({})
    // console.log("loggedInUserDetails--",loggedInUserDetails)
    // console.log("userid--", userIds)
    // useEffect(() => {
    //     const fetchUserIds = async () => {
    //         const userRef = ref(db, 'users');
    //         const snapshot = await get(userRef);
    //         if (snapshot.exists()) {
    //             const data = snapshot.val();
    //             const ids: string[] = [];
    //             console.log("data",data)
    //             // Loop through each email-transformed key
    //             Object.values(data).forEach((userGroup: any) => {
    //                 // Then get the nested unique IDs
    //                 const innerIds = Object.keys(userGroup);
    //                 ids.push(...innerIds);
    //             });

    //             setUserIds(ids);
    //         } else {
    //             console.log('No users found');
    //         }
    //     };

    //     fetchUserIds();
    // }, []);




    // useEffect(() => {
    //     const user = JSON.parse(localStorage.getItem('loggedInUser'));
    //     if (user) {
    //       console.log("User info:", user);
    //       setLoggedInUserDetails(user)
    //     //   setUserDetails(user); // useState
    //     }
    //   }, []);
      
    return (
        <div className="p-6">
            <TransactionForm />

            {/* <h2 className="text-xl font-semibold mt-8 mb-4">User IDs from Database:</h2>
            <ul className="bg-white p-4 rounded-lg shadow-md space-y-2">
                {userIds.map((id) => (
                    <li key={id} className="text-gray-700 font-mono border-b last:border-b-0 pb-1">
                        {id}
                    </li>
                ))}
            </ul> */}
        </div>
    )
}

export default Dashboard