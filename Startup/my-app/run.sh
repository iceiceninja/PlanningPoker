#!/bin/sh

# Start server.js and log output
node server.js 2>&1 | tee -a /app/server.log &

# Start npm run dev and log output
npm run dev 2>&1 | tee -a /app/server.log
