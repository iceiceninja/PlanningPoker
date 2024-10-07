"use client"

import Image from "next/image";
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import  socket  from "../../socket";
export default function Host() {

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
                <button type="submit" className="button-43">Start Round</button>
            </form>
            <button onClick={endRound} className="button-43">End Round</button>
        </div>
    )

}