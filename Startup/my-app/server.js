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

const PORT = process.env.PORT || 3000;  // Default 3000

// Serve static files from the "host" folder
expressApp.use(express.static(path.join(__dirname, 'host')));

// Serve static files from the "user" folder
expressApp.use(express.static(path.join(__dirname, 'user')));

// Serve static files from the "host" folder
expressApp.use(express.static(path.join(__dirname, 'images')));

// const playerVotes = new Map();
// const playerVotes = []


nextApp.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });
  // Example object to store user votes
  playerVotes = {};

  function storeVote(userId, vote) {
    playerVotes[userId] = vote;
  }



var hostExists = false;
var host = " ";
let players = [];
let idToPlayerName = {};
const io = new Server(server);



io.on('connection', (socket) => {
  console.log('a user connected');
  console.log(hostExists);

  idToPlayerName[socket.id] = " ";

  if (hostExists) {
     socket.emit("host_exists", "True");
     console.log("host already exists");
  }

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('host_joined', (msg) => {
    console.log(msg);
    hostExists = true;
    socket.emit()
  });
  
});



  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on port ${PORT}`);
  });
});

