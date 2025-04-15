"use client";
import React, { useEffect, useState } from 'react';
import { db, ref, set, push, get, child, query, orderByChild, onValue } from '../firebase/firebase';
import { useSearchParams } from "next/navigation";


// const users = ['Bob', "charlie"];

const Message = () => {
  const [users, setUsers] = useState([]);
  console.log("users--",users)
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState('Client');
  const [chatWith, setChatWith] = useState('');
  const searchParams = useSearchParams();
  const user1 = searchParams.get("user1");
  const user2 = searchParams.get("user2");
  const chatId = user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;

  // const getPairKey = (userA, userB) => {
  //   return [userA, userB].sort().join('-');
  // };

  // const pairKey = getPairKey(currentUser, chatWith);
  // const conversationMap = JSON.parse(localStorage.getItem('conversationMap')) || {};
  // const conversationId = conversationMap[pairKey];

  useEffect(() => {
    const fetchUserIds = async () => {
      // const unsubscribe = auth.onAuthStateChanged((user) => {
      //   console.log('crntuser',user)

      // })
      const userRef = ref(db, 'users');
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const result = [];

        // Iterate over each email-transformed key (e.g., rohan_chauhan@ultivic_com)
        Object.values(data).forEach((userGroup: any) => {
          Object.entries(userGroup).forEach(([uniqueId, userData]: [string, any]) => {
            result.push({
              id: uniqueId,
              userName: userData.name || 'No Name',
            });
          });
        });

        setUsers(result);
      } else {
        console.log('No users found');
      }
    };

    fetchUserIds();
  }, []);

  const fetchMessages = async () => {
    const conversationId = [currentUser, chatWith].sort().join('-unique-');
    const messagesRef = ref(db, 'messages/' + conversationId);
    const snapshot = await get(messagesRef);
    if (snapshot.exists()) {
      setMessages(Object.values(snapshot.val()));
    } else {
      setMessages([]);
    }
  };
  console.log("messages--",messages,chatId)

  useEffect(() => {
    const chatRef = ref(db, `chats/${chatId}/messages`);

    //onValue is used for just setup only in initial render & it will always trigger when new msg arrives
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      const msgArray = data ? Object.values(data) : [];
      msgArray.sort((a, b) => a.timestamp - b.timestamp);
      setMessages(msgArray);
    });
  }, [chatId]);

  //this func pushes data to database
  const handleSendMessage =  (e) => {
    e.preventDefault();

    if (message) {
      // const conversationId = [currentUser, chatWith].sort().join('-unique-');
      // const newMessage = {
      //   text: message,
      //   sender: currentUser,
      //   receiver: chatWith,
      //   timestamp: new Date().toISOString(),
      // };
      const newMessage = {
        senderId: user1,
        text: message,
        timestamp: Date.now(),
      };

      // Store the message in Firebase under the conversation ID
      const messagesRef = ref(db, `chats/${chatId}/messages`);
       push(messagesRef,newMessage);
      // await set(newMessageRef, newMessage);

      // Update the local state with the new message
      // setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage(''); // Reset the input field
    }
  };
  // useEffect(() => {
  //   fetchMessages();
  // }, [chatWith]);
  // useEffect(() => {
  //   const saved = localStorage.getItem('messages');
  //   if (saved) {
  //     setMessages(JSON.parse(saved));
  //   }

  // }, []);

  // console.log("messages--", messages)

  // useEffect(() => {
  //   localStorage.setItem('messages', JSON.stringify(messages));
  // }, [messages]);

  // Filter messages between current user and selected chat partner
  // const filteredMessages = messages.filter(
  //   (msg) => msg.conversation_id === conversationId
  // );

  return (
    <div className="flex h-screen">
      {/* Sidebar with Users */}
      <div className=" border-r border-gray-300 bg-white flex flex-col">
        {/* Current user selector */}
        {/* <div className="p-4 border-b border-gray-300">
          Logged in as:{' '}
          <select value={currentUser} onChange={(e) => setCurrentUser(e.target.value)} className="ml-2 border p-2">
            {users.map((user) => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div> */}

        {/* List of other users to chat with */}
        <div className="flex-1 overflow-y-auto  ml-[100px]">
          {users
            .filter((user) => user !== currentUser)
            .map((user) => (
              <div
                key={user}
                onClick={() => setChatWith(user)}
                className={`p-4 cursor-pointer hover:bg-gray-100 border-b ${chatWith === user ? 'bg-gray-200 font-semibold' : ''
                  }`}
              >
                {user.userName}
              </div>
            ))}
            {/* <p className="p-20 cursor-pointer hover:bg-gray-100 border-b ">{user1} </p> */}
             
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-col flex-1">
        {/* Chat header */}
        <div className="p-4 border-b border-gray-300 bg-white font-semibold">
          Chatting with: {user2}
        </div>

        {/* Chat messages */} 
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 mb-2 rounded-lg max-w-xs ${message.senderId === user1 ? 'bg-blue-300 self-end ml-auto' : 'bg-gray-300'
                }`}
              style={{
                textAlign: message.senderId === user1 ? "right" : "left",
                marginBottom: 8,
              }}
            >   
              <strong></strong> {message.text}
            </div>
          ))}
        </div>

        {/* Message input */}
        <form onSubmit={handleSendMessage} className="flex p-4 bg-white border-t border-gray-300">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 p-3 rounded-lg border border-gray-300 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-500 text-white px-5 rounded-full hover:bg-blue-600 focus:outline-none">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;
