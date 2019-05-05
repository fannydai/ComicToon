const express = require("express");
const router = express.Router();
const MessageController = require("../Controllers/MessageController");

router.post("/allMessages", MessageController.getAllMessages);

module.exports = router;