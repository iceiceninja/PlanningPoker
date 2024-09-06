# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Command to run your app. This may need to be altered to npm start to run a production build when we are done
CMD [ "npm", "run", "dev" ]
