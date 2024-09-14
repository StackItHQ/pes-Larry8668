const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Its working!");
});

app.post("/api/sync", (req, res) => {
  const {
    range,
    newValue,
    oldValue,
    spreadsheetId,
    userEmail,
    userRole,
    localTimestamp,
    timestamp,
    row,
    column,
    sheetName,
    sheetUrl,
    changeType,
  } = req.body;

  console.log("\n----------------------------------- \n");
  console.log(`Change detected in spreadsheet ID: ${spreadsheetId}`);
  console.log(`Sheet Name: ${sheetName}`);
  console.log(`Cell Range: ${range} (Row: ${row}, Column: ${column})`);
  console.log(`New Value: ${newValue}`);
  console.log(`Old Value: ${oldValue}`);
  console.log(`User Email: ${userEmail}`);
  console.log(`User Role: ${userRole}`);
  console.log(`Local Timestamp: ${localTimestamp}`);
  console.log(`UTC Timestamp: ${timestamp}`);
  console.log(`Sheet URL: ${sheetUrl}`);
  console.log(`Change Type: ${changeType}`);

  res.status(200).send("Data received");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
