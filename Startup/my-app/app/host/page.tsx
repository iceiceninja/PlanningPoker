"use client"

import Image from "next/image";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import  socket  from "../../socket";

// Avatar
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange, deepPurple } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';

// Popup
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import SvgIcon from '@mui/joy/SvgIcon';
import {PopupBody} from '../components/Style'

import { useState, useEffect } from 'react';
import { TextField, FormControl } from "@mui/material"; // and Button


export default function Host() {

    // Popup 1 
    const [anchor, setAnchor] = React.useState(null);
    const open = Boolean(anchor);
    const id = open ? 'simple-popper' : undefined;
    const handleClick = (event: { currentTarget: React.SetStateAction<null>; }) => {
        setAnchor(anchor ? null : event.currentTarget);
    };

    // Popup 2
    const [anchor2, setAnchor2] = React.useState(null);
    const open2 = Boolean(anchor2);
    const id2 = open2 ? 'simple-popper' : undefined;
    const handleClick2 = (event2: { currentTarget: React.SetStateAction<null>; }) => {
        setAnchor2(anchor2 ? null : event2.currentTarget);
    };

    // Input Validation
    const [formData, setFormData] = useState({ hostName: '', sessionTopic: '' });
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState(false)
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()
        setEmailError(false)
        if (email == '') {
            setEmailError(true)
        }
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

    const handleSubmit2: React.FormEventHandler<HTMLFormElement> = (event) => {
        const formData = new FormData(event.currentTarget);
        event.preventDefault();
        startRound(formData.get('roundTopic') as string);
    }
    socket.on('round-topic',(arg:String)=>
        {
            console.log("Round topic is: " + arg);
        })
    const endRound = () => {
        socket.emit("end-round");
    }
    socket.on('display-votes', (userVotes) =>
        {
            console.log(userVotes)
        })
    return (
        <div>
            <Stack 
                direction="row" 
                spacing={2}
                useFlexGap
                sx = {{
                    justifyContent: "space-between",
                    alignItems: "flex-start"
                }}>
                <IconButton 
                    onClick = {handleClick2}
                    sx = {{
                        marginTop:  '2%',
                        marginLeft: '2%',
                    }}                
                >
                    <Avatar>
                        M
                    </Avatar>
                </IconButton>
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
                      }}
                    >
                    <h1 className = 'margin0 marginTop' >
                        9/14/24 - Food Session
                    </h1>
                    <h2 className = 'margin0'>
                        Host: Dustin Endres
                    </h2>
                </Stack>
                <IconButton 
                    onClick = {handleClick}
                    sx = {{
                        marginTop:  '2%',
                        marginRight: '2%',
                    }}>
                    <Avatar>
                        C
                    </Avatar>
                </IconButton>
                <BasePopup id={id} open={open} anchor={anchor}>
                    <PopupBody>
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
                            <button type="submit" className="button-43">Start Round</button>
                            
                        </Stack>
                        <button onClick={endRound} className="button-43">End Round</button>
                    </PopupBody>
                </BasePopup>
                <title>Planning Poker - Everfox</title>
            </Stack>
        </div>
    )
}

{/*
            <form onSubmit={handleSubmit}>
                <label>
                    Round topic:
                    <input
                        type="text"
                        name="roundTopic"
                    />
                </label>
                <button type="submit" className="button-43">Start Round</button>
            </form>
            <button onClick={endRound} className="button-43">End Round</button>
*/}