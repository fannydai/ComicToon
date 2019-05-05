const MessageModel = require("../Models/MessageModel");
const MongoClient = require('mongodb').MongoClient //using this to get UserModel collection for msg validation
let DBConnection = null; 
MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true })
.then((db) => {DBConnection = db.db('ComicToonDB')}).catch((err) => console.log("NOOOOOO ",err)) ;

exports.getAllMessages = async function(req, res) { //gets all of a user's msgs
    //takes in token, sender's username, reciever's username, and the message
    res.send({status: "success"});
};