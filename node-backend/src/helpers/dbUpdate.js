const supabase = require("../supabaseClient"); // Adjust the path as needed

const updateCellInDB = async (spreadsheetId, sheetName, row, values) => {
  try {
    // Step 1: Check if the spreadsheet exists
    const { data: spreadsheetData, error: spreadsheetError } = await supabase
      .from("spreadsheet")
      .select("id")
      .eq("spreadsheet_id", spreadsheetId)
      .single();

    if (spreadsheetError || !spreadsheetData) {
      throw new Error("Spreadsheet not found");
    }

    const spreadsheetIdInDB = spreadsheetData.id;

    // Step 2: Get the sheet entry
    const { data: sheetData, error: sheetError } = await supabase
      .from("sheet")
      .select("id, title_array")
      .eq("spreadsheet_id", spreadsheetIdInDB)
      .eq("sheet_name", sheetName)
      .single();

    if (sheetError || !sheetData) {
      throw new Error("Sheet not found");
    }

    const sheetIdInDB = sheetData.id;
    const titleArray = sheetData.title_array;

    // Transform values array into an object with titleArray as keys
    const transformedValues = titleArray.reduce((acc, title, index) => {
      acc[title] = values[index] || ""; // Use empty string if value is undefined
      return acc;
    }, {});

    // Step 3: Retrieve existing rows
    const { data: rows, error: rowsError } = await supabase
      .from("row")
      .select("id, row_no, data")
      .eq("sheet_id", sheetIdInDB)
      .order("row_no", { ascending: true });

    if (rowsError) {
      throw new Error("Error retrieving rows");
    }

    // Check if the row exists or needs to be inserted
    const existingRow = rows.find((r) => r.row_no === row);
    if (existingRow) {
      // Update existing row with transformed data
      const { error: updateError } = await supabase
        .from("row")
        .update({ data: transformedValues })
        .eq("id", existingRow.id);

      if (updateError) {
        throw new Error("Error updating row");
      }
    } else {
      // Insert new rows up to the desired row number
      const maxRowNo = Math.max(...rows.map((r) => r.row_no), 0);
      const rowsToInsert = [];
      for (let i = maxRowNo + 1; i < row; i++) {
        rowsToInsert.push({
          sheet_id: sheetIdInDB,
          row_no: i,
          data: titleArray.reduce(
            (acc, title) => ({ ...acc, [title]: "" }),
            {}
          ),
        });
      }

      // Insert new rows
      const { error: insertError } = await supabase
        .from("row")
        .insert(rowsToInsert);

      if (insertError) {
        throw new Error("Error inserting rows");
      }

      // Now insert the provided data into the specified row
      const { error: insertDataError } = await supabase.from("row").insert({
        sheet_id: sheetIdInDB,
        row_no: row,
        data: transformedValues,
      });

      if (insertDataError) {
        throw new Error("Error inserting data into row");
      }
    }

    console.log("Row updated successfully in the database");
    return {
      success: true,
      message: "Row updated successfully in the database",
    };
  } catch (error) {
    console.error("Error updating row in the database:", error);
    return { success: false, message: error.message };
  }
};

