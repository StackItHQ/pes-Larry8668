function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Permissions')
    .addItem('Authorize and Run', 'authorizeAndRun')
    .addToUi();
}

function authorizeAndRun() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const spreadsheetId = spreadsheet.getId();
  const spreadsheetName = spreadsheet.getName();
  const owner = DriveApp.getFileById(spreadsheetId).getOwner().getEmail();
  const creationDate = DriveApp.getFileById(spreadsheetId).getDateCreated(); // Get creation date

  Logger.log('Spreadsheet ID: ' + spreadsheetId);
  Logger.log('Spreadsheet Name: ' + spreadsheetName);
  Logger.log('Owner: ' + owner);
  Logger.log('Creation Date: ' + creationDate); // Log creation date

  // Prepare the API request
  const url = 'https://sheet-saga-backend.vercel.app/api/spreadsheet';
  const payload = {
    spreadsheetId: spreadsheetId
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true // Optional: to prevent script from stopping on HTTP errors
  };

  // Make the API call
  const response = UrlFetchApp.fetch(url, options);
  Logger.log('API Response: ' + response.getContentText());

  // Show a toast notification based on the API response
  if (response.getResponseCode() === 200 || response.getResponseCode() === 201) {
    // Assuming the API returns a success message
    const apiResponse = JSON.parse(response.getContentText());
    const message = apiResponse.message || 'Sync setup 🎉 \n You are ready to go 🚀'; // Default message if none provided
    SpreadsheetApp.getActiveSpreadsheet().toast(message, 'Success', 5); // Display toast for 5 seconds
  } else {
    // Handle error response
    SpreadsheetApp.getActiveSpreadsheet().toast('Error syncing data ❌', 'Error', 5);
  }
}
