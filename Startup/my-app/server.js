

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
  var hostSocket = "";
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

  function getOrDefault(map, id, socketId, defaultValue = "", selected) {
    if (socketId == id) {
    if (selected) {
      return map.get(id) ?? defaultValue;
    }

    else {
      console.log(id)
      map.set(id, defaultValue);
      return map.get(id);
    }
  }

  else {
    return map.get(id);
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


   // We have to make it a defautl  value for now so that every other connection besides host goes to userStartUp
   if ( idToPlayerName.size == NO_USERS) {
    hostSocket = socket.id
    idToPlayerName.set(socket.id, "host")
   }
   else {
    idToPlayerName.set(socket.id, "user")
   }

   socket.on("disconnect_each_socket", () => {
      socket.disconnect(true);
   })
  

  socket.on('disconnect', () => {

    console.log(hostSocket)
    console.log(socket.id)
    // If the host disconnects, disconnect everyone.
    if (hostSocket ==  socket.id) {
      console.log("tester1234")
      io.emit('disconnect_all' , "true")
    }


    idToPlayerName.delete(socket.id)
    idToPlayerVote.delete(socket.id)


    const newArray = Array.from(idToPlayerName).map(([id, name]) => ({
      name,      // The name from the Map
      vote: getOrDefault(idToPlayerVote, id, "randomIdBecauseWeJustWantTheMapAsAnArray" , " ", false) 
    }));
    
        io.emit("return_user_name", newArray);


    console.log('user disconnected');
  });

  
  socket.on("render", (data) => {
    
 // convert the map to an array, get the votes from all of them
 const newArray = Array.from(idToPlayerName).map(([id, name]) => ({
  name,      // The name from the Map
  vote: getOrDefault(idToPlayerVote, id, socket.id,  " ", false) 
}));

    io.emit("return_user_name", newArray);
        
  })




  socket.on("user_joined", (data) => {
    
    idToPlayerName.set(socket.id, data.value)
  



 // convert the map to an array, get the votes from all of them
 const newArray = Array.from(idToPlayerName).map(([id, name]) => ({
  name,      // The name from the Map
  vote: getOrDefault(idToPlayerVote, id, socket.id,  " ", false) 
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
    vote: getOrDefault(idToPlayerVote, id, socket.id,  " ", isSelected) 
  }));



      
  io.emit("return_user_name", newArray);
  });


});

server.listen(PORT, (err) => {
  if (err) throw err;
  const hostIP = getHostIPAddress();
  console.log(`Server is running at http://${hostIP}:${PORT}`);
});


  
    });

