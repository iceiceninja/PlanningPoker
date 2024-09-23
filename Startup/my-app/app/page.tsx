"use client"
import Image from "next/image";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useState, useEffect, SetStateAction } from 'react';
import io from 'socket.io-client';

export default function Home() {
  const router = useRouter(); // Initialize the router
  const [hostJoined, setHostJoined] = useState(false);  // State to hold the input text
  const [formData, setFormData] = useState({ hostName: '', sessionTopic: '' });


  useEffect(() => {
    const socket = io(":3000");

  const joinAsHost = (event : any) => {
    event.preventDefault();  // Prevent the default GET request
    console.log('Form submitted:', formData);
    setFormData(formData);
    console.log("hello world");
    if (hostJoined) {
      joinAsPlayer();
    }

    setHostJoined(true);
    router.push('/host'); // Navigate to /host
  };


  const joinAsPlayer = () => {
    router.push('/user'); // Navigate to /user
  };



  return (
    <div>
    <h1 style = {{color: 'black'}}>Planning Poker</h1>
    <form onSubmit={joinAsHost}>
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


  )
};