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
const MessageDB = mongoose.connection;
MessageDB.on("error", console.error.bind(console, "MongoDB connection error: "));
    
let UserModelDBConnection = null; 
MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true })
.then((db) => {UserModelDBConnection = db.db('ComicToonDB')}).catch((err) => console.log("NOOOOOO ", err));

let clients = new Map();
let comicClients = new Map();

io.on('connection', socket => {
    console.log('A user just connected.. ');
    socket.on('init', function(data){
        clients.set(data, socket.id);
    });

    socket.on('updating', (data)=> {
        console.log("in update.. ", data);
        if(comicClients.has(data.comicName)){
            socket.emit('err'); //someone already editing comic
        }
        else{
            comicClients.set(data.comicName, data.user);
        }
    });

    socket.on('doneUpdating', (data) => {
        if(comicClients.has(data)) comicClients.delete(data);
    });

    socket.on('saveMessage', function(data){
        UserModelDBConnection.collection("userModel").findOne({token: data.token}, (err, item) => { // error that "findOne" is not a function.. will fix later
            if(err || item === null) socket.emit("error", "invalid token");
            else{
                if(item.username !== data.sender) socket.emit("error", "invalid user");
                else{
                    const new_msg = new MessageModel({
                        token: data.token,
                        sender: data.sender,
                        reciever: data.reciever,
                        message: data.message,
                        date: data.date
                    });
                    new_msg.save(); //new msg saved to db
                    socket.emit("result", data.message); //successful msg saved, send back to front-end 
                    if(clients.has(data.reciever)) socket.broadcast.to(clients.get(data.reciever)).emit('recieveMessage', {message: data.message, username: data.sender}); //send to other person
                }
            }
        });
    });

    socket.on('disconnect', (reason) =>{
        console.log(reason)
    });

    socket.on('remove', function(data){
        clients.delete(data);
    });
});

const MessageRouter = require("./Routes/MessageRoutes");
app.use("/", [MessageRouter]);
    
const port = process.env.PORT || 4000;
const server = http.listen(port, () => {
    console.log('Server is running on port', server.address().port);
});