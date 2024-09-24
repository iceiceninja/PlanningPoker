"use client"

import Image from "next/image";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import socket from "../../socket";
import { MouseEvent } from "react";

export default function host() {

    // sendVote(e)
    const sendVote = (event: MouseEvent<HTMLButtonElement>) => {
        socket.emit("vote-selected", { id: "123", value: event.currentTarget.value }); // userId, vote value
    }
    socket.on('display-votes', (userVotes) => {
        console.log(userVotes)
    })
    return (
        <div>
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