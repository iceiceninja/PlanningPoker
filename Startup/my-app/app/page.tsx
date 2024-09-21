"use client"
import Image from "next/image";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import io from 'socket.io-client';

export default function Home() {
  useEffect(() => {
    const socket = io("localhostP:3000");

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
    <h1 style = {{color: 'black'}}>Planning Poker</h1>
    <form>
    <label  className = "label-input" htmlFor="hostName">Host's Name</label>
<input
  type="text"
  className="form-input"
  name="hostName"
  id="hostName"
  maxLength={20}
  required
/>

<label className = "label-input" htmlFor="sessionTopic">Session Topic</label>
<input
  type="text"
  className="form-input"
  name="sessionTopic"
  id="sessionTopic"
  maxLength={10000}
  required
/>

<button type ="submit" className = "button-43"> Start a Session</button>
</form>
    </div>
  )
};