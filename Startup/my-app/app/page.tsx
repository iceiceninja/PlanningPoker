"use client"; // Mark as a client component
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export default function Home() {
  const router = useRouter(); // Initialize the router
  const [hostJoined, setHostJoined] = useState(false);  // State to track if host has joined
  const [formData, setFormData] = useState({ hostName: '', sessionTopic: '' });

  // Initialize socket connection
  const socket = io(":4000");

  const joinAsHost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();  // Prevent the default form submission
    console.log('Form submitted:', formData);

    setHostJoined(true); // Set host joined state

    socket.emit('hostJoined', formData);

    router.push('/host'); // Navigate to /host
  };

  const joinAsPlayer = () => {
    router.push('/user'); // Navigate to /user
  };

  // Handle form input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h1 style={{ color: 'black' }}>Planning Poker</h1>
      <form onSubmit={joinAsHost}>
        <label className="label-input" htmlFor="hostName">Host&#39;s Name</label>
        <input
          type="text"
          className="form-input"
          name="hostName"
          id="hostName"
          maxLength={20}
          required
          onChange={handleInputChange}
        />

        <label className="label-input" htmlFor="sessionTopic">Session Topic</label>
        <input
          type="text"
          className="form-input"
          name="sessionTopic"
          id="sessionTopic"
          maxLength={10000}
          required
          onChange={handleInputChange}
        />

        <button type="submit" className="button-43">Start a Session</button>
      </form>
    </div>
  );
}