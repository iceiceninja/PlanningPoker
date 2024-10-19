// cd Startup/my-app
// node server.js
// localhost:4000
// 1. change to 3000 
// 2. 

"use client"

import Image from "next/image";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import socket from "../../socket";
import { MouseEvent, useState, useEffect } from "react";
import Timer from "../components/timer";
import * as React from 'react';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import {PopupBody} from '../components/Style'
import { Avatar, Box, Button, IconButton, Stack, ThemeProvider, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import LinkIcon from '@mui/icons-material/Link';
import { buttonTheme, Style, textTheme } from '../components/Style' 
import { shadows } from '@mui/system';

export default function Host() {

    const router = useRouter(); // Initialize the router
    const [anchor2, setAnchor2] = React.useState(null);
    const open2 = Boolean(anchor2);
    const id2 = open2 ? 'simple-popper' : undefined;
    const handleClick2 = (event2: { currentTarget: React.SetStateAction<null>; }) => {
        setAnchor2(anchor2 ? null : event2.currentTarget);
    };

    // sendVote(e)
    const sendVote = (event: MouseEvent<HTMLButtonElement>) => {
        socket.emit("vote-selected", { id: "123", value: event.currentTarget.value }); // userId, vote value
    }
    socket.on('display-votes', (userVotes : any) => {
        console.log(userVotes)
    })
    socket.on('round-topic', (topic: String) => {
        console.log("Round topic is: " + topic);
    })
    socket.on('countdown-init', () => { // can pass in an arg to make the timer variable. (10 sec, 1 min, 5 min etc.)
        console.log("countdown init");

    })

    useEffect(() => {
        socket.on("host_left", () => {
          router.push('/');
        });
    });

    // Variables
    let name: string = "Kaiden"
    let topicName: string = "Food Session"      // TODO: Limit to 36 chars in backend
    let hostName: string = "Dustin Endres"      // TODO: Limit to 20 chars in backend
    let topic: string = "Hi! Today we will be making a project about food. I like food. You like food."
        + " We all love food! So, how long would this project take? I estimate 3.50!"
                                                // TODO: Limit to 150 chars in backend

    return (
        <>
            <Box height={135}>
                <Stack 
                    id = "outline"
                    direction="row" 
                    spacing={2}
                    useFlexGap
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Box sx={{ width: "16vw", minWidth: 80, maxWidth: 160 }}>
                        <IconButton
                            onClick={() => {handleClick2}}
                            sx = {{
                                width: "12vw",
                                height: "12vw",
                                maxWidth: 75,
                                maxHeight: 75
                            }}                
                        >
                            <Avatar {...stringAvatar(name)} />
                        </IconButton>
                    </Box>
                    <BasePopup id={id2} open={open2} anchor={anchor2}>
                        <PopupBody>
                            <Link href="/"> Home Page</Link>
                        </PopupBody>
                    </BasePopup>
                    <Stack 
                        direction = "column" 
                        spacing={0}
                        sx={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 2,
                            bgcolor: "#F3F1F6",
                            borderRadius: '8px',
                            width: "50vw",
                            height: "10vh",
                            maxWidth: 500,
                            boxShadow: 4
                        }}
                        >
                        <ThemeProvider theme = {textTheme}>
                            <Typography
                                variant="h6"
                                align="center"
                            >
                                {topicName}
                            </Typography>
                        </ThemeProvider>
                        <ThemeProvider theme = {textTheme}>
                            <Typography
                                variant="subtitle1"
                                align="center"
                            >
                                Host: {hostName}
                            </Typography>
                        </ThemeProvider>
                    </Stack>
                    <Stack
                        direction="column"
                        spacing={2}
                        width="10vw"
                        height="12vh"
                        sx = {{
                            width: 160,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <ThemeProvider theme = {buttonTheme}>
                            <Button
                                variant="contained"
                                startIcon={<InfoIcon />}
                                sx={{
                                    width: "16vw",
                                    maxWidth: 160,
                                    height: "4vh"
                                }}
                            >
                                <ThemeProvider theme = {textTheme}>
                                    <Typography
                                        variant="button"
                                        align="center"
                                    >
                                        How to Play
                                    </Typography>
                                </ThemeProvider>
                            </Button>
                        </ThemeProvider>
                        <ThemeProvider theme = {buttonTheme}>
                            <Button
                                variant="contained"
                                startIcon={<LinkIcon />}
                                sx={{
                                    width: "16vw",
                                    maxWidth: 160,
                                    height: "4vh"
                                }}
                            >
                                <ThemeProvider theme = {textTheme}>
                                    <Typography
                                        variant="button"
                                        align="center"
                                    >
                                        Invite Link
                                    </Typography>
                                </ThemeProvider>
                            </Button>
                        </ThemeProvider>
                    </Stack>
                </Stack>
                <div className = ", footer">
                    <title>Planning Poker - Everfox</title>
                    <Stack               
                        direction="row" 
                        spacing={2}
                        sx={{
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        >
                        <button onClick={sendVote} className="card" value={"pass"}>Pass</button>
                        <button onClick={sendVote} className="card" value={1}>1</button>
                        <button onClick={sendVote} className="card" value={2}>2</button>
                        <button onClick={sendVote} className="card" value={3}>3</button>
                        <button onClick={sendVote} className="card" value={5}>5</button>
                        <button onClick={sendVote} className="card" value={8}>8</button>
                        <button onClick={sendVote} className="card" value={13}>13</button>
                        <button onClick={sendVote} className="card" value={21}>21</button>
                        <button onClick={sendVote} className="card" value={"?"}>?</button>
                    </Stack>

                </div>
            </Box>

            <Box
                sx={{
                    width: "40vw",
                    height: "20vh",
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    margin: "auto",
                    bgcolor: "#F3F1F6",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 2,
                    borderRadius: '8px',
                    boxShadow: 4
                }}
            >
                <ThemeProvider theme = {textTheme}>
                    <Typography
                        variant="body1"
                        align="center"
                    >
                        {topic}
                    </Typography>
                </ThemeProvider>
            </Box>
        </>
    )

}

// For top div's Avatar - Converts name into a color
function stringToColor(string: string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
// For top div's Avatar - Updates avatar's name and bg color
function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: "12vw",
        height: "12vw",
        maxWidth: 75,
        maxHeight: 75
      },
      children: `${name[0]}`,
    };
}