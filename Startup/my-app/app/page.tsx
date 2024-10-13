// Original Imports
"use client"; // Mark as a client component
import Image from "next/image";
// import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
// import io from 'socket.io-client';
import socket from '../socket';
import { Link } from "react-router-dom"

// Imports from Michael
import * as React from 'react';
import Box from '@mui/material/Box'; // MUI Box
import Button from '@mui/material/Button'; // MUI Button
import Typography from '@mui/material/Typography'; // MUI Typography
import Modal from '@mui/material/Modal'; // MUI Modal
import {Style} from './components/Style' // MUI Sstyle
import { TextField, FormControl } from "@mui/material"; // MUI Textfield
import Stack from '@mui/material/Stack'; // MUI Stack

export default function hostHome() {


  const router = useRouter(); // Initialize the router
  const [hostJoined, setHostJoined] = useState(false);  // State to track if host has joined
  const [formData, setFormData] = useState({ hostName: '', sessionTopic: '' }); // formData
  
  // Popup component
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Input Content
  const [hostName, setHostName] = useState("")
  const [topicName, setTopicName] = useState("")
  const [hostNameError, setHostNameError] = useState(false)
  const [topicNameError, setTopicNameError] = useState(false)

  // Input Validation
  const handleSubmit = (event: { preventDefault: () => void; }) => {
    
    // Cancels event if cancellable
    event.preventDefault()

    // Default Error states are false
    setHostNameError(false)
    setTopicNameError(false)


    if (hostName == '') { 
      setHostNameError(true) 
    }

    // If topic name is empty/has 20+ characters
    if (topicName == '') { setTopicNameError(true) }

    // Valid input
    if (hostName && topicName) {
        console.log(hostName, topicName)
        event.preventDefault();  // Prevent the default form submission

        // ** TODO: transfer formData to the server backend **
        console.log('Form submitted:', formData);

        // Host joins the session after valid setup
        setHostJoined(true); // Set host joined state
        socket.emit('hostJoined', formData);
        router.push('/host'); // Navigate to /host
    }
  }

  return (
    <div>

      {/* Title Component: Tab's name in browser */}
      <title>Planning Poker - Everfox</title>

      {/* Stack Component: Column */}
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
            {/* Title Component: Description */}
            <h1 style={{ color: 'black' }}>Planning Poker</h1>
            <h3 style={{ color: 'black' }}>Everfox</h3>
            <h3 style={{ color: 'black' }}>You're the first one to join, you are default the host!</h3>

            {/* Textfield Component: Host name textfield */}
            <TextField
                label = "Host's name"
                onChange={e => setHostName(e.target.value)}
                required 
                variant = "outlined"
                color = "secondary"
                value={hostName}
                error={hostNameError}
            />

            {/* Textfield Component: Session topic textfield */}
            <TextField
                label="Session Topic"
                onChange={e => setTopicName(e.target.value)}
                required
                variant="outlined"
                color="secondary"
                value={topicName}
                error={topicNameError}
            />

            {/* Submit Button Component: Start a Session button */}
            <Button type="submit" variant= "contained" className = "button-12">Start a Session</Button>

            {/* Modal Button Component: Getting Started button */}
            <Button type = "button" variant= "contained" className="button-12" onClick={handleOpen}>Getting Started!</Button>

            {/* Modal Component: Information modal */}
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              {/* Box Component: Modal's box*/}
              <Box sx = {Style}>

                {/* Typography Component: Modal's Title */}
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Welcome to Everfox's Planning Poker Application!
                </Typography>

                {/* Typography Component: Modal's Description */}
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  To get started, enter your host name and the session topic for today.
                  After clicking the "Start a Session" button, you will be prompted with a
                  round screen where you can start the planning poker process!
                </Typography>
              </Box>
            </Modal>
          </Stack>
    </div>
  );
}
