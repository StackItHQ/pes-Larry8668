const supabase = require("../supabaseClient");

const handleSpreadsheet = async (req, res, next) => {
  const { spreadsheetId } = req.body;

  if (!spreadsheetId) {
    return res.status(400).send({ message: "Spreadsheet ID is required." });
  }

  try {
    // Check if the spreadsheet already exists
    const { data: existingSpreadsheet, error: selectError } = await supabase
      .from("spreadsheet")
      .select("*")
      .eq("spreadsheet_id", spreadsheetId)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError; // Not found
    }

    if (existingSpreadsheet) {
      // Return the existing row
      return res.status(200).json(existingSpreadsheet);
    } else {
      // Insert the new spreadsheet
      const { data: newSpreadsheet, error: insertError } = await supabase
        .from("spreadsheet")
        .insert([{ spreadsheet_id: spreadsheetId }])
        .single();

      if (insertError) {
        throw insertError;
      }

      // Return the inserted row
      return res.status(201).json(newSpreadsheet);
    }
  } catch (error) {
    console.error("Error handling spreadsheet:", error);
    res.status(500).send("Failed to handle spreadsheet.");
  }
};

const handleSheet = async (req, res, next) => {
  const { spreadsheetId, sheetId, sheetName } = req.body;

  if (!spreadsheetId || !`${sheetId}` || !sheetName) {
    return res.status(400).send({
      message: "Spreadsheet ID, sheet ID, and sheet name are required.",
    });
  }

  try {
    // Check if the sheet already exists
    const { data: existingSheet, error: selectError } = await supabase
      .from("sheet")
      .select("*")
      .eq("sheet_id", sheetId)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError; // Not found
    }

    if (existingSheet) {
      // Return the existing row
      return res.status(200).json(existingSheet);
    } else {
      // Insert the new sheet
      const { data: newSheet, error: insertError } = await supabase
        .from("sheet")
        .insert([
          {
            spreadsheet_id: spreadsheetId,
            sheet_name: sheetName,
            sheet_id: sheetId,
          },
        ])
        .single();

      if (insertError) {
        throw insertError;
      }

      // Return the inserted row
      return res.status(201).json(newSheet);
    }
  } catch (error) {
    console.error("Error handling sheet:", error);
    res.status(500).send("Failed to handle sheet.");
  }
};

const createLogPayload = (
  sheetId,
  rowNo,
  prevData,
  newData,
  userEmail,
  userRole,
  operation,
  localTimestamp
) => {
  return {
    sheet_id: sheetId,
    rows_changed: [rowNo],
    prev_data: [prevData],
    new_data: [newData],
    user_email: userEmail,
    user_role: userRole || null,
    change_type: operation,
    local_timestamp: localTimestamp,
    created_at: new Date().toISOString(),
  };
};

const handleRow = async (req, res, next) => {
  const { sheetId, rowNo, data, userEmail, userRole, localTimestamp } =
    req.body;

  if (sheetId === undefined || rowNo === undefined || data === undefined) {
    return res.status(400).send({
      message:
        "Sheet ID, row number, data, user email, user role, and local timestamp are required.",
    });
  }

  try {
    // Check if the row already exists
    const { data: existingRow, error: selectError } = await supabase
      .from("row")
      .select("*")
      .eq("sheet_id", sheetId)
      .eq("row_no", rowNo)
      .single();

    let operation;
    let oldRow = existingRow;
    let newRow = null;

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError; // Not found
    }

    if (existingRow) {
      console.log("existingRow", existingRow);

      // Check if the existing row's data is equivalent to the incoming data
      const existingData = existingRow.data;
      const dataKeys = new Set([
        ...Object.keys(existingData),
        ...Object.keys(data),
      ]);

      let hasChanges = false;
      dataKeys.forEach((key) => {
        if (existingData[key] !== data[key]) {
          hasChanges = true;
        }
      });

      if (!hasChanges) {
        // Row data hasn't changed
        operation = "no-change";
        oldRow = existingRow;
        newRow = existingRow;
      } else if (Object.keys(data).length === 0) {
        // Row data is empty, delete the row
        const { data: deletedRow, error: deleteError } = await supabase
          .from("row")
          .delete()
          .eq("id", existingRow.id)
          .single();

        if (deleteError) {
          throw deleteError;
        }

        operation = "delete";
        oldRow = existingRow;
        newRow = null;
      } else {
        // Update the row
        const { error: updateError } = await supabase
          .from("row")
          .update({ data })
          .eq("id", existingRow.id)
          .single();

        if (updateError) {
          throw updateError;
        }

        const updatedRow = await supabase
            .from("row")
            .select("*")
            .eq("id", existingRow.id)
            .single();

        console.log("updatedRow", updatedRow || data);

        operation = "update";
        oldRow = existingRow;
        newRow = updatedRow || data;
      }
    } else {
      // Insert new row
      const { error: insertError } = await supabase
        .from("row")
        .insert([{ sheet_id: sheetId, row_no: rowNo, data }])
        .single();

      if (insertError) {
        throw insertError;
      }

      const insertedRow = await supabase
        .from("row")
        .select("*")
        .eq("sheet_id", sheetId)
        .eq("row_no", rowNo)
        .single();

      operation = "insert";
      oldRow = null;
      newRow = insertedRow;
    }

    // Create and send log payload
    const logPayload = createLogPayload(
      sheetId,
      rowNo,
      oldRow ? oldRow.data : null,
      newRow ? newRow.data : null,
      userEmail,
      userRole,
      operation,
      localTimestamp
    );

    const logChangeUrl = `${req.protocol}://${req.get("host")}/api/log-change`;

    await fetch(logChangeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logPayload),
    });

    // Respond based on the operation
    const statusCode = operation === "insert" ? 201 : 200;
    res.status(statusCode).json({
      prev: oldRow ? oldRow.data : null,
      new: newRow ? newRow.data : null,
      operation,
    });
  } catch (error) {
    console.error("Error handling row:", error);
    res.status(500).send("Failed to handle row.");
  }
};

module.exports = { handleSpreadsheet, handleSheet, handleRow };
