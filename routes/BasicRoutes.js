const express = require("express");
const router = express.Router();
const BasicController = require("../controllers/BasicController");

router.post("/send", BasicController.sendMessage);
router.get("/receive", BasicController.receiveMessage);

module.exports = router;
