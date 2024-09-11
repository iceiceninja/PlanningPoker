"use client"
import Image from "next/image";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import io from 'socket.io-client';

export default function Home() {
  useEffect(() => {
    const socket = io();

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
       <li>
        <Link href="/user">Home</Link>
      </li>
    <h1 style = {{color: 'white'}}>Planning Poker</h1>
    <button  className = "button-43"> Join as Host</button>
    <button className = "button-43"> Join as User</button>
    <input type="text" />
    </div>
  )
};