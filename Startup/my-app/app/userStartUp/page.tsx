
"use client"; 

// Imports

// Client/Server Imports
import { useRouter } from 'next/navigation';
import socket from '../../socket';

// React Library Imports
import { useState } from 'react';
import {Style, textTheme } from '../components/Style' 


// MUI Imports
import { Box, Button, Typography, Modal, TextField, Stack, CircularProgress
} from "@mui/material"

// Folder imports
import everfox_logo from '../../images/everfox_logo.png'
import cards from '../../images/cards.png'

export default function UserStartUp() {
    
  const router = useRouter(); // Initialize the router
  const [open, setOpen] = useState(false);          // Modal State
  const handleOpen = () => setOpen(true);                 // Open Modal
  const handleClose = () => setOpen(false);               // Close Modal
  const [hostName, setHostName] = useState("")            // Host name input

  // Input Validation **
  const handleSubmit = (event: { preventDefault: () => void; }) => {
    router.push("/user");
    socket.emit('user_joined', {value: hostName}); // Tell server host has joined **
    event.preventDefault() // Stops default action of an element from happening
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
                           Welcome to Everfox&apos;s Planning Poker Application!
                         </Typography>
         
                         <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                         To get started, enter your user name. After clicking the &quot;Join Session&quot; button, you will be prompted with a round screen where you can start the planning poker process!
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