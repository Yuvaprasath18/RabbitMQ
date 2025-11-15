const express = require("express");
const router = express.Router();
const WorkController = require("../controllers/WorkController");

router.post("/send", WorkController.sendMessage);
router.post("/receive", WorkController.receiveMessage);

module.exports = router;
