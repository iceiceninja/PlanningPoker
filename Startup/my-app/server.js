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
const ONE_USER   = 1;
const HOST_EXISTS = 1;
const HOST_NANE = "host";
let players = new Queue;
var idForEachPlayerQueue = [];
var idToPlayerName = new Map();
const io = new Server(server);



io.on('connection', (socket) => {

  idForEachPlayerQueue.push(socket.id)

  if (idForEachPlayerQueue.length > HOST_EXISTS) 
   {
     socket.emit("host_exists", "True");
   }

  idForEachPlayerQueue.length == ONE_USER ?  idToPlayerName.set(socket.id, "host") : idToPlayerName.set(socket.id, "user");
  console.log(socket.id);


  

  socket.on('disconnect', () => {
   if(idToPlayerName.get(socket.id) == HOST_NANE) {
      var nextHostId = idForEachPlayerQueue.shift();
      idToPlayerName.delete(socket.id);
      idToPlayerName.set(nextHostId, "host");
      io.to(nextHostId).emit("new_host");
      console.log("assigned the new host as " + nextHostId);
    }

    if (idToPlayerName.size() == 0) {
      socket.emit("no_users_present", "True");
    }



    console.log('user disconnected');
  });

  
});



  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on port ${PORT}`);
  });
});

class Queue {
  constructor() {
    this.queue = [];
  }

  enqueue(element) {
    this.queue.push(element);
    return this.queue;
  }

  dequeue() {
    return this.queue.shift();
  }

  peek() {
    return this.queue[0];
  }

  reverse() {
    // Declare an empty array
    const reversed = [];

    // Iterate through the array using a while loop
    while (this.queue.length > 0) {
      reversed.push(this.queue.pop());
    }
    // Set queue using the new array
    this.queue = reversed;
    return this.queue;
  }
}
