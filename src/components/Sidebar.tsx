import React from "react";

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar" aria-label="Primary">
      <a
        className="sidebar-card"
        href="#"
        style={{ padding: 20, textDecoration: "none", color: "inherit" }}
      >
        <div style={{ fontSize: 14, opacity: 0.65, marginBottom: 6 }}>01</div>
        <div style={{ fontWeight: 800, fontSize: 20 }}>Home</div>
      </a>
      <a
        className="sidebar-card"
        href="#"
        style={{ padding: 20, textDecoration: "none", color: "inherit" }}
      >
        <div style={{ fontSize: 14, opacity: 0.65, marginBottom: 6 }}>02</div>
        <div style={{ fontWeight: 800, fontSize: 20 }}>Artwork</div>
      </a>
      <a
        className="sidebar-card"
        href="#"
        style={{ padding: 20, textDecoration: "none", color: "inherit" }}
      >
        <div style={{ fontSize: 14, opacity: 0.65, marginBottom: 6 }}>03</div>
        <div style={{ fontWeight: 800, fontSize: 20 }}>Contact</div>
      </a>
    </aside>
  );
};

export default Sidebar;
