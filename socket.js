const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const { MongoClient } = require('mongodb');

const app = express();
const server = createServer(app);
var uri = process.env.DATABASE_URI || 'localhost';

console.log(process.env.DATABASE_URI);
console.log(process.env.FRONTEND_URI)

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URI,
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

var client;
if (uri.startsWith("mongodb+srv")) {
    console.log("Option 1 choosen");
    client = new MongoClient(uri);
    
    const test_collection = client.db('test_database').collection("test_message");
    const obj = { "date": new Date(), "text": "Test"};
    test_collection.insertOne(obj);
    console.log("Test insert worked");
} else {
    console.log("Option 2 choosen");
    client = new MongoClient(`mongodb://${uri}:27017`);
}

const message_collection = client.db('message_database').collection("messages");

io.on('connection', (socket) => {
    console.log('a user connected');
    
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