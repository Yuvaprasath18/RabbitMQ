const express = require("express");
const router = express.Router();
const RPCController = require("../controllers/RPCController");

router.post("/call", RPCController.rpcCall);
router.get("/server", RPCController.startServer);

module.exports = router;
