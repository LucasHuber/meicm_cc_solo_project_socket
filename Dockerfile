FROM node:latest

WORKDIR /usr/app

COPY package.json .
RUN npm install

COPY socket.js .

ENV DATABASE_URI="host.docker.internal"

ENTRYPOINT [ "node" , "socket.js"]