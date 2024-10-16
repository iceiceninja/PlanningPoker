"use client"

// Imports
import Image from "next/image";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import  socket  from "../../socket";

// Added by Michael
import * as React from 'react'; // All react imports
import { useState, useEffect } from 'react';  // React useState
import {PopupBody} from '../components/Style' // CSS JS popup body
import {
    Avatar,
    Stack,
    IconButton,
    TextField,
    // Daniel's imports - start
    Box,            
    Container,
    Typography,
    Button,
    Paper,
    CircularProgress
    // Daniel's imports - end
} from "@mui/material"
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup'; // MUI popup
import Favicon from "react-favicon";
import everfox_logo from '../../images/everfox_logo.png'

/*
    Session Screen for Host:

    This screen allows the Host to start and end a round with a valid topic
    The host should be able to edit the session topic, create a timer, edit the time

    ** TODO LIST **
    1. Fix UI
    - Rearrange the component like in Figma (WIP)
    2. Errors
    - Fix overloading errors
    3. Use server data
    - retrieve data from the host's previous screen
*/

export default function HostSession() {

    const [shouldRender, setShouldRender] = useState(false);
    const socketEmissionHolder = [];

    /* JS Player Components */
    const [sessionId, setSessionId] = useState("");
    const [isJoined, setIsJoined] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [players, setPlayers] = useState([
      { name: "Player 1", vote: null },
      { name: "Player 2", vote: null },
      { name: "Player 3", vote: null },
    ]);

    /* Placeholders */
    const hostName = "Host 1"; // Placeholder for host name
    const sessionDate = "2024-10-10"; // Placeholder for session date
    const userName = "You"; // Use this as the user's display name in the table

    /* Join functionality */
    const handleJoin = () => {
        if (sessionId) {
          // Add the user to the players list when they join
          setPlayers((prevPlayers) => [...prevPlayers, { name: userName, vote: null }]);
          setIsJoined(true);
          // Handle actual session join with backend here
        }
    };

    /* Card Selection */
    const handleCardSelection = (value: any) => {
        setSelectedCard(value);
        // Update the user's vote in the players array
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player.name === userName ? { ...player, vote: value } : player
          )
        );
    };

    // Clock Popup - from clock avatar
    const [anchor, setAnchor] = React.useState(null);
    const open = Boolean(anchor);
    const id = open ? 'simple-popper' : undefined;
    const handleClick = (event: { currentTarget: React.SetStateAction<null>; }) => { // Click Event
        setAnchor(anchor ? null : event.currentTarget);
    };

    // Settings Popup - from avatar
    const [anchor2, setAnchor2] = React.useState(null);
    const open2 = Boolean(anchor2);
    const id2 = open2 ? 'simple-popper' : undefined;
    const handleClick2 = (event2: { currentTarget: React.SetStateAction<null>; }) => { // Click event
        setAnchor2(anchor2 ? null : event2.currentTarget);
    };

    // Input Validation
    const [formData, setFormData] = useState({ hostName: '', sessionTopic: '' });
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState(false)
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()
        setEmailError(false)

        // If session topic is empty
        if (email == '') { setEmailError(true) }

        // If valid session topic String
        if (email) {
            console.log(email)
            const formData = new FormData(event.currentTarget);
            event.preventDefault();
            startRound(formData.get('roundTopic') as string);
        }
    }

    // Start Round function
    function startRound(roundTopic:String)
    {
        socket.emit("start-round", roundTopic, (response: any) => {
            console.log(response);
        });
    }
    
    // End Round Function
    const endRound = () => {
        socket.emit("end-round");
    }

    
    useEffect(() : any => {

    
        const timer = setTimeout(() => {

          setShouldRender(true)
      }, 600); // 3000 milliseconds = 3 seconds
    
      
      });

    if (!shouldRender) {
        return (
          <div>
            {/* Tab Contents: Icon, title */}
            <Favicon url = {everfox_logo.src} /> {/* Using <head> causes internal error */}
            <title>Planning Poker - Everfox</title>
            <Stack 
            sx={{
              width: "100vw",
              height: "100vh",
              justifyContent: "center",
              alignItems: "center", 
              }}
            >
              <CircularProgress />
            </Stack>
          </div>);
    } else {
    return (
        <div>
            <Stack
                direction = "column"
                spacing={2}
                sx = {{
                    display: 'flex',
                    height: '97vh',
                    margin: 0,
                    border: 1,
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                {/* Title Component: Tab's name in browser */}
                <title>Planning Poker - Everfox</title>

                {/* Stack Component: Row [top bar] */}
                <Stack 
                    direction="row" 
                    spacing={2}
                    sx = {{
                        minWidth: '100%',
                        border: 1,
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >


                    <IconButton 
                         onClick={() => {handleClick2}}
                        sx = {{
                            border: 1,
                            marginTop:  '2%',
                            marginLeft: '2%',
                        }}                
                    >
                        {/* Avatar Initial */}
                        {/** TODO: Use formdata to change the initial **/}
                        <Avatar>
                            M
                        </Avatar>

                    </IconButton>

                    <BasePopup id={id2} open={open2} anchor={anchor2}>

                        {/* Takes User back to home screen */}
                        {/** TODO: Make it more presentable with icons **/}
                        <PopupBody>
                            <Link href="/"> Home Page</Link>
                        </PopupBody>

                    </BasePopup>

                    {/* Session Information */}
                    <Box textAlign="center" sx={{ marginBottom: 4, border: 1 }}>
                    <Typography variant="h6">
                        Host: {hostName} | Session Date: {sessionDate} | Session ID: {sessionId}
                    </Typography>
                    </Box>


                    <IconButton 
                       onClick={() => {handleClick2}}
                        sx = {{
                            border: 1,
                            marginTop:  '2%',
                            marginRight: '2%',
                        }}>

                        {/* Comment in html like this! */}
                        <Avatar>
                            C
                        </Avatar>

                    </IconButton>

                    {/* BasePopup */}
                    <BasePopup id={id} open={open} anchor={anchor}>

                        {/* PopupBody component: Shows starting round form */}
                        <PopupBody>

                            {/* Stack component: Column form */}
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
                                {/* Textfield component: Session topic */}
                                <TextField
                                    label="Session Topic"
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    variant="outlined"
                                    color="secondary"
                                    value={email}
                                    error={emailError}
                                    name="roundTopic"
                                    type="text"
                                />

                                {/* Submit button component: Submit */}
                                <button type="submit" className="button-43">Start Round</button>
                        
                            </Stack>

                            {/* Button component: End round */}
                            <button onClick={endRound} className="button-43">End Round</button>
                        </PopupBody>
                    </BasePopup> 
                </Stack>

                {/* Player Arrangement: Simulates sitting around a table */}
                <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 4,
                    marginBottom: 4,
                    border: 1
                }}
                >
                {players.map((player, index) => (
                    <Paper
                    key={index}
                    elevation={3}
                    sx={{
                        width: 120,  // Size of each player card
                        height: 120, // Size of each player card
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 3,
                    }}
                    >
                    <Typography>{player.name}</Typography>
                    <Typography>
                        {player.vote !== null ? player.vote : <CircularProgress size={20} />}
                    </Typography>
                    </Paper>
                ))}
                </Box>

            {/* Card selection section */}
            <Box textAlign="center" sx={{border: 1}}>
              <Typography variant="h6" gutterBottom>
                Select Your Card or Pass
              </Typography>
              <Box 
                sx={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    gap: 1
                }}
              >
                {[1, 2, 3, 5, 8, 13, 20].map((card) => (
                  <Button
                    key={card}
                    variant={selectedCard === card ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleCardSelection(card)}
                  >
                    {card}
                  </Button>
                ))}
                <Button
                  variant={selectedCard === "Pass" ? "contained" : "outlined"}
                  color="secondary"
                  onClick={() => handleCardSelection("Pass")}
                >
                  Pass
                </Button>
              </Box>
              {selectedCard && (
                <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                  You selected: {selectedCard}
                </Typography>
              )}
            </Box>

            </Stack>
            </div>
    )
}
}