"use client"

// Imports
import Image from "next/image";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import  socket  from "../../socket";

import { createTheme } from '@mui/material/styles';

// Added by Michael
import * as React from 'react'; // All react imports
import { useState, useEffect } from 'react';  // React useState
import {PopupBody} from '../components/Style' // CSS JS popup body
import {
    Avatar,
    Stack,
    IconButton,
    TextField,
    Box,            
    Container,
    Typography,
    Button,
    Paper,
    CircularProgress,
    ThemeProvider,
    // Daniel's imports - end
} from "@mui/material"
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup'; // MUI popup
import Favicon from "react-favicon";
import everfox_logo from '../../images/everfox_logo.png'
import { getDisplayHostname, setDisplayHostname } from '../../globalHost';
import { Drawer, List, ListItem } from '@mui/material';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

const textTheme = createTheme({});
 

export default function HostSession() {

    const [shouldRender, setShouldRender] = useState(false);
    const socketEmissionHolder = [];

    /* JS Player Components */
    const [sessionId, setSessionId] = useState("");
    const [isJoined, setIsJoined] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [players, setPlayers] = useState([
      { name: getDisplayHostname(), vote: "" },
    ]);

    const [sessionTopic, setSessionTopic] = useState([
        { name: getDisplayHostname(), vote: "" },
      ]);

    /* Placeholders */
    const hostName = "Host 1"; // Placeholder for host name
    const sessionDate = "2024-10-10"; // Placeholder for session date
    const userName = "You"; // Use this as the user's display name in the table
    var lengthChange = -1; // Only update the state if the length changes, otherwise this infinitely loops
    // Array of month names
    const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

    
    var d = new Date(new Date().toLocaleString('en', {timeZone: 'America/New_York'}))
    var datestring = ("0" + d.getDate()).slice(-2) + "-" + monthNames[d.getMonth()] + "-" +
    d.getFullYear()

    const [timestamp, setTimestamp] = useState(datestring);

    

    socket.on("return_user_name", (allPlayers) => {
        console.log("YEYEYEYEYEYYEYEYE BUDDDDYYY");     
        setPlayers(allPlayers);
        console.log(players);
        console.log(allPlayers)
        lengthChange = players.length;
      
    })
    



    /* Card Selection */
    const handleCardSelection = (value: any) => {
        setSelectedCard(value);
        // Update the user's vote in the players arrayh
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player.name === userName ? { ...player, vote: value } : player
          )
        );
    };

    // Clock Popup - from clock avatar
    const [anchor, setAnchor] = React.useState(null);
    const [visible, setVisible] = useState(true);
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
    } 
    
    else {
    return (

        <div>
              <Layout>
            <Sider width={200} style={{ position: 'fixed', right: 0, height: '100vh', background: 'transparent' }}>
                <Menu style={{ background: 'transparent'}} mode="vertical">
                    <Menu.Item style={{ background: 'transparent'}}  key="1">Item 1</Menu.Item>
                    <Menu.Item key="2">Item 2</Menu.Item>
                    <Menu.Item key="3">Item 3</Menu.Item>
                </Menu>
            </Sider>
        </Layout>
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
     <Drawer
            anchor="right"
            open={open}
        >
            <List>
                pelasllreslresr
            </List>
        </Drawer>   




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

                        <PopupBody>
                            <Link href="/"> Home Page</Link>
                        </PopupBody>

                    </BasePopup>

                    {/* Session Information */}
                    <Box textAlign="center" sx={{ marginBottom: 4, border: 1 }}>
                    <Typography variant="h6">
                        Host: {getDisplayHostname()} | Session Date: {timestamp} 
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
                    <ThemeProvider theme = {textTheme}>
                            <Typography
                                variant="h6"
                                align="center"
                            >
                        <p>Session topic</p>
                         <input type="text" />
                            </Typography>
                        </ThemeProvider>

                {/* Player Arrangement: Simulates sitting around a table */}
                <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 4,
                    marginBottom: 4,
                    border: "transparent",
                    width: "70%",
                    marginRight: 2000
                }}
                >
                {players.map((player, vote) => (
                    <Paper
                    key={player.name}
                    elevation={3}
                    sx={{
                        width: 100,  // Size of each player card
                        height: 100, // Size of each player card
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 3,
                        marginRight: 3,
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