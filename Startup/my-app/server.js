const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require("socket.io");
const express = require('express');
const path = require('path');  // This helps resolve paths correctly
const short = require('short-uuid');

const nextApp = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = nextApp.getRequestHandler();
const expressApp = express();

// Store room info
let rooms = {};

// Serve static files from the "host" folder
expressApp.use(express.static(path.join(__dirname, 'host')));

// Serve static files from the "user" folder
expressApp.use(express.static(path.join(__dirname, 'user')));

// Serve static files from the "host" folder
expressApp.use(express.static(path.join(__dirname, 'images')));

// Create or join a session
expressApp.get('/', (req, res) => {
  const roomId = short.generate();  // Generate a unique room ID
  rooms[roomId] = { users: [] };    // Initialize room with an empty users list
  res.redirect(`/session/${roomId}`);  // Redirect user to their unique session URL
});

// Serve the session page (host or guest based on room)
expressApp.get('/session/:roomId', (req, res) => {
  const roomId = req.params.roomId;

  // Check if the room exists
  if (!rooms[roomId]) {
    return res.status(404).send('Room not found');
  }

  // Send the host page for the first user, guest page for subsequent users
  if (rooms[roomId].users.length === 0) {
    res.sendFile(__dirname + '/public/host.html');  // Serve the host page
  } else {
    res.sendFile(__dirname + '/public/guest.html'); // Serve the guest page
  }
});

nextApp.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Create the server... we need to change this to the machine name later.... TODO
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  //Connection is default, for example when we do http://localhost:3000, it will automatically trigger "connection"
  io.on('connection', (socket) => {
    console.log('Client connected'); // ctrl shift j (all at once) to see this log

    console.log('A user connected', socket.id);
    let roomId = socket.handshake.query['roomId'];
    if (!roomId) { 
        roomId = short.generate(); //generates a unique room...
        socket.emit('room', roomId);
    }
    socket.join(roomId);




    socket.on('message', (data) => {
      console.log('Message from client:', data.text);
    });

    // Handle user joining a room
    socket.on('joinRoom', (roomId) => {
    // Check if the room exists
    if (!rooms[roomId]) {
      socket.emit('error', 'Room not found');
      return;
    }

    // Add the user to the room and track them
    rooms[roomId].users.push(socket.id);
    socket.join(roomId);  // Join the Socket.IO room

    console.log(`User ${socket.id} joined room: ${roomId}`);

    // Inform the client whether they are the first user (startup) or subsequent (redirect)
    if (rooms[roomId].users.length === 1) {
      socket.emit('startupScreen');
    } else {
      socket.emit('redirectToWaitingRoom');
    }

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.id} left room: ${roomId}`);
      rooms[roomId].users = rooms[roomId].users.filter(id => id !== socket.id);

      // If room is empty, delete it
      if (rooms[roomId].users.length === 0) {
        delete rooms[roomId];
        console.log(`Room ${roomId} deleted due to no users.`);
      }
    });
  });
    
  

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });

    

  });

  


  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});