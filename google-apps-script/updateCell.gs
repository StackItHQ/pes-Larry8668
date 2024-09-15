function updateCell(spreadsheetId, sheetId, row, column, newValue) {
  try {
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    // Get the sheet
    let sheet;
    if (sheetId) {
      sheet = spreadsheet.getSheets().find(s => s.getSheetId() === sheetId);
    } else {
      sheet = spreadsheet.getActiveSheet();
    }
    
    if (!sheet) {
      throw new Error('Sheet not found');
    }

    // Update the cell
    sheet.getRange(row, column).setValue(newValue);
    
    return {
      success: true,
      message: `Cell updated successfully at row ${row}, column ${column}`
    };
  } catch (error) {
    return {
      success: false,
      message: `Error updating cell: ${error.message}`
    };
  }
}

// This function will be called by the web app
function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const result = updateCell(
    params.spreadsheetId,
    params.sheetId,
    params.row,
    params.column,
    params.newValue
  );
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}