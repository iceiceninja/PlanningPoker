"use client"
import Image from "next/image";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useState, useEffect, SetStateAction } from 'react';
// import io from 'socket.io-client';
import socket from "../socket";


export default function Home() {
  const [message, setMessage] = useState('');  // State to hold the input text
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    // Listen for the connection event
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    // Listen for the disconnect event
    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // Listen for responses from the server
    socket.on('response', (data) => {
      console.log('Response from server:', data);
    });

    // Cleanup when the component unmounts
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('response');
    };
  }, []);


  // Handle button clicks
  const joinAsHost = () => {
    router.push('/host'); // Navigate to /host
  };

  const joinAsUser = () => {
    router.push('/user'); // Navigate to /user
  };

  // Function to send a message to the backend
  // Function to handle sending the message to the backend
  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('message', { text: message });  // Emit the message to the backend
      setMessage('');  // Clear the input field after sending
    }
  };
  const handleInputChange = (e: any) => {
    setMessage(e.target.value);
  };

  return (
    <div>
      <li>
        <Link href="/user">Home</Link>
      </li>
      <h1 style={{ color: 'white' }}>Planning Poker</h1>
      <button className="button-43" onClick={joinAsHost}> Join as Host</button>
      <button className="button-43" onClick={joinAsUser}> Join as User</button>
      <input
        type="text"
        value={message}
        onChange={handleInputChange}  // Update the state when typing
        placeholder="Type your message here"
      />
      <button className="button-43" onClick={sendMessage}>
        Send Message to Backend
      </button>
    </div>

  )
};