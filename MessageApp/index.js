process.env.UV_THREADPOOL_SIZE = 128;
const cluster = require("cluster");

if(cluster.isMaster) {
    const numberOfCPU = require("os").cpus().length;
    //taking advantage of the # of cpus you have, making that many processes for better performance
    for(let i = 0; i < numberOfCPU; i++) { 
      cluster.fork();
      cluster.on("exit", function(worker, code, signal) {
        console.log("Worker died, starting a new one... ");
        cluster.fork();
      });
    }
} else {
    const express = require('express');
    const cors = require('cors');
    const parser = require('body-parser');
    const app = express();
    const http = require('http').Server(app);
    const io = require('socket.io')(http);
    const mongoose = require('mongoose'); //for msgs model
    const MongoClient = require('mongodb').MongoClient //using this to get UserModel collection for msg validation
    const MessageModel = require("./Models/MessageModel"); //make the model and save
    
    const corsOptions = {
        origin: "http://localhost:3000",
        credentials: true
    };
    app.use(cors(corsOptions));
    app.use(parser.urlencoded({ extended: false }));
    app.use(parser.json());

    mongoose.connect('mongodb://localhost:27017/Messages', {useNewUrlParser: true}); //Messages db
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error: "));
    
    let UserModelDBConnection = null; 
    MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true })
.   then((db) => {UserModelDBConnection = db.db('ComicToonDB')}).catch((err) => console.log("NOOOOOO ", err)) ;

    io.on('connection', socket => {
        console.log('A user just connected.. ');
        socket.on('saveMessage', (token, sender, reciever, message) => {
            //validate msg with UserModel
            //save msg to db, if valid, and emit status  w/ msg back
        });
    });

    const MessageRouter = require("./Routes/MessageRoutes");
    app.use("/", [MessageRouter]);
    
    const port = process.env.PORT || 4000;
    const server = http.listen(port, () => {
        console.log('Server is running on port', server.address().port);
    });
}