"use client"

import Image from "next/image";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import socket from "../../socket";
import { MouseEvent } from "react";
import Timer from "../components/timer";

export default function host() {

    // sendVote(e)
    const sendVote = (event: MouseEvent<HTMLButtonElement>) => {
        socket.emit("vote-selected", { id: "123", value: event.currentTarget.value }); // userId, vote value
    }
    socket.on('display-votes', (userVotes) => {
        console.log(userVotes)
    })
    socket.on('round-topic', (topic: String) => {
        console.log("Round topic is: " + topic);
    })
    socket.on('countdown-init', () => { // can pass in an arg to make the timer variable. (10 sec, 1 min, 5 min etc.)
        console.log("countdown init");

    })
    return (
        <div>
            <Timer initialTime={60}/>
            <h1> Please Select Your Vote</h1>
            <Link href="/"> Home Page</Link>
            <button onClick={sendVote} className="button-43" value={"pass"}>PASS</button>
            <button onClick={sendVote} className="button-43" value={1}>1</button>
            <button onClick={sendVote} className="button-43" value={2}>2</button>
            <button onClick={sendVote} className="button-43" value={3}>3</button>
            <button onClick={sendVote} className="button-43" value={5}>5</button>
            <button onClick={sendVote} className="button-43" value={8}>8</button>
            <button onClick={sendVote} className="button-43" value={13}>13</button>
            <button onClick={sendVote} className="button-43" value={21}>21</button>
            <button onClick={sendVote} className="button-43" value={"?"}>?</button>
        </div>
    )

}