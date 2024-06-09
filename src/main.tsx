import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./assets/fonts/Switzer-Regular.woff2";
import "./assets/fonts/InstrumentSerif-Italic.woff2";
import "./assets/fonts/JetBrainsMono-Regular.woff2";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
