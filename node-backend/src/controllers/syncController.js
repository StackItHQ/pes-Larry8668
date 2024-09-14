const { syncSchema } = require("../helpers/joiValidation");

const handleSync = (req, res, next) => {
  const changes = req.body;

  // Check if changes is an array
  if (!Array.isArray(changes)) {
    return next({
      statusCode: 400,
      message: "Invalid input: changes should be an array.",
    });
  }

  const validationErrors = [];
  changes.forEach((change, index) => {
    const { error } = syncSchema.validate(change);
    if (error) {
      validationErrors.push({
        index,
        message: error.details[0].message, // Get the first validation error message
      });
    }
  });

  // If there are validation errors, respond with an error
  if (validationErrors.length > 0) {
    return next({
      statusCode: 400,
      message: `Validation errors: ${validationErrors
        .map((err) => `At index ${err.index}: ${err.message}`)
        .join(", ")}`,
    });
  }

  // Log the change details
  changes.forEach((change) => {
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
