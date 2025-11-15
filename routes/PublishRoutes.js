const express = require("express");
const router = express.Router();
const PublishController = require("../controllers/PublishController");

router.post("/publish", PublishController.publishMessage);
router.get("/receive", PublishController.receiveMessage);

module.exports = router;
