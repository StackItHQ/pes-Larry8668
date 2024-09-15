const { google } = require("googleapis");

// Set up Google Auth
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.VERCEL_GOOGLE_APPLICATION_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const updateSheet = async (req, res) => {
  try {
    const { spreadsheetId, sheetName, row, column, newValue } = req.body;

    // Validate input
    if (!spreadsheetId || !row || !column || newValue === undefined) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Convert row and column to A1 notation
    const range = `${sheetName ? sheetName + "!" : ""}${String.fromCharCode(
      64 + column
    )}${row}`;

    // Update the cell
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: {
        values: [[newValue]],
      },
    });

    res.json({
      success: true,
      message: `Cell updated successfully at ${range}`,
      updatedCells: response.data.updatedCells,
    });
  } catch (error) {
    console.error("Error updating cell:", error);
    res
      .status(500)
      .json({ error: "Failed to update cell", details: error.message });
  }
};

module.exports = { updateSheet };