const deleteCellInDB = async (spreadsheetId, sheetId, row) => {
  try {
    // Step 1: Check if the spreadsheet exists
    const { data: spreadsheetData, error: spreadsheetError } = await supabase
      .from("spreadsheet")
      .select("id")
      .eq("spreadsheet_id", spreadsheetId)
      .single();

    if (spreadsheetError || !spreadsheetData) {
      throw new Error("Spreadsheet not found");
    }

    const spreadsheetIdInDB = spreadsheetData.id;

    // Step 2: Get the sheet entry
    const { data: sheetData, error: sheetError } = await supabase
      .from("sheet")
      .select("id, title_array")
      .eq("spreadsheet_id", spreadsheetIdInDB)
      .eq("sheet_id", sheetId)
      .single();

    if (sheetError || !sheetData) {
      throw new Error("Sheet not found");
    }

    const sheetIdInDB = sheetData.id;
    const titleArray = sheetData.title_array;

    // Step 3: Retrieve existing rows
    const { data: rows, error: rowsError } = await supabase
      .from("row")
      .select("id, row_no")
      .eq("sheet_id", sheetIdInDB)
      .order("row_no", { ascending: true });

    if (rowsError) {
      throw new Error("Error retrieving rows");
    }

    // Check if the row exists
    const existingRow = rows.find((r) => r.row_no === row);
    if (!existingRow) {
      console.log("Row is out of range or does not exist");
      return {
        success: true,
        message: "Row is out of range or does not exist",
      };
    }

    // Step 4: Delete the target row
    const { error: deleteError } = await supabase
      .from("row")
      .delete()
      .eq("id", existingRow.id);

    if (deleteError) {
      throw new Error("Error deleting row");
    }

    // Step 5: Shift rows up and update the last row
    const rowsToUpdate = rows.filter((r) => r.row_no > row);

    // Update row numbers for rows that should move up
    for (const rowToUpdate of rowsToUpdate) {
      const updatedRowNo = rowToUpdate.row_no - 1;
      const { error: updateRowError } = await supabase
        .from("row")
        .update({ row_no: updatedRowNo })
        .eq("id", rowToUpdate.id);

      if (updateRowError) {
        throw new Error("Error updating row number");
      }
    }

    // // Handle the last row (either delete or empty it)
    // if (rowsToUpdate.length > 0) {
    //   const lastRow = rowsToUpdate[rowsToUpdate.length - 1];
    //   const { error: deleteLastRowError } = await supabase
    //     .from("row")
    //     .delete()
    //     .eq("id", lastRow.id);

    //   if (deleteLastRowError) {
    //     throw new Error("Error deleting last row");
    //   }
    // }

    console.log(
      "Row deleted, rows shifted up, and last row handled successfully"
    );
    return {
      success: true,
      message:
        "Row deleted, rows shifted up, and last row handled successfully",
    };
  } catch (error) {
    console.error("Error processing rows in the database:", error);
    return { success: false, message: error.message };
  }
};

const appendRowToDB = async (spreadsheetId, sheetName, values) => {
  try {
    // Step 1: Check if the spreadsheet exists
    const { data: spreadsheetData, error: spreadsheetError } = await supabase
      .from("spreadsheet")
      .select("id")
      .eq("spreadsheet_id", spreadsheetId)
      .single();

    if (spreadsheetError || !spreadsheetData) {
      throw new Error("Spreadsheet not found");
    }

    const spreadsheetIdInDB = spreadsheetData.id;

    // Step 2: Get the sheet entry
    const { data: sheetData, error: sheetError } = await supabase
      .from("sheet")
      .select("id, title_array")
      .eq("spreadsheet_id", spreadsheetIdInDB)
      .eq("sheet_name", sheetName)
      .single();

    if (sheetError || !sheetData) {
      throw new Error("Sheet not found");
    }

    const sheetIdInDB = sheetData.id;
    const titleArray = sheetData.title_array;

    // Transform values array into an object with titleArray as keys
    const transformedValues = titleArray.reduce((acc, title, index) => {
      acc[title] = values[index] || ""; // Use empty string if value is undefined
      return acc;
    }, {});

    // Step 3: Retrieve existing rows to determine the next row number
    const { data: rows, error: rowsError } = await supabase
      .from("row")
      .select("row_no")
      .eq("sheet_id", sheetIdInDB)
      .order("row_no", { ascending: true });

    if (rowsError) {
      throw new Error("Error retrieving rows");
    }

    // Determine the next row number
    const maxRowNo =
      rows.length > 0 ? Math.max(...rows.map((r) => r.row_no)) : 0;
    const nextRowNo = maxRowNo + 1;

    // Insert the new row at the end
    const { error: insertError } = await supabase.from("row").insert({
      sheet_id: sheetIdInDB,
      row_no: nextRowNo,
      data: transformedValues,
    });

    if (insertError) {
      throw new Error("Error inserting row");
    }

    console.log("Row appended successfully in the database");
    return {
      success: true,
      message: "Row appended successfully in the database",
    };
  } catch (error) {
    console.error("Error appending row to the database:", error);
    return { success: false, message: error.message };
  }
};

module.exports = { updateCellInDB, deleteCellInDB, appendRowToDB };
