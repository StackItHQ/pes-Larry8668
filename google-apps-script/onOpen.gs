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
}