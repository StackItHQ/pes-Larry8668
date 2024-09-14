const supabase = require("../supabaseClient");

const insertSyncData = async (data) => {
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
  } = data;

  const { data: insertData, error } = await supabase
    .from("your_table_name")
    .insert([
      {
        range,
        new_value: newValue,
        old_value: oldValue,
        spreadsheet_id: spreadsheetId,
        user_email: userEmail,
        user_role: userRole,
        local_timestamp: localTimestamp,
        timestamp,
        row,
        column,
        sheet_name: sheetName,
        sheet_url: sheetUrl,
        change_type: changeType,
      },
    ]);

  if (error) {
    console.error("Error inserting data:", error);
    throw new Error("Failed to insert data");
  }

  return insertData;
};

module.exports = { insertSyncData };
