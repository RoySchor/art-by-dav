import React from "react";
import "./bottom-nav.css";

const BottomNav: React.FC = () => (
  <nav className="bottom-nav" aria-label="Mobile Navigation">
    <div className="bottom-scroll">
      <a className="bottom-chip" href="#">
        Home
      </a>
      <a className="bottom-chip" href="#">
        Artwork
      </a>
      <a className="bottom-chip" href="#">
        Contact
      </a>
    </div>
  </nav>
);

export default BottomNav;
