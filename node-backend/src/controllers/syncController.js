const handleSync = (req, res, next) => {
  const changes = req.body;

  if (!Array.isArray(changes)) {
    return next({
      statusCode: 400,
      message: "Invalid input: changes should be an array.",
    });
  }

  changes.forEach((change, index) => {
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
    } = change;

    const missingParams = [];
    if (!range) missingParams.push("range");
    if (newValue === undefined) missingParams.push("newValue");
    if (oldValue === undefined) missingParams.push("oldValue");
    if (!spreadsheetId) missingParams.push("spreadsheetId");
    if (!userEmail) missingParams.push("userEmail");
    if (!userRole) missingParams.push("userRole");
    if (!localTimestamp) missingParams.push("localTimestamp");
    if (!timestamp) missingParams.push("timestamp");
    if (row === undefined) missingParams.push("row");
    if (column === undefined) missingParams.push("column");
    if (!sheetName) missingParams.push("sheetName");
    if (!sheetUrl) missingParams.push("sheetUrl");
    if (!changeType) missingParams.push("changeType");

    if (missingParams.length > 0) {
      return next({
        statusCode: 400,
        message: `Missing parameters in change at index ${index}: ${missingParams.join(
          ", "
        )}`,
      });
    }

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
  });

  res.status(200).send("Data received");
};

module.exports = { handleSync };
