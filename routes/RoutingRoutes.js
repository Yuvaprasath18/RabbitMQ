const express = require("express");
const router = express.Router();
const RoutingController = require("../controllers/RoutingController");

router.post("/publish", RoutingController.publishMessage);
router.post("/receive", RoutingController.receiveLogs);

module.exports = router;
