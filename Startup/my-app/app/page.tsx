"use client"
import Image from "next/image";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import io from 'socket.io-client';


export default function Home() {
  const router = useRouter(); // Initialize the router
  useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);


  // Handle button clicks
  const joinAsHost = () => {
    router.push('/host'); // Navigate to /host
  };

  const joinAsUser = () => {
    router.push('/user'); // Navigate to /user
  };

  return (
    <div>
      <li>
        <Link href="/user">Home</Link>
      </li>
      <h1 style={{ color: 'white' }}>Planning Poker</h1>
      <button className="button-43" onClick={joinAsHost}> Join as Host</button>
      <button className="button-43" onClick={joinAsUser}> Join as User</button>
      <input type="text" />
    </div>
  )
};