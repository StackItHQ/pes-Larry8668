import React from "react";
import step from "../assets/search-bar-info.png";

const InfoModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg max-w-2xl flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold mb-4">How to Use the Log Viewer</h2>
      <p className="w-full p-5">
        You will need a Spreadsheet ID to proceed. This can be found in the URL.
      </p>
      <img
        src={step}
        alt="Steps"
        className="mt-4 rounded-md overflow-scroll md:max-w-xl"
      />
      <div className="w-full p-5">
        Here one you can try :{" "}
        <span className="p-1 rounded bg-slate-200 font-semibold">
          18FQiZu3F4rnP31IslQwNnknd6ZwCA6A4G2Lpd-kmnQo
        </span>
      </div>
      <p className="mb-4 w-full p-5">
        Enter a Spreadsheet ID in the search bar to view all associated logs.
        The logs show changes made to sheets within the spreadsheet, including
        insertions (green), deletions (red), and updates (yellow).
      </p>
      <div className="w-full flex justify-end items-center">
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default InfoModal;
