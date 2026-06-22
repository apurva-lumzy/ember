import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Creation, Journey, Origin, Future } from "./pages/index.js";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
        <Routes>
          <Route element={<App />}>
            <Route index element={<Origin />} />
            <Route path="journey" element={<Journey />} />
            <Route path="future" element={<Future />} />
            <Route path="creation" element={<Creation />} />
          </Route>
        </Routes>
    </BrowserRouter>
  </StrictMode>,
);
