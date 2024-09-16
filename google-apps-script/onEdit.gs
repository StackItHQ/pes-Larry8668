// this file is made in the Google Apps Script
// open sheet, Extenstion > Apps Script 
// then new file and add this code
// then create new trigger -> with run func on as  "on Edit" and func to run as "onEdit"
// needs permission from the google account to run
// data will not be proper without it 
// this function called once edited + saved
// P.S. its safe 😉

function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  const userEmail = Session.getActiveUser().getEmail();
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const spreadsheetId = spreadsheet.getId();
  const localTimestamp = new Date().toLocaleString();

  const startRow = range.getRow();
  const endRow = startRow + range.getNumRows() - 1;
  const startColumn = range.getColumn();
  const endColumn = startColumn + range.getNumColumns() - 1;

  // Prepare change data to be sent
  const changeData = {
    spreadsheetId: spreadsheetId,
    userEmail: userEmail,
    userRole: "editor",
    localTimestamp: localTimestamp,
    sheetId: sheet.getSheetId(),
    sheetName: sheet.getName(),
    startRow: startRow,
    endRow: endRow,
    startColumn: startColumn,
    endColumn: endColumn,
    changeType: "edit"
  };

  // Send the change data to your server
  const url = 'https://sheet-saga-backend.vercel.app/api/sync';
  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(changeData)
  };

  try {
    UrlFetchApp.fetch(url, options);
  } catch (error) {
    Logger.log('Error sending data: ' + error.toString());
  }
}
