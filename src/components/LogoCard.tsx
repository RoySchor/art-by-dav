import React from "react";

const LogoCard: React.FC = () => {
  return (
    <div className="logo-card" role="img" aria-label="Art by Dav">
      <div style={{ fontSize: 14, opacity: 0.65, marginBottom: 12 }}>00</div>
      <h1>Art by Dav</h1>
    </div>
  );
};

export default LogoCard;
