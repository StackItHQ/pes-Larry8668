const { google } = require("googleapis");

const handleSync = async (req, res, next) => {
  const change = req.body;
  console.log("change ->", change);

  const spreadsheetUrl = `${req.protocol}://${req.get("host")}/api/spreadsheet`;
  const sheetUrl = `${req.protocol}://${req.get("host")}/api/sheet`;
  const rowUrl = `${req.protocol}://${req.get("host")}/api/row`;

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(
        process.env.VERCEL_GOOGLE_APPLICATION_CREDENTIALS
      ),
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const {
      spreadsheetId,
      sheetId,
      sheetName,
      startRow,
      endRow,
      userEmail,
      userRole,
      localTimestamp,
    } = change;

    let spreadsheetDbId;
    try {
      // Fetch spreadsheet data from /api/spreadsheet
      let response = await fetch(spreadsheetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spreadsheetId }),
      });
      let spreadsheet = await response.json();
      console.log("spreadsheet ->", spreadsheet);
      spreadsheetDbId = spreadsheet.id;
    } catch (error) {
      console.error(`Error processing spreadsheet ${spreadsheetId}:`, error);
      return res.status(500).json({ error: `Spreadsheet processing failed.` });
    }

    try {
      // Fetch sheet data from /api/sheet
      const sheets = await googleSheets.spreadsheets.get({ spreadsheetId });
      const sheet = sheets.data.sheets.find(
        (s) => s.properties.sheetId === sheetId
      );
      if (!sheet) {
        return res.status(404).json({ error: `Sheet not found.` });
      }

      let sheetDbId;
      try {
        let response = await fetch(sheetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            spreadsheetId: spreadsheetDbId,
            sheetName: sheet.properties.title,
            sheetId: sheet.properties.sheetId,
            actualSpreadsheetId: spreadsheetId,
          }),
        });
        let existingSheet = await response.json();
        console.log("existingSheet ->", existingSheet);
        sheetDbId = existingSheet.id;
      } catch (error) {
        console.error(
          `Error processing sheet ${sheet.properties.sheetId}:`,
          error
        );
        return res.status(500).json({ error: `Sheet processing failed.` });
      }

      try {
        await fetch(rowUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sheetId: sheetDbId,
            startRow,
            endRow,
            spreadsheetId,
            sheetName: sheet.properties.title,
            userEmail: userEmail || "example@example.com",
            userRole: userRole || "editor",
            localTimestamp,
          }),
        });
      } catch (error) {
        console.error(`Error fetching rows for sheet ${sheetDbId}:`, error);
        return res.status(500).json({ error: `Row fetching failed.` });
      }
    } catch (error) {
      console.error(
        `Error fetching sheets for spreadsheet ${spreadsheetId}:`,
        error
      );
      return res.status(500).json({ error: `Sheet fetching failed.` });
    }

    res.status(200).send("Data synced successfully");
  } catch (error) {
    console.error("Error syncing data:", error);
    res.status(500).send("Failed to sync data");
  }
};

module.exports = { handleSync };
