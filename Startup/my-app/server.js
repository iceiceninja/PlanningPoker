const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require("socket.io");
const express = require('express');
const path = require('path');  // This helps resolve paths correctly
const short = require('short-uuid');
const { io } = require('socket.io-client');

const nextApp = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = nextApp.getRequestHandler();
const expressApp = express();
const os = require('os'); // Import os module to get network information
const PORT = process.env.PORT || 3000;  // Default to port 4000 instead of 3000

// Serve static files from the: 
expressApp.use(express.static(path.join(__dirname, 'host'))); // "host" folder
expressApp.use(express.static(path.join(__dirname, 'user'))); // "user" folder
expressApp.use(express.static(path.join(__dirname, 'images'))); // "images folder"

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

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', socket => {
    console.log('Client connected');

    socket.on('message', (data) => {
      console.log('Message from client:', data.text);
    });
    socket.on("start-round", (topic) => { // a
      console.log("Host has started the round. The topic is: " + topic); // "world"
      socket.broadcast.emit('round-topic', topic); // This broadcasts the message to all except the sender
      io.emit('start');
      // callback("Server ACK");
    });
    socket.on("end-round",() => // votes should be a map {userId: vote}
      {
        socket.broadcast.emit('display-votes', playerVotes);
        // socket.emit('display-votes', playerVotes)
        playerVotes={}
      });
    socket.on("vote-selected", (vote)=>
        {
          // playerVotes.set(vote.id,vote.value);
          // playerVotes.push({"id": vote.id, "value":vote.value})
          storeVote(vote.id, vote.value)
          console.log("Player " + vote.id + " has voted " + vote.value)
          // console.log(playerVotes)
        });
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
    // TODO: init Countdown
    socket.on('countdown',()=>
    {
      socket.broadcast.emit('init-countdown') // handle actual countdown logic clientside 
    })
  });


  server.listen(PORT, (err) => {
    if (err) throw err;
    const hostIP = getHostIPAddress();
    console.log(`Server is running at http://${hostIP}:${PORT}`);
  });
});

{/* Leftover Code

  var hostExists = false;
  var host = " ";
  let idToPlayerName = {};
  
  if (hostExists) {
     socket.emit("host_exists", "True");
     console.log("host already exists");   
  }

  // socket.emit("host_left", "True");
  // hostExits = false;

  socket.on('host_joined', (msg) => {
    // idToPlayerName[socket.id] = "host";
    // console.log(msg.hostName);
  });

*/}
