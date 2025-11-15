const express = require("express");
const router = express.Router();
const TopicController = require("../controllers/TopicController");

router.post("/publish", TopicController.publishTopic);
router.post("/subscribe", TopicController.subscribeTopic);

module.exports = router;
