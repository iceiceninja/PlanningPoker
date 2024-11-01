FROM node:lts-alpine
# ENV NODE_ENV=production

WORKDIR /app

#COPY package.json ./
COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node","server.js"]
# Base stage: installs dependencies
# Base stage: installs dependencies
# FROM node:lts-alpine AS base
# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN npm install --production

# # Build stage: compiles the application
# FROM node:lts-alpine AS build
# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN npm install  # Install all dependencies, including devDependencies

# COPY . .
# RUN npm run build

# # Final stage: copies built artifacts and runs the application
# FROM node:lts-alpine AS production
# WORKDIR /app

# # Copy the built application from the build stage
# # COPY --from=build /app/dist ./dist
# COPY --from=build /app/.next ./dist
# COPY --from=build /app/package.json ./
# COPY --from=build /app/package-lock.json ./
# COPY --from=build /app/server.js ./ 
# COPY --from=build /app/app ./app
# COPY --from=build /app/images ./images
# COPY --from=build /app/socket.js ./
# COPY --from=build /app/globalHost.tsx ./
# COPY --from=build /app/globalSession.tsx ./
# # Install only production dependencies
# RUN npm install 
# # --omit=dev

# # Expose the port the app runs on
# EXPOSE 3000

# # Command to run the application
# CMD ["node", "server.js"]
