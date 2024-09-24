"use client"

import Image from "next/image";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
// import { io } from "socket.io-client";
import  socket  from "../../socket";
export default function Host() {
    // const socket = io(":4000");

    function startRound(roundTopic:String)
    {
        socket.emit("start-round", roundTopic, (response: any) => {
            console.log(response);
        });
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        const formData = new FormData(event.currentTarget);
        event.preventDefault();
        startRound(formData.get('roundTopic') as string);
    }

    return (
        <div>
            <h1> Hello World!</h1>
            <Link href="/"> Home Page</Link>
            <form onSubmit={handleSubmit}>
                <label>
                    Round topic:
                    <input
                        type="text"
                        name="roundTopic"
                    />
                </label>
                <button type="submit" className="button-43">Start a Session</button>
            </form>
        </div>
    )

}