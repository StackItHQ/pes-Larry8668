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
  const spreadsheetName = spreadsheet.getName();
  const owner = DriveApp.getFileById(spreadsheetId).getOwner().getEmail();
  const creationDate = DriveApp.getFileById(spreadsheetId).getDateCreated(); // Get creation date
  const localTimestamp = new Date().toLocaleString();
  const sheetUrl = spreadsheet.getUrl();
  const changeType = "edit";

  const startRow = range.getRow();
  const startColumn = range.getColumn();
  const numRows = range.getNumRows();
  const numColumns = range.getNumColumns();

  const changes = [];

  // Get or create the hidden sheet
  let hiddenSheet = spreadsheet.getSheetByName("HiddenOldValues");
  if (!hiddenSheet) {
    hiddenSheet = spreadsheet.insertSheet("HiddenOldValues");
    hiddenSheet.hideSheet();
  }

  // Get old values from the hidden sheet
  const oldValuesRange = hiddenSheet.getRange(startRow, startColumn, numRows, numColumns);
  const oldValues = oldValuesRange.getValues();

  // Get new values
  const newValues = range.getValues();

  for (let rowOffset = 0; rowOffset < numRows; rowOffset++) {
    for (let colOffset = 0; colOffset < numColumns; colOffset++) {
      const oldValue = oldValues[rowOffset][colOffset];
      const newValue = newValues[rowOffset][colOffset];

      // Determine the action performed
      let action;
      if (oldValue === "" && newValue !== "") {
        action = "create";
      } else if (oldValue !== "" && newValue === "") {
        action = "delete";
      } else if (oldValue !== newValue) {
        action = "update";
      } else {
        continue; // Skip if no change
      }

      // Add the change details for this cell to the array
      changes.push({
        range: range.getCell(rowOffset + 1, colOffset + 1).getA1Notation(),
        newValue: newValue,
        oldValue: oldValue,
        spreadsheetId: spreadsheetId,
        spreadsheetName: spreadsheetName,
        spreadsheetOwner: owner,
        creationDate: creationDate, // Added creation date
        userEmail: userEmail,
        userRole: "editor",
        localTimestamp: localTimestamp,
        timestamp: new Date(),
        row: startRow + rowOffset,
        column: startColumn + colOffset,
        sheetId: sheet.getSheetId(),
        sheetName: sheet.getName(),
        sheetUrl: sheetUrl,
        changeType: changeType,
        action: action
      });
    }
  }

  // Update the hidden sheet with new values
  oldValuesRange.setValues(newValues);

  // Send the array of changes to your server if there are any changes
  if (changes.length > 0) {
    const url = 'https://4749-49-205-129-201.ngrok-free.app/api/sync';
    const options = {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify(changes)
    };

    try {
      UrlFetchApp.fetch(url, options);
    } catch (error) {
      Logger.log('Error sending data: ' + error.toString());
    }
  }
}

function setupHiddenSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let hiddenSheet = spreadsheet.getSheetByName("HiddenOldValues");
  if (!hiddenSheet) {
    hiddenSheet = spreadsheet.insertSheet("HiddenOldValues");
    hiddenSheet.hideSheet();
  }

  // Copy all data from all visible sheets to the hidden sheet
  const sheets = spreadsheet.getSheets();
  let targetRow = 1;

  sheets.forEach(sheet => {
    if (sheet.getName() !== "HiddenOldValues" && !sheet.isSheetHidden()) {
      const data = sheet.getDataRange().getValues();
      hiddenSheet.getRange(targetRow, 1, data.length, data[0].length).setValues(data);
      targetRow += data.length + 1; // Add an empty row between sheets
    }
  });
}