import React, { useState } from "react";
import { FaSearch, FaInfoCircle } from "react-icons/fa";
import { supabase } from "../utils/supabaseClient";
import LogEntry from "../components/LogEntry";
import InfoModal from "../components/InfoModal";

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState([]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const fetchLogs = async () => {
    if (!searchTerm) return;
    // Step 1: Check if the spreadsheet exists
    const { data: spreadsheetData, error: spreadsheetError } = await supabase
      .from("spreadsheet")
      .select("id, spreadsheet_id")
      .eq("spreadsheet_id", searchTerm)
      .single();

    if (spreadsheetError || !spreadsheetData) {
      console.error("Spreadsheet not found:", spreadsheetError);
      setLogs([]);
      return;
    }

    console.log("Spreadsheet found:", spreadsheetData);

    // Step 2: Get all sheets for this spreadsheet
    const { data: sheetsData, error: sheetsError } = await supabase
      .from("sheet")
      .select("id, sheet_name")
      .eq("spreadsheet_id", spreadsheetData.id);

    if (sheetsError) {
      console.error("Error fetching sheets:", sheetsError);
      setLogs([]);
      return;
    }

    console.log("Sheets found:", sheetsData);

    // Step 3: Get all change logs for these sheets
    const sheetIds = sheetsData.map((sheet) => sheet.id);
    const { data: logsData, error: logsError } = await supabase
      .from("changes_log")
      .select("*")
      .in("sheet_id", sheetIds);

    if (logsError) {
      console.error("Error fetching logs:", logsError);
      setLogs([]);
      return;
    }

    console.log("Logs found:", logsData);

    // Combine sheet names with logs
    const logsWithSheetNames = logsData.map((log) => ({
      ...log,
      sheet_name: sheetsData.find((sheet) => sheet.id === log.sheet_id)
        ?.sheet_name,
    }));

    setLogs(logsWithSheetNames);
  };

  return (
    <div className="w-screen min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Log Viewer</h1>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-8 flex items-center">
        <input
          type="text"
          placeholder="Enter Spreadsheet ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-3 rounded-l-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={fetchLogs}
          disabled={!searchTerm}
          className="bg-blue-500 text-white p-4 rounded-r-lg hover:bg-blue-600 transition duration-300"
        >
          <FaSearch />
        </button>
        <button
          onClick={() => setIsInfoModalOpen(true)}
          className="ml-2 text-blue-500 hover:text-blue-600"
        >
          <FaInfoCircle size={27} />
        </button>
      </div>

      {/* Log Entries */}
      {logs.map((log, index) => (
        <LogEntry key={log.id} log={log} index={index} />
      ))}

      {/* Info Modal */}
      {isInfoModalOpen && (
        <InfoModal onClose={() => setIsInfoModalOpen(false)} />
      )}
    </div>
  );
};

export default Logs;
