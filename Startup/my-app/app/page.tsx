
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
import { getDisplayHostname, setDisplayHostname } from '../globalHost';
import { getGlobalSession, setGlobalSession } from '../globalSession';


export default function HostHome() {

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
  const [shouldRender, setShouldRender] = useState(false);
  const socketEmissionHolder = []; // Has to be an array otherwise the socket throws an error.





  socket.on("host_currently_exists", (data) => {
    setDisplayHostname(data);
  
    if(data == "hostNotJoined" && getDisplayHostname() == "hostNotJoined") {
      setShouldRender(true);
    }
    
    else if (data != "hostNotJoined" && getDisplayHostname() != "hostNotJoined") {
      router.push("/userStartUp")
    }

    socket.off("host_currently_exists");
  },);

  useEffect(() => { 
    socket.emit("check_if_host_exists", "true")
}, []); 

useEffect(() : any => {
  console.log(socketEmissionHolder.length)
  if(userCount >= 1) {
    router.push('/host')
  } 

}, [userCount]);

  
    // Loading Screen
    if (!shouldRender) {
      return (
        <div>
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
    setHostJoined(true); // Tell client that host has joined **
     socket.emit('user_joined', {value: hostName}); // Tell server host has joined **
     socket.emit('set_host_session_name' , {value : sessionTopic});
    setDisplayHostname(hostName);
    setGlobalSession(sessionTopic);
  }
  

  return (
    <div>
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
            width: "90vw",
            height: "75vh",
            maxWidth: '1050px '
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
                        Welcome to Everfox&apos;s Planning Poker Application!
                      </Typography>
      
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        To get started, enter your host name and the session topic for today.
                        After clicking the &quot;Start a Session&quot; button, you will be prompted with a
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
                        slotProps={{htmlInput : {maxLength: 35 }}}
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

