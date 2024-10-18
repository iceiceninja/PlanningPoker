
"use client"; 

// Imports

// Client/Server Imports
import { useRouter } from 'next/navigation';
import socket from '../socket';

// React Library Imports
import * as React from 'react';
import { useState, useEffect } from 'react';
import Favicon from "react-favicon";

// MUI Imports
import { Box, Button, Typography, Modal, TextField, Stack, CircularProgress
} from "@mui/material"
import { ThemeProvider } from '@mui/material/styles';

// Folder imports
import everfox_logo from '../images/everfox_logo.png'
import cards from '../images/cards.png'
import {Style, textTheme } from './components/Style' 

// Client Type Global Variable [for each client, it has a user type: Host or User]
var clientType = ""

export default function hostHome() {

  // Variables
  const router = useRouter();                             // Router initialization
  const [hostJoined, setHostJoined] = useState(false);    // Host Presence state **
  const [open, setOpen] = React.useState(false);          // Modal State
  const handleOpen = () => setOpen(true);                 // Open Modal
  const handleClose = () => setOpen(false);               // Close Modal
  const [hostName, setHostName] = useState("")            // Host name input
  const [sessionTopic, setSessionTopic] = useState("")    // Session name input
  const [userCount, setUserCount] = useState(0);          // User count 
  const [loading, setLoading] = useState(true);           // Loading State

  // Loading Timer [1000ms = 1s]
  useEffect(() => { setTimeout(() => {setLoading(false)}, 3000); }, []);  

  // Retrieve user type using acknowledgements - Server calls back client type [response]
  socket.emit("clientType", (response : any) => { clientType = response.clientType; });

  // Connection error for debugging
  socket.on("connection_error", (err) => { console.log(`connect_error due to ${err.message}` + err.code); });

    // Loading Screen
    if (loading) {
      return (
        <div>
          {/* Tab Contents: Icon, title */}
          <Favicon url = {everfox_logo.src} /> {/* Using <head> causes internal error */}
          <title>Planning Poker - Everfox</title>
          <Stack sx={{ width: "100vw", height: "100vh", justifyContent: "center", alignItems: "center",  }} >
            <CircularProgress />
          </Stack>
        </div>);
    }
  
    // Direct to setup screens for host or user

  // Input Validation **
  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault() // Stops default action of an element from happening
    setUserCount((prevValue) => prevValue + 1); // Increment user count
    console.log(userCount);
    setHostJoined(true); // Tell client that host has joined **
    socket.emit('host_joined', {hostName, sessionTopic}); // Tell server host has joined **
  }
  

  
  // Show user login screen
  if (clientType === "user") {
    console.log("load user screen")
    return (
      <div>
        {/* Tab Contents: Icon, title */}
        <Favicon url = {everfox_logo.src} /> {/* Using <head> causes internal error */}
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
                  User Sign Up
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
                        To get started, enter your user name. After clicking the “Join Session" button, you will be prompted with a round screen where you can start the planning poker process!
                        </Typography>
                      </Box>
                    </Modal>
                  </Stack>

                  {/* Spacing */}
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
                          label = "User name"
                          onChange={e => setHostName(e.target.value)}
                          required 
                          variant = "outlined"
                          color = "secondary"
                          value={hostName}
                          size = "small"
                          sx = {{width: '25vh'}}
                      />

                      <Button type="submit" variant= "contained" className = "button-12">Join Session</Button>
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
    )
  }

  // Show host login screen
  if (clientType === "host") {
  return (
    <div>
      {/* Tab Contents: Icon, title */}
      <Favicon url = {everfox_logo.src} /> {/* Using <head> causes internal error */}
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
            maxWidth: '750px'
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
              <ThemeProvider theme = {textTheme}>
                <Typography
                  variant = "h3"
                >
                  Host Startup
                </Typography>
              </ThemeProvider>
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
                    border: 0
                  }}
                >
                  <ThemeProvider theme = {textTheme}>
                    <Typography
                      variant = "h2"
                      gutterBottom
                      align = "center"
                      sx = {{border: 0}}
                      margin = '0'
                    >
                      Planning
                    </Typography>
                    <Typography
                      variant = "h2"
                      gutterBottom
                      align = "center"
                      sx = {{border: 0}}
                    >
                      Poker
                    </Typography>
                  </ThemeProvider>
                  <Box 
                    component = "img"
                    src = {cards.src} 
                    alt = "planning poker logo"
                    sx = { (theme) => ({
                      [theme.breakpoints.up('xs')]: { width: '6vh', height: '6vh'},
                      [theme.breakpoints.up('sm')]: { width: '8vh', height: '8vh'},
                      [theme.breakpoints.up('md')]: { width: '10vh', height: '10vh'},
                      border: 0 })
                    }
                  /> 
                  <Box sx={{ m: 0 }} /> 
                  {/*getting started */}
                  <Button 
                    type = "button" 
                    variant= "contained" 
                    className="button-12" 
                    onClick={handleOpen}
                    sx = { (theme) => ({
                      [theme.breakpoints.up('xs')]: { width: '15vh', height: '5vh',   fontSize: '.57rem'},
                      [theme.breakpoints.up('sm')]: { width: '25vh', height: '5.5vh', fontSize: '.90rem'},
                      [theme.breakpoints.up('md')]: { width: '30vh', height: '6vh',   fontSize: '1.0rem'},
                      border: 0,
                      padding: 0,
                     })
                    }
                  >
                    Getting Started!
                  </Button>
                  
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
                    alignItems: "center",
                    border: 0
                  }}
                  onSubmit={handleSubmit}
                >
                  
                    <TextField
                        slotProps={{htmlInput : {maxLength: 20 }}}
                        label = { "Host's Name" }
                        onChange={e => setHostName(e.target.value)}
                        required 
                        variant = "outlined"
                        color = "secondary"
                        value={hostName}
                        size = "small"
                        sx = { (theme) => ({
                          [theme.breakpoints.up('xs')]: { 
                            width: '15vh', height: '5vh', fontSize: '.57rem', 
                            '& .MuiFormLabel-root': { fontSize: '.67rem', marginTop: '.5vh'},     
                            '& .MuiInputBase-input': { fontSize: '.67rem', marginTop: '.5vh'}                 
                          },
                          [theme.breakpoints.up('sm')]: { 
                            width: '25vh', height: '5.5vh', fontSize: '.90rem',
                            '& .MuiFormLabel-root': { fontSize: '.95rem', marginTop: '.5vh'},
                            '& .MuiInputBase-input': { fontSize: '.95rem', marginTop: '.5vh'}                              
                          },
                          [theme.breakpoints.up('md')]: { 
                            width: '30vh', height: '6vh', fontSize: '1.0rem',
                            '& .MuiFormLabel-root': { fontSize: '1.0rem', marginTop: '.4.5vh'},
                            '& .MuiInputBase-input': { fontSize: '1.0rem', marginTop: '.5vh'}   
                          },
                          border: 0,
                          padding: 0,
                          margin: 0
                         })                         
                        }
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
                        sx = { (theme) => ({
                          [theme.breakpoints.up('xs')]: { 
                            width: '15vh', height: '5vh', fontSize: '.57rem', 
                            '& .MuiFormLabel-root': { fontSize: '.60rem', marginTop: '.9vh'},      
                            '& .MuiInputBase-input': { fontSize: '.60rem', marginTop: '.5vh'}                
                          },
                          [theme.breakpoints.up('sm')]: { 
                            width: '25vh', height: '5.5vh', fontSize: '.90rem', 
                            '& .MuiFormLabel-root': { fontSize: '.93rem', marginTop: '.5vh'},
                            '& .MuiInputBase-input': { fontSize: '.93rem', marginTop: '.5vh'}     
                          },
                          [theme.breakpoints.up('md')]: { 
                            width: '30vh', height: '6vh',  fontSize: '1.0rem', 
                            '& .MuiFormLabel-root': { fontSize: '1.0rem', marginTop: '.5vh'},
                            '& .MuiInputBase-input': { fontSize: '1.0rem', marginTop: '.5vh'}  
                          },
                          border: 0,
                          padding: 0,
                         })
                        }
                    />

                    <Button 
                      type="submit" 
                      variant= "contained" 
                      className = "button-12"
                      sx = { (theme) => ({
                        [theme.breakpoints.up('xs')]: { width: '15vh', height: '5vh',   fontSize: '.57rem'},
                        [theme.breakpoints.up('sm')]: { width: '25vh', height: '5.5vh', fontSize: '.90rem'},
                        [theme.breakpoints.up('md')]: { width: '30vh', height: '6vh',   fontSize: '1.0rem'},
                        border: 0,
                        padding: 0,
                       })
                      }
                    >
                      Start a Session
                    </Button>
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
                sx = { (theme) => ({
                  [theme.breakpoints.up('xs')]: { width: '3.5vh', height: '3.5vh'},
                  [theme.breakpoints.up('sm')]: { width: '4vh', height: '4vh'},
                  [theme.breakpoints.up('md')]: { width: '6vh', height: '6vh'},
                  border: 0 })
                }/> 

                <ThemeProvider theme = {textTheme}>
                  <Typography
                    variant = "h5"
                  >
                    Everfox
                  </Typography>
                </ThemeProvider>

              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </div>
  );
  }

  // Refresh if there is an error in retrieving client type
  window.location.reload();  

}

{/*

  useEffect(() : any => {
  if(userCount == 1) { router.push('/host') }
  const timer = setTimeout(() => {
    setShouldRender(true)
  }, 600); // 3000 milliseconds = 3 seconds
  }, [userCount]);
  
  socket.on("host_exists", () => {
    socketEmissionHolder.push("1");
    console.log("asdfsdaafafsdfdasdasf");
    console.log(socketEmissionHolder.length + "asdfdwsafdaf")
  });
    
*/}
