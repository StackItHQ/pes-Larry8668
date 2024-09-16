import React, { useState } from "react";
import { motion } from "framer-motion";

const LogEntry = ({ log, index }) => {
  const [activeTab, setActiveTab] = useState("new");

  const getRowBackground = (changeType) => {
    switch (changeType) {
      case "insert":
        return "bg-green-100";
      case "delete":
        return "bg-red-100";
      case "update":
        return "bg-yellow-100";
      default:
        return "bg-white";
    }
  };

  // Skip logs with empty rows_changed
  if (log.rows_changed.length === 0) {
    return null;
  }

  // Prepare tables for previous and new data
  const prevDataTable = [];
  const newDataTable = [];

  // Iterate through the rows_changed array
  for (let x = 0; x < log.rows_changed[0].length; x++) {
    const row = log.rows_changed[0][x]; // Get the current row number
    const prevData = log.prev_data[0][x] || {}; // Get the corresponding previous data
    const newData = log.new_data[0][x] || {}; // Get the corresponding new data
    console.log("Row:", x, row, log.rows_changed[0], prevData, newData);

    // Get all unique keys from both prevData and newData
    const allKeys = new Set();

    // Add keys from prevData if it's not empty
    if (Object.keys(prevData).length > 0) {
      Object.keys(prevData).forEach((key) => allKeys.add(key));
    }

    // Add keys from newData if it's not empty
    if (Object.keys(newData).length > 0) {
      Object.keys(newData).forEach((key) => allKeys.add(key));
    }

    // Convert the Set to an array if needed
    const uniqueKeysArray = Array.from(allKeys);

    // Add to previous data table
    prevDataTable.push({
      rowNo: row,
      data: prevData,
      keys: allKeys,
    });

    // Add to new data table
    newDataTable.push({
      rowNo: row,
      data: newData,
      keys: allKeys,
    });
  }

  // Now prevDataTable and newDataTable contain the desired structure
  console.log("Previous Data Table:", prevDataTable);
  console.log("New Data Table:", newDataTable);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-6 max-w-4xl mx-auto border border-gray-300 max-h-screen overflow-y-scroll overflow-x-hidden"
    >
      <div className="mb-4">
        <span className="font-bold">Sheet Name:</span> {log.sheet_name}
        <span className="ml-4 font-bold">User:</span> {log.user_email} (
        {log.user_role})<span className="ml-4 font-bold">Time:</span>{" "}
        {new Date(log.local_timestamp).toLocaleString()}
      </div>

      {/* Tab Navigation */}
      <div className="mb-4">
        <button
          className={`px-4 py-2 rounded-l-lg ${
            activeTab === "prev" ? "bg-gray-300" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("prev")}
        >
          Previous Data
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg ${
            activeTab === "new" ? "bg-gray-300" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("new")}
        >
          New Data
        </button>
      </div>

      {/* Iterate over the data tables and display rows */}
      {(activeTab === "prev" ? prevDataTable : newDataTable).map((table, i) => (
        <div
          key={i}
          className={`mb-6 p-4 rounded-lg overflow-x-scroll ${getRowBackground(
            log.change_type[i]
          )}`}
        >
          <h3 className="font-bold mb-2">
            Row {table.rowNo} - {log.change_type[i]}
          </h3>
          <table className="w-full border-collapse border border-gray-400 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Row No</th>
                {table.keys.size > 0 ? (
                  Array.from(table.keys).map((key) => (
                    <th key={key} className="border p-2">
                      {key}
                    </th>
                  ))
                ) : (
                  <th className="border p-2">No Data</th>
                )}
              </tr>
            </thead>
            <tbody>
              {Object.keys(table.data).length === 0 ? (
                <tr className="bg-white">
                  <td className="border p-2 text-center">{table.rowNo}</td>
                  {Array.from(table.keys).map((key) => (
                    <td key={key} className="border p-2">
                      -
                    </td>
                  ))}
                </tr>
              ) : (
                <tr className="bg-white">
                  <td className="border p-2 text-center">{table.rowNo}</td>
                  {Array.from(table.keys).map((key) => (
                    <td key={key} className="border p-2">
                      {table.data[key] !== undefined ? table.data[key] : "-"}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </motion.div>
  );
};

export default LogEntry;
