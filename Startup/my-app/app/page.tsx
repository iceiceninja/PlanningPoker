
"use client"; 
import Image from "next/image";
// import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
// import io from 'socket.io-client';
import socket from '../socket';
import { Link } from "react-router-dom"
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'; 
import Typography from '@mui/material/Typography'; 
import Modal from '@mui/material/Modal'; 
import {Style} from './components/Style' 
import { TextField, FormControl } from "@mui/material"; 
import Stack from '@mui/material/Stack'; 

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


  // Input Validation
  const handleSubmit = (event: { preventDefault: () => void; }) => {
    
      event.preventDefault()
        console.log(hostName, topicName)
        event.preventDefault();  // Prevent the default form submission

        // ** TODO: transfer formData to the server backend **
        console.log('Form submitted:', formData);

        // Host joins the session after valid setup
        setHostJoined(true); // Set host joined state
        socket.emit('hostJoined', formData);
        router.push('/host'); // Navigate to /host
  }

  return (
    <div>


      <title>Planning Poker - Everfox</title>

   
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
            <h3 style={{ color: 'black' }}>You're the first one to join, you are default the host!</h3>

          
            <TextField
                slotProps={{htmlInput : {maxLength: 20 }}}
                label = "Host's name"
                onChange={e => setHostName(e.target.value)}
                required 
                variant = "outlined"
                color = "secondary"
                value={hostName}
                
            />

           
            <TextField
                slotProps={{htmlInput : {maxLength: 20 }}}
                label="Session Topic"
                onChange={e => setTopicName(e.target.value)}
                required
                variant="outlined"
                color="secondary"
                value={topicName}
            />

  
            <Button type="submit" variant= "contained" className = "button-12">Start a Session</Button>

    
            <Button type = "button" variant= "contained" className="button-12" onClick={handleOpen}>Getting Started!</Button>


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
    </div>
  );
}
