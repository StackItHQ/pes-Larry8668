import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";

import App from "./App.jsx";
import Logs from "./pages/Logs";
import Update from "./pages/Update";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NextUIProvider>
      <NavBar />
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/update" element={<Update />} />
        </Routes>
        <Footer />
      </Router>
    </NextUIProvider>
  </StrictMode>
);
