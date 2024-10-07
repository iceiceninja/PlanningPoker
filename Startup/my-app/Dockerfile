FROM node:lts-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
# Expose 4000 for server
EXPOSE 4000

COPY run.sh .

RUN chmod +x run.sh

CMD ["./run.sh"]
