import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

if (/github\.io$/i.test(window.location.hostname)) {
  const p = new URLSearchParams(window.location.search).get("p");
  if (p) {
    const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, ""); // "/art-by-dav"
    const rel = p.startsWith("/") ? p : `/${p}`; // "/artwork"
    window.history.replaceState({}, "", `${base}${rel}`); // "/art-by-dav/artwork"
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
