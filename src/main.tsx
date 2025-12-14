import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

if (/github\.io$/i.test(window.location.hostname)) {
  const p = new URLSearchParams(window.location.search).get("p");
  if (p) window.history.replaceState({}, "", p);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
