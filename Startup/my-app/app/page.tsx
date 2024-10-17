
"use client"; 
import Image from "next/image";
// import Link from 'next/link';
import { useRouter, redirect  } from 'next/navigation';
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

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Input Content
  const [hostName, setHostName] = useState("")
  const [sessionTopic, setSessionTopic] = useState("")
  const [userCount, setUserCount] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);
 const currentPlayerSocketId = []; 
  const socketEmissionHolder = []; // Has to be an array otherwise the socket throws an error.

  socket.on("host_exists", () => {
    socketEmissionHolder.push("1");
  });

  socket.on('connect', () => {
    currentPlayerSocketId.push(socket.id);
  });

  useEffect(() : any => {
    if(userCount == 1) {
      router.push('/host')
    }

    const timer = setTimeout(() => {
     if (socketEmissionHolder.length >= 1) {
      router.push('/user')
    }
    else {
      setShouldRender(true)
    }
  }, 1600); // 3000 milliseconds = 3 seconds

  
  }, [userCount]);


  // Input Validation
  const handleSubmit = (event: { preventDefault: () => void; }) => {
    

        event.preventDefault()

        setUserCount((prevValue) => prevValue + 1);

        console.log(userCount);
        setHostJoined(true);
  }
  

  if (!shouldRender) {
    return  <div>Loading...</div>;
  }

  else {
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
                onChange={e => setSessionTopic(e.target.value)}
                required
                variant="outlined"
                color="secondary"
                value={sessionTopic}
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
}
