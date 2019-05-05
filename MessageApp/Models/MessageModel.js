const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let MessageModel = new Schema({
  token: String, //sender's token
  sender: String,
  reciever: String,
  message: String
});

MessageModel.set("collection", "UserMessages");
module.exports = mongoose.model("MessageModel", MessageModel);