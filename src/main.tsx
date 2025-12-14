import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

if (!/github\.io$/i.test(window.location.hostname)) {
  const url = new URL(window.location.href);
  if (url.searchParams.has("p")) {
    window.history.replaceState({}, "", import.meta.env.BASE_URL || "/");
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
