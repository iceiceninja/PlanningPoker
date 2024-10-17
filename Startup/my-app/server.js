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




const NO_USERS  = 0;
const HOST_EXISTS = 1;
const HOST_NANE = "host";
let players = new Queue;
var idForEachPlayerQueue = [];
var idToPlayerName = new Map();
const io = new Server(server);



io.on('connection', (socket) => {


  // We have to make sure not to push the host into the queue.
  if (idToPlayerName.size >= HOST_EXISTS) 
   {
     idForEachPlayerQueue.push(socket.id)
     socket.emit("host_exists", "True");
   }

  idToPlayerName.size == NO_USERS ?  idToPlayerName.set(socket.id, "host") : idToPlayerName.set(socket.id, "user");
  console.log(socket.id);
  console.log(idToPlayerName.size);


  

  socket.on('disconnect', () => {
    var nextHostId = idForEachPlayerQueue.shift();
   if(idToPlayerName.get(socket.id) == HOST_NANE) {
      if (idToPlayerName.size == NO_USERS) {
        socket.emit("no_users_present", "True");
      }

      idToPlayerName.delete(socket.id);
      idToPlayerName.set(nextHostId, "host");

      console.log("assigned the new host as " + nextHostId);
    }

    io.emit("next_host", "True");

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
