const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const { MongoClient } = require('mongodb');

const app = express();
const server = createServer(app);
var uri = process.env.DATABASE_URI || 'localhost';

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

const client = new MongoClient(`mongodb://${uri}:27017`);
const message_collection = client.db('message_database').collection("messages");

io.on('connection', (socket) => {
    console.log('a user connected');
    
    (async() => {
        var test = await message_collection.find().toArray();
        console.log(test);
    });
    
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
        
        const obj = { "date": new Date(), "text": msg};
        message_collection.insertOne(obj); 
    });
    
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

server.listen(5001, () => {
    console.log('server running at http://localhost:5001');
});