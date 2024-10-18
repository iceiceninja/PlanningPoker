import { io } from 'socket.io-client';

// Initialize the Socket.io connection and export it
const socket = io(
    ':3000', 
    { // http://localhost
        path: '/socket.io',
        'force new connection': true, // avoid reusing connections
        auth: {
            offset: undefined
        }, 
        transports: ['websocket'], // xhr poll error
        cors: {  
            origin: '*'
        }
    });

// You can add any event listeners here that need to be set up globally

export default socket;
