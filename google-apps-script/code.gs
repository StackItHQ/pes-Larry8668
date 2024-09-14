// this file is made in the Google Apps Script
// open sheet, Extenstion > Apps Script 
// then new file and add this code
// then create new trigger -> with run func on as  "on Edit" and func to run as "onEdit"
// needs permission from the google account to run
// data will not be proper without it 
// this function called once edited + saved
// P.S. its safe 😉

function onEdit(e) {
  // Get the edited range and value
  const range = e.range;
  const value = e.value;

  // Get additional information
  const userEmail = Session.getActiveUser().getEmail(); 
  const oldValue = e.oldValue || "N/A"; // Only available for single cell edits, otherwise it's undefined
  const spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId(); // Sheet id
  const userRole = "editor"; // editor by default  
  const localTimestamp = new Date().toLocaleString(); 
  const row = range.getRow(); // Row index
  const column = range.getColumn(); // Column index
  const sheetName = range.getSheet().getName(); // Sheet name
  const sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl(); // URL of the spreadsheet
  const changeType = "edit"; // Type of change

  // Prepare the data to send to your Node.js server
  const data = {
    range: range.getA1Notation(),
    newValue: value,
    oldValue: oldValue, 
    spreadsheetId: spreadsheetId,
    userEmail: userEmail, 
    userRole: userRole, 
    localTimestamp: localTimestamp, 
    timestamp: new Date(), 
    row: row, 
    column: column, 
    sheetName: sheetName, 
    sheetUrl: sheetUrl, 
    changeType: changeType 
  };

  // ngrok for now, will replace with deployed endpoint
  const url = 'https://4749-49-205-129-201.ngrok-free.app/api/sync';

  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(data)
  };

  UrlFetchApp.fetch(url, options);
}
