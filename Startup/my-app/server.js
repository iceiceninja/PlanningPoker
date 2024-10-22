

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
  var userStory = "";
  var hostSocket = "";
  var sessionTopic = "";
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

      idToPlayerName.size == NO_USERS ?  idToPlayerName.set(socket.id, "host") : idToPlayerName.set(socket.id, "connecting....");
      
  }

  function getOrDefault(map, id, socketId, defaultValue = "Pass", selected) {
    if (socketId == id) {
    if (selected) {
      return map.get(id) ?? defaultValue;
    }

    else {
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


   // We have to make it a default value for now so that every other connection besides host goes to userStartUp
   if ( idToPlayerName.size == NO_USERS) {
    hostSocket = socket.id
    idToPlayerName.set(socket.id, "host")
   }
   else {
    idToPlayerName.set(socket.id, "connecting....")
   }

   console.log("user connected")

   socket.on("disconnect_each_socket", () => {
      socket.disconnect(true);
   })
  

  socket.on('disconnect', () => {

    // If the host disconnects, disconnect everyone.
    if (hostSocket ==  socket.id) {



      io.emit('disconnect_all' , "true")
    }


    idToPlayerName.delete(socket.id)
    idToPlayerVote.delete(socket.id)


    const newArray = Array.from(idToPlayerName).map(([id, name]) => ({
      name,      // The name from the Map
      vote: getOrDefault(idToPlayerVote, id, "randomIdBecauseWeJustWantTheMapAsAnArray" , "Pass", false) 
    }));
    
        io.emit("return_user_name", newArray);


    console.log('user disconnected');
  });

  
  socket.on("render", (data) => {
    
 // convert the map to an array, get the votes from all of them
 const newArray = Array.from(idToPlayerName).map(([id, name]) => ({
  name,      // The name from the Map
  vote: getOrDefault(idToPlayerVote, id, socket.id,  "Pass", false) 
}));

    io.emit("return_user_name", newArray);
        
  })




  socket.on("user_joined", (data) => {
    
    idToPlayerName.set(socket.id, data.value)
  



 // convert the map to an array, get the votes from all of them
 const newArray = Array.from(idToPlayerName).map(([id, name]) => ({
  name,      // The name from the Map
  vote: getOrDefault(idToPlayerVote, id, socket.id,  "Pass", false) 
}));

    io.emit("return_user_name", newArray);
        
  })



  socket.on("vote-selected", (data) => {
    var targetsValue = data.value;
    var isSelected = data.selected;

    idToPlayerVote.set(socket.id, data.value);

      
   const newArray = Array.from(idToPlayerName).map(([id, name]) => ({
    name,      // The name from the Map
    vote: getOrDefault(idToPlayerVote, id, socket.id,  "Pass", isSelected) 
  }));


      
  io.emit("return_user_name", newArray);
  });

  socket.on("set_host_session_name", (data) => {
    sessionTopic = data.value;
})

socket.on("get_session_name", (data) => {
  var hostName = idToPlayerName.get(hostSocket)
    io.emit("return_session_name", {session : sessionTopic, host : hostName});
})

socket.on("story_submitted_host", (data) => {
  userStory = data
  io.emit("get_story_submitted_host", userStory);
})

socket.on("get_story_submitted_for_new_user", () => {
  io.emit("get_story_submitted_host", userStory);
})

socket.on("start_count_down", () => {
  io.emit("count_down_started");
})

socket.on("display_all_votes", () => {
  io.emit("display_votes", average);
})

socket.on("check_if_host_exists", () => {
  var hostExists = ""
  if(idToPlayerName.size == 1 || idToPlayerName.size == 0) {
    hostExists = "False";
  }
  else {
    hostExists = "True";
  }
  io.emit("host_currently_exists", hostExists);
})




socket.on("reset_all_players", () => {
  const newArray = Array.from(idToPlayerName).map(([id, name]) => ({
    name,      // The name from the Map
    vote: "Pass" 
  }));

  const updatedMap = new Map();

  for (const [id, name] of idToPlayerName) {
    updatedMap.set(id, "Pass" );
  }

  idToPlayerVote = updatedMap; //Resets all the votes
  userStory = "";

  io.emit("get_story_submitted_host", userStory);
      io.emit("reset_players", newArray);
})




});




server.listen(PORT, (err) => {
  if (err) throw err;
  const hostIP = getHostIPAddress();
  console.log(`Server is running at http://${hostIP}:${PORT}`);
});


  
    });

