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
                    else{
                        let data = new Map();
                        result.forEach(item => { 
                            if(data.has(item.reciever)) data.get(item.reciever).unshift(item);
                            else data.set(item.reciever, [item]);
                        });
                        let temp = data.get(req.body.sender); 
                        data.delete(req.body.sender);
                        temp.forEach((item) => {
                            data.get(item.sender).unshift(item) //and other end to each conversation
                        });
                        data.forEach((item) => {
                            item.sort(function(a,b){return a.date - b.date}) //sort each msg in conversation
                        });
                        //sends back map of each person you messaged (as key) & list of message objs as value
                        //each msg in each converation is sort by the date
                        console.log(data);// works
                        res.send({status: "success", messages: data});
                    }
                });
            }
        }
    });
};