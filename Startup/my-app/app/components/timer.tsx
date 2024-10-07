import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface State {
    time: number;
    seconds: number;
    minutes: number;
}

interface Props {
    initialTime: number;
}

const socket: Socket = io('http://localhost:4000');

const Timer: React.FC<Props> = ({ initialTime }) => {
    const [state, setState] = useState<State>({
        time: initialTime,
        seconds: initialTime - Math.floor((initialTime) / 60) * 60,
        minutes: Math.floor((initialTime) / 60),
    });

    const [timerActive, setTimerActive] = useState(false);

    // Listen for "start" event from the server
    useEffect(() => {
        socket.on('start', () => {
            console.log('Timer started by server');
            setTimerActive(true);
        });

        // Cleanup on component unmount
        return () => {
            socket.off('start');
        };
    }, []);

    // Timer logic
    useEffect(() => {
        if (!timerActive || state.time <= 0) return;

        const timerId = setTimeout(() => {
            setState((prevState) => ({
                time: prevState.time - 1,
                minutes: Math.floor((prevState.time - 1) / 60),
                seconds: (prevState.time - 1) % 60,
            }));
        }, 1000);

        return () => clearTimeout(timerId);
    }, [timerActive, state.time]);

    return (
        <div>
            <h2>
                {`${state.minutes}:${state.seconds < 10 ? `0${state.seconds}` : state.seconds}`}
            </h2>
            {!timerActive && <p>Waiting for server to start the timer...</p>}
        </div>
    );
};

export default Timer;
