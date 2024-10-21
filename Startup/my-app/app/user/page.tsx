// cd Startup/my-app
// node server.js
// localhost:4000
// 1. change to 3000 
// 2. 

"use client"

import Image from "next/image";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import socket from '../../socket';
import { MouseEvent, useState, useEffect } from "react";
import Timer from "../components/timer";
import * as React from 'react';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import {PopupBody} from '../components/Style'
import { getGlobalSession, setGlobalSession } from '../../globalSession';
import { getDisplayHostname, setDisplayHostname } from '../../globalHost';
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
import InfoIcon from '@mui/icons-material/Info';
import LinkIcon from '@mui/icons-material/Link';
import { buttonTheme, Style, textTheme } from '../components/Style' 
import { shadows } from '@mui/system';
import { Truculenta } from "next/font/google";

export default function Host() {

    const router = useRouter(); // Initialize the router
    const [anchor2, setAnchor2] = React.useState(null);
    const [isClicked, setIsClicked] = useState(false);

    const open2 = Boolean(anchor2);
    const id2 = open2 ? 'simple-popper' : undefined;
    const [userVotes, setUserVotes] = useState(0);
    const [cardSelected, setCardSelected] = useState(false);
    const [previousValue, setPreviousValue] = useState("-1");
    var lengthChange = -1;
    var inititalMap = new Map([
        ["Pass", false],
        ["1", false],
        ["2", false],
        ["3", false],
        ["5", false],
        ["8", false],
        ["13", false],
        ["21", false],
        ["?", false],
      ]);
      const [players, setPlayers] = useState([
        { name: getDisplayHostname(), vote: "" },
      ]);
      const [buttonStates, setButtonStates] = useState(inititalMap);



    // sendVote(e)
    const sendVote = (event: MouseEvent<HTMLButtonElement>) => {
        const newButtonStates = new Map(buttonStates);
        newButtonStates.forEach((value, key) => {
            if(key == event.currentTarget.value) {
                console.log(event.currentTarget.value)
                newButtonStates.set(event.currentTarget.value, !newButtonStates.get(event.currentTarget.value));
            }
            else {
                newButtonStates.set(key, false);
            }
        });
        setButtonStates(newButtonStates);

        //if you click two different cards, it should automatically update.
        if (previousValue != event.currentTarget.value || cardSelected == false) {
            setPreviousValue(event.currentTarget.value);
            setCardSelected(true)
            console.log(cardSelected + "asdfasdfsdsafsfs");
            socket.emit("vote-selected", {value: event.currentTarget.value, selected: true}); // userId, vote value
        }

        //if you click the same card twice, its assumed you deselected it.
        else {
            if (previousValue != event.currentTarget.value) {
                setCardSelected(true)
                socket.emit("vote-selected", {value: event.currentTarget.value, selected: true}); // userId, vote value
            }
            else {
                setCardSelected(false)
                console.log(cardSelected + "sdhfksadhjfasdklfjdsafjdsafjsdaf;jsda;lfjsdaf;asldfjasdl;fjasl")
                socket.emit("vote-selected", {value: event.currentTarget.value, selected: false}); // userId, vote value
            }
        }
    }

    const handleClick2 = (event2: { currentTarget: React.SetStateAction<null>; }) => {
        setAnchor2(anchor2 ? null : event2.currentTarget);
    };

    socket.on("return_user_name", (allPlayers) => {  
        setPlayers(allPlayers);
        lengthChange = players.length;
      
    })



    socket.on("display_votes", (msg) => {
        setUserVotes(msg);
      });

    socket.on('round-topic', (topic: String) => {
        console.log("Round topic is: " + topic);
    })
    socket.on('countdown-init', () => { // can pass in an arg to make the timer variable. (10 sec, 1 min, 5 min etc.)
        console.log("countdown init");

    })

    useEffect(() => {
        socket.on("host_exists", () => {
          router.push('/user');
        });
      });

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
                        <button onClick={sendVote} className={buttonStates.get("Pass") ? "cardUp card cardHover" : "card cardHover"}  value={"Pass"}>Pass</button>
                        <button onClick={sendVote}  className={buttonStates.get("1") ? "cardUp card cardHover" : "card cardHover"}  value={"1"}>1</button>
                        <button onClick={sendVote}  className={buttonStates.get("2") ? "cardUp card cardHover" : "card cardHover"}  value={"2"}>2</button>
                        <button onClick={sendVote}  className={buttonStates.get("3") ? "cardUp card cardHover" : "card cardHover"}  value={"3"}>3</button>
                        <button onClick={sendVote}  className={buttonStates.get("5") ? "cardUp card cardHover" : "card cardHover"}  value={"5"}>5</button>
                        <button onClick={sendVote}  className={buttonStates.get("8") ? "cardUp card cardHover" : "card cardHover"}  value={"8"}>8</button>
                        <button onClick={sendVote}  className={buttonStates.get("13") ? "cardUp card cardHover" : "card cardHover"}  value={"13"}>13</button>
                        <button onClick={sendVote}  className={buttonStates.get("21") ? "cardUp card cardHover" : "card cardHover"}  value={"21"}>21</button>
                        <button onClick={sendVote} className={buttonStates.get("?") ? "cardUp card cardHover" : "card cardHover"}  value={"?"}>?</button>
                    </Stack>

                </div>
            </Box>
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
                    marginTop: 4
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