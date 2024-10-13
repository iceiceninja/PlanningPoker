import { io } from 'socket.io-client';

// Initialize the Socket.io connection and export it
const socket = io(':3000', { // http://localhost
    path: '/socket.io',
});

  


// You can add any event listeners here that need to be set up globally

export default socket;
