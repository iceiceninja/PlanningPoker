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
function getHostIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1'; // Fallback to localhost if no other IP found
}

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

  // const io = new Server(server, {
  //   cors: {
  //     origin: "*",
  //     methods: ["GET", "POST"],
  //   },
  // });

  // Host connection
  /*
    In a server:
      The first user to join is the host
      The rest of the users are users
      If the host user leaves, the user who connected
      first out of the remaining users will become the host
      Potential issue:
        If you refresh your page as a host, you are no longer the host
        Add a timer to fix this
  */

  // Variables
  let playerids = []; // Player list with ids
  const io = new Server(server); // Server instance

  // When user (client) joins the server
  io.on('connection', (socket) => {

    // Add id to player id list
    playerids.push(socket.id)

    // Testing
    console.log('user[' + socket.id + '] connected: ' + playerids.length)

    // User joined
    socket.emit("user_joined", "True") // this doesn't do anything right now

    // If Host is in Server
    if (playerids.length > 1) {
      socket.emit("host_exists", "True");
      console.log("Host Exists user[" + playerids[0] + "]\n");

      // Tell client that it's a user [only once]
      // console.log("send to user page");
      socket.once("clientType", (callback) => { callback({ clientType: "user" }); });

    } else {
      console.log("Host Joined user[" + playerids[0] + "]\n");

      // Tell client that it's the host [only once]
      // console.log("send to host page");
      socket.once("clientType", (callback) => { callback({ clientType: "host" }); });
    }

    // If user leaves
    socket.on('disconnect', () => {

      // If host disconnected, initialize new host
      if (socket.id == playerids[0]) {

        // Dequeue host id from player id list
        prev_host = playerids.shift()
        console.log("Host Left: user[" + prev_host + "]")

        // If server is empty
        if (playerids.length == 0) {
          console.log("No Host: 0 users\n")
        } else {
          console.log("New Host: user[" + playerids[0] + "]: " + playerids.length + "\n")
        }
      }
      // If user is not the host, remove from player list normally
      else {

        // Remove user from list
        playerids.splice(playerids.indexOf(socket.id), 1)

        // Normal Disconnect message
        console.log('user[' + socket.id + '] disconnected: ' + playerids.length)
        console.log("")
      }
    });
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
