

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
  var HOST_EXISTS = 1;
  var HOST_NANE = "host";
  var idForEachPlayerQueue = [];
  var idToPlayerName = new Map();
  var idToPlayerVote = new Map();
  var userStory = "";
  var hostSocket = "";
  var sessionTopic = "";
  var storePlayers = [];
  const io = new Server(server);
  var NO_USERS = 0;
  var average = 0;
  var roundEnded = false;
  var averageWithCorrectCard = 0;
  var canChangeVote = false;
  var activeSockets = new Set();



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

function calculateClosest(average ) {
  const numbers = [1, 2, 3, 5, 8, 13, 21];
let closestNumber = numbers[0];
let smallestDistance = Math.abs(numbers[0] - average);

for (let i = 1; i < numbers.length; i++) {
    const distance = Math.abs(numbers[i] - average);
    if (distance < smallestDistance) {
        smallestDistance = distance;
        closestNumber = numbers[i];
    }
}

return closestNumber;

}

  // When user (client) joins the server
  io.on('connection', (socket) => {

   // We have to make it a default value for now so that every other connection besides host goes to userStartUp
   if ( idToPlayerName.size == NO_USERS) {
    hostSocket = socket.id
    idToPlayerName.set(socket.id, "hostDoesNotExistYet")
   }


   else {
    idToPlayerName.set(socket.id, "connecting....")
   }
   activeSockets.add(socket);

   console.log("user connected")

   socket.on("disconnect_each_socket", () => {
      socket.disconnect(true);
   })
  

  socket.on('disconnect', () => {
    activeSockets.delete(socket);
    // If the host disconnects, disconnect everyone.
    if (hostSocket ==  socket.id) {
      io.emit('disconnect_all' , "true")
      HOST_EXISTS = 1;
      HOST_NANE = "host";
      idForEachPlayerQueue = [];
      idToPlayerName = new Map();
      idToPlayerVote = new Map();
      userStory = "";
      hostSocket = "";
      sessionTopic = "";
      storePlayers = [];
      NO_USERS = 0;
      average = 0;
      roundEnded = false;
      averageWithCorrectCard = 0;
      canChangeVote = false;
      activeSockets = new Set();
       
    }
    
//if its not the host, delete normally
else if (hostSocket != "") {
    idToPlayerName.delete(socket.id)

    if(idToPlayerVote.get(socket.id) != "Pass" && idToPlayerVote.get(socket.id) != "PassVote")
    average = average - idToPlayerVote.get(socket.id); //remove it from the average before deleting

    idToPlayerVote.delete(socket.id)
    var total = 0;


    const newArray = Array.from(idToPlayerName).map(([id, name]) => ({
      name,      // The name from the Map
      vote: getOrDefault(idToPlayerVote, id, "randomIdBecauseWeJustWantTheMapAsAnArray" , "Pass", false) 
    }));

      for (const [key, value] of idToPlayerVote) {
      if (value != "Pass" && value != "?" && value != "PassVote") {
        total++;
      }
  }
    
        io.emit("return_user_name", newArray);



        var newAverage = total == 0 ? 0 :calculateClosest(average / total);
        averageWithCorrectCard = newAverage;
        io.emit("set_new_average", newAverage);

}

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

     idToPlayerVote.set(socket.id, targetsValue);

      
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
  userStory = data;
  io.emit("get_story_submitted_host", userStory);
})

socket.on("get_story_submitted_for_new_user", () => {
  io.emit("get_story_submitted_host", userStory);
})

socket.on("start_count_down", (data) => {
  io.emit("count_down_started", data);
})

socket.on("check_is_host", (data) => {
  var hostInfo = "hostNotJoined"
  if(hostSocket == socket.id) {
    if(idToPlayerName.get(hostSocket) == "hostDoesNotExistYet") {
      hostInfo = "hostNotJoinedAndSkippedUrl";
    }
    else {
      hostInfo = "isHostAndValid"; 
    }
  }
  else if (idToPlayerName.get(socket.id) == "connecting....") {
    hostInfo = "notHostAndUserHasNoName";
  }
  else {
    hostInfo = "notHostAndHasAName"
  }

  socket.emit("is_host", hostInfo);
})

socket.on("display_all_votes", () => {
  var total = 0;

  for (const [key, value] of idToPlayerVote) {
      if (value != "Pass" && value != "?" && value != "PassVote") {
        total++;
      }
  }



  var newAverage = total == 0 ? 0 : calculateClosest(average / total);
  averageWithCorrectCard = newAverage;
  roundEnded = true;
  io.emit("display_votes", newAverage);
})

socket.on("check_if_host_exists", () => {
var hostInfo = "hostNotJoined"
if(hostSocket == socket.id) {
      hostInfo = "hostNotJoined";
}
else {
  hostInfo = "";
}
  socket.emit("host_currently_exists", hostInfo);
})

socket.on("check_cannot_join", () => {
  if (idToPlayerName.size > 20) {
    socket.emit("can_join", "False");
  }

  else {
    socket.emit("can_join", "True");
  }
});

socket.on("get_all_information", () => {
  socket.emit("return_all_information", {currentAverage: averageWithCorrectCard, isRoundOver: roundEnded, changeVote: canChangeVote});
})

socket.on("update_average", (data) => {
  var targetsValue = data.value;
  var isSelected = data.selected;
  var total = 0;

  if(targetsValue != "Pass" && targetsValue != "PassVote" && targetsValue != '?')
  average += Number(targetsValue);


  // Check if the old card equals pass or ?, if either of these is true, then we cannot subtract the old card
  if (isSelected) { //if the user selects a new card, subtract the old card
    if (idToPlayerVote.get(socket.id) != "Pass" && idToPlayerVote.get(socket.id) != "PassVote" &&idToPlayerVote.get(socket.id) != "?" )
    average = average - idToPlayerVote.get(socket.id); 

    idToPlayerVote.set(socket.id, targetsValue);
  }

  //When you click the card twice it deselects it, but if its pass or ?, we don't want to do anything
  else if (!isSelected  && targetsValue != "Pass" && targetsValue != "PassVote" && targetsValue != '?') { // if its deselected, subtract it, unless its a question mark, or a uhhh pass
    average = (average - Number(targetsValue) ); // do twice to remove it since we added it earlier
    average = (average - Number(targetsValue) );
    idToPlayerVote.set(socket.id, "Pass");
   }

   //
   else { //From pass or ?, you select this value
    idToPlayerVote.set(socket.id, targetsValue);
   }

   for (const [key, value] of idToPlayerVote) {
       if (value != "Pass" && value != '?' && value != "PassVote") {
         total++;
       }
   }

   var newAverage = total == 0 ? 0 :calculateClosest(average / total);
   averageWithCorrectCard = newAverage;
   io.emit("set_new_average", newAverage);

});


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

  average = 0;
  averageWithCorrectCard = 0;
  roundEnded = false;
})

