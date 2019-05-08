const MessageModel = require("../Models/MessageModel");
const MongoClient = require('mongodb').MongoClient; //using this to get UserModel collection for msg validation
const mongoose = require('mongoose'); //for msgs model
let DBConnection = null; 
MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true })
.then((db) => {DBConnection = db.db('ComicToonDB')}).catch((err) => console.log("NOOOOOO ",err));
mongoose.connect('mongodb://localhost:27017/Messages', {useNewUrlParser: true}); //Messages db
const MessageDB = mongoose.connection;

exports.getAllMessages = async function(req, res) { //gets all of a user's msgs
    //takes in "token" and "sender"
    DBConnection.collection("userModel").findOne({token: req.body.token}, (err, item) => {
        if(err) res.send({status: "mongodb err"});
        else if(item === null) res.send({status: "invalid token"});
        else{
            if(item.username !== req.body.sender) res.send({status: "invalid user"});
            else{ 
                //get both ends of conversation
                MessageModel.find({$or:[{sender: req.body.sender}, {reciever:req.body.sender}]}, (err, result) => { 
                    if(err) res.send({status: "mongodb error"});
                    else res.send({status: "success", messages: result});
                });
            }
        }
    });
};