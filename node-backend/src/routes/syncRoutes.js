const express = require("express");
const { handleSync } = require("../controllers/syncController");
const { updateSheet } = require("../controllers/updateSheetController");

const router = express.Router();

router.post("/sync", handleSync);
router.post("/update-cell", updateSheet)

module.exports = router;
