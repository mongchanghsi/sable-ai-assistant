import React from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import App from "./App";

const appId = "SABLE_ASSISTANT_ROOT";

createRoot(document.getElementById(appId)!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
