"use client"; // Mark as a client component
import Image from "next/image";
// import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
// import io from 'socket.io-client';
import socket from '../socket';

// Popup component import
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {Style} from './components/Style'

// Textfield component
import { TextField, FormControl } from "@mui/material"; // and Button
import { Link } from "react-router-dom"

import Stack from '@mui/material/Stack';

export default function Home() {

  // Initialize the router
  const router = useRouter(); // Initialize the router
  const [hostJoined, setHostJoined] = useState(false);  // State to track if host has joined
  const [formData, setFormData] = useState({ hostName: '', sessionTopic: '' });
  
  // Popup component
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Input Content
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  // Input Validation
  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault()

    setEmailError(false)
    setPasswordError(false)

    if (email == '') {
        setEmailError(true)
    }
    if (password == '') {
        setPasswordError(true)
    }

    if (email && password) {
        console.log(email, password)
        event.preventDefault();  // Prevent the default form submission
        console.log('Form submitted:', formData);
        setHostJoined(true); // Set host joined state
        socket.emit('hostJoined', formData);
        router.push('/host'); // Navigate to /host
    }
}

  // Initialize socket connection
  // const socket = io(":4000");

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
      <Stack
            component = "form"
            direction = "column"
            autoComplete = "off"
            spacing = {2}
            sx={{  
              justifyContent: "center",
              alignItems: "center"
            }}
            onSubmit={handleSubmit}
          >
            <h1 style={{ color: 'black' }}>Planning Poker</h1>
            <h3 style={{ color: 'black' }}>Everfox</h3>
            <TextField
              label = "Host's name"
              onChange={e => setEmail(e.target.value)}
              required 
              variant = "outlined"
              color = "secondary"
              value={email}
              error={emailError}
            />
            <TextField
                    label="Session Topic"
                    onChange={e => setPassword(e.target.value)}
                    required
                    variant="outlined"
                    color="secondary"
                    value={password}
                    error={passwordError}
            />
            <Button type="submit" className="button-12">Start a Session</Button>

            <Button type = "button" className="button-12" onClick={handleOpen}>Getting Started!</Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx = {Style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Welcome to Everfox's Planning Poker Application!
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  To get started, enter your host name and the session topic for today.
                  After clicking the "Start a Session" button, you will be prompted with a
                  round screen where you can start the planning poker process!
                </Typography>
              </Box>
            </Modal>
          </Stack>
        <title>Planning Poker - Everfox</title>
    </div>
  );
}

      {/*<form onSubmit={joinAsHost}>
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
      </form>*/}