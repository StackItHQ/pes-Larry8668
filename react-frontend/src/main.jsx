import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import Logs from "./pages/Logs";
import Update from "./pages/Update";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/update" element={<Update />} />
      </Routes>
    </Router>
  </StrictMode>
);
