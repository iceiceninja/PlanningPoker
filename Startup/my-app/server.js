

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
const { SystemSecurityUpdate } = require('@mui/icons-material');
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
  const HOST_EXISTS = 1;
  const HOST_NANE = "host";
  var idForEachPlayerQueue = [];
  var idToPlayerName = new Map();
  var idToPlayerVote = new Map();
  var storePlayers = [];
  const io = new Server(server);
  const NO_USERS = 0;
  var average = 0;



  function onUserJoin(socket) {
     // We have to make sure not to push the host into the queue.
    if (idToPlayerName.size >= HOST_EXISTS) 
      {
        idForEachPlayerQueue.push(socket.id)
        socket.emit("host_exists", "True");
      }

      idToPlayerName.size == NO_USERS ?  idToPlayerName.set(socket.id, "host") : idToPlayerName.set(socket.id, "user");
      
  }

  function getOrDefault(map, key, defaultValue = "", selected) {
    if (selected)
    return map.get(key) ?? defaultValue;

    else {
      map.set(key, defaultValue);
      return map.get(key);
    }
}



  // When user (client) joins the server
  io.on('connection', (socket) => {

  // We have to make sure not to push the host into the queue.
  if (idToPlayerName.size >= HOST_EXISTS) 
   {
     idForEachPlayerQueue.push(socket.id)
     socket.emit("host_exists", "True");
   }


  idToPlayerName.size == NO_USERS ?  idToPlayerName.set(socket.id, "host") : idToPlayerName.set(socket.id, "user");
   console.log("user connected");
  

  socket.on('disconnect', () => {
    var nextHostId = idForEachPlayerQueue.shift();
    
    //if we find the host, remove the host, and set the new hostid.
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


  socket.on("user_joined", (data) => {
    
    idToPlayerName.set(socket.id, data.value)

 // converting the map into an array
    const newArray = Array.from(idToPlayerName).map(([id, name]) => ({
      name,      // The name from the Map
      vote: " " 
    }));
    
    io.emit("return_user_name", newArray);
        
  })



  socket.on("vote-selected", (data) => {
    var targetsValue = data.value;
    var isSelected = data.selected;

    idToPlayerVote.set(socket.id, data.value);

   average = average + Number(targetsValue);

   const newArray = Array.from(idToPlayerName).map(([id, name]) => ({
    name,      // The name from the Map
    vote: getOrDefault(idToPlayerVote, id, " ", isSelected) 
  }));

  console.log(newArray)

      
  io.emit("return_user_name", newArray);
  });


});

server.listen(PORT, (err) => {
  if (err) throw err;
  const hostIP = getHostIPAddress();
  console.log(`Server is running at http://${hostIP}:${PORT}`);
});


  
    });

