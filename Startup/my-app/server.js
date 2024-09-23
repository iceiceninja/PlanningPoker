const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require("socket.io");
const express = require('express');
const path = require('path');  // This helps resolve paths correctly
const nextApp = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = nextApp.getRequestHandler();
const expressApp = express();

// Serve static files from the "host" folder
expressApp.use(express.static(path.join(__dirname, 'host')));

// Serve static files from the "host" folder
expressApp.use(express.static(path.join(__dirname, 'images')));

nextApp.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', socket => {
    console.log('Client connected');

    socket.on('message', (data) => {
      console.log('Message from client:', data.text);
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