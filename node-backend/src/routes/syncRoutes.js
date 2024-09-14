const express = require("express");
const { handleSync } = require("../controllers/syncController");

const router = express.Router();

router.post("/sync", handleSync);

module.exports = router;
