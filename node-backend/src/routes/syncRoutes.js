const express = require("express");
const { handleSync } = require("../controllers/syncController");
const { updateSheet } = require("../controllers/updateSheetController");
const { logChange } = require("../controllers/logController");
const { handleSpreadsheet, handleSheet, handleRow } = require("../controllers/spreadsheetController");

const router = express.Router();

router.post("/sync", handleSync);
router.post("/update-cell", updateSheet)
router.post("/log-change", logChange);
router.post("/spreadsheet", handleSpreadsheet);
router.post("/sheet", handleSheet);
router.post("/row", handleRow);

module.exports = router;
