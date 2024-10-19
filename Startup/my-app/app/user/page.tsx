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
import IconButton from '@mui/material/IconButton';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import {PopupBody} from '../components/Style'

import Stack from '@mui/material/Stack';

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

    socket.on("next_host", (data) => {
       console.log("HAHHAHAHAHAHAAHAHDHSFHDSASFJDAFHAHHAHAAHAH")
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



    return (
        <div>
            <Stack 
                id = "outline"
                direction="row" 
                spacing={2}
                useFlexGap
                sx = {{
                    justifyContent: "space-between",
                    alignItems: "flex-start"
                }}>
                <IconButton 
                   onClick={() => {handleClick2}}
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
                    sx = {{
                        marginTop:  '2%',
                        marginRight: '2%',
                    }}>
                    <Avatar>
                        C
                    </Avatar>
                </IconButton>
            </Stack>
            <div className = ", footer">
                <title>Planning Poker - Everfox</title>
                <Stack               
                    direction="row" 
                    spacing={2}
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
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
        </div>
    )

}

{
    
}