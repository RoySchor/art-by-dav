import React from "react";
import { Link } from "react-router-dom";
import "./bottom-nav.css";

const BottomNav: React.FC = () => (
  <nav className="bottom-nav" aria-label="Mobile Navigation">
    <div className="bottom-scroll">
      <Link className="bottom-chip" to="/">
        Home
      </Link>
      <Link className="bottom-chip" to="/artwork">
        Artwork
      </Link>
      <Link className="bottom-chip" to="/">
        Contact
      </Link>
    </div>
  </nav>
);

export default BottomNav;
