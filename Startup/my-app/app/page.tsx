
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

import everfox_logo from '../images/everfox_logo.png'
import cards from '../images/cards.png'

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
  const socketEmissionHolder = [];

  socket.on("host_exists", () => {
    socketEmissionHolder.push("1");
    console.log("asdfsdaafafsdfdasdasf");
    console.log(socketEmissionHolder.length + "asdfdwsafdaf")
  });


  useEffect(() : any => {
    if(userCount == 1) {
      router.push('/host')
    }

    const timer = setTimeout(() => {
     if (socketEmissionHolder.length >= 1) {
      console.log("asdfsdaafafsdfdasdasf");
      router.push('/user')
    }
    else {
      setShouldRender(true)
    }
  }, 600); // 3000 milliseconds = 3 seconds

  
  }, [userCount]);


  // Input Validation
  const handleSubmit = (event: { preventDefault: () => void; }) => {
    

        event.preventDefault()

        setUserCount((prevValue) => prevValue + 1);

        console.log(userCount);
        setHostJoined(true);
        socket.emit('host_joined', {hostName, sessionTopic});
  }
  

  if (!shouldRender) {
    return  <div>Loading...</div>;
  }

  else {
  return (
    <div>
      {/* Tab Contents: Icon, title */}
      <head> 
        <link rel="icon" href={everfox_logo.src} />
      </head>
      <title>Planning Poker - Everfox</title>

      {/* Whole Screen: Column with vertical centering*/}
      <Stack
        direction = "column"
        sx = {{
          width: "100vw",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        {/* Center Box */}
        <Box
          sx = {{
            borderRadius: 1,
            bgcolor: "#F3F1F6",
            boxShadow: 2,
            width: "75vw",
            height: "75vh",
          }}
        >
          {/* Box has 3 rows */}
          <Stack
              direction = "column"
              sx = {{
                width: "100%",
                height: "100%",
                justifyContent: "space-between",
                alignItems: "center"
              }}
          >
            {/* 1st Row: Title, session ID */}
            <Box>
              <h1>
                Host Setup
              </h1>
              <h2>
                Session ID: ####
              </h2>
            </Box>

            {/* 2nd Row: Login */}
            <Stack
              direction = "row"
              spacing = {0}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
                {/* App title and logo, with getting started button */}
                <Stack
                  direction = "column"
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >

                  <h1> Planning </h1>
                  <h1> Poker </h1>
                  <Box 
                    component = "img"
                    src = {cards.src} 
                    alt = "everfox logo"
                    sx = {{
                      height: "10vh",
                      width: "10vh"
                    }}
                  /> 
                  <Box sx={{ m: '1rem' }} /> 
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

                <Box sx = {{width: "10vw"}}/>

                {/* Enter host name and session topic form */}
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
                  
                    <TextField
                        slotProps={{htmlInput : {maxLength: 20 }}}
                        label = "Host's name"
                        onChange={e => setHostName(e.target.value)}
                        required 
                        variant = "outlined"
                        color = "secondary"
                        value={hostName}
                        size = "small"
                        sx = {{width: '25vh'}}
                    />
                  
                    <TextField
                        slotProps={{htmlInput : {maxLength: 20 }}}
                        label="Session Topic"
                        onChange={e => setSessionTopic(e.target.value)}
                        required
                        variant="outlined"
                        color="secondary"
                        value={sessionTopic}
                        size = "small"
                        sx = {{width: '25vh'}}
                    />

                    <Button type="submit" variant= "contained" className = "button-12">Start a Session</Button>
                </Stack>
            </Stack>

            {/* 3rd Row: Logo and company name */}
            <Box>
              <Stack
                direction = "row"
                spacing = {1}
                sx = {{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Box 
                component = "img"
                src = {everfox_logo.src} 
                alt = "everfox logo"
                sx = {{
                  height: "5vh",
                  width: "5vh"
                }}/> 
                <h2>
                  Everfox
                </h2>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </div>
  );
}
}