socket.on("allow_change_votes", (data) => {
  canChangeVote = data;
  io.emit("check_if_can_change_votes", data);
})

socket.on("get_id", (data) => {
  socket.emit("return-id", idToPlayerName.get(socket.id));
})

// check if the user has redirected to this page
socket.on("check_if_valid_user", (data) => {
  var userInfoToRoute = ""

  if (idToPlayerName.get(socket.id) == "connecting....") {
    userInfoToRoute = "routeToUserStartUp"
  }

  else if (idToPlayerName.get(socket.id) == "hostDoesNotExistYet") {
      userInfoToRoute = "routeToHostStartUp"
  }

  else {
    userInfoToRoute = "renderUser"
  }

  socket.emit("return_check_if_valid_user", userInfoToRoute)
})


const shutdown = () => {
  console.log('Shutting down server...');

       // Disconnect all sockets
       activeSockets.forEach((socket) => {
        socket.disconnect(true);
    });


    activeSockets.clear()

      // Close the HTTP server
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });

      // Force exit if graceful shutdown takes too long
      setTimeout(() => {
        console.log(' shutdown...');
        process.exit(1);
    }, 1000);

}

process.on('SIGINT', shutdown); // Handle Ctrl+C
process.on('SIGTERM', shutdown); // Handle termination signals








});




server.listen(PORT, (err) => {
  if (err) throw err;
  const hostIP = getHostIPAddress();
  console.log(`Server is running at http://${hostIP}:${PORT}`);
});


  
    });

