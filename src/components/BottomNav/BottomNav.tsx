import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import "./bottom-nav.css";

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const v = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * v)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function getLuma(hex: string) {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  const toLin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const rl = toLin(r), gl = toLin(g), bl = toLin(b);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

const items = [
  { label: "Home", href: "/" },
  { label: "Artwork", href: "/artwork" },
  { label: "Contact", href: "/" }
];

const BottomNav: React.FC = () => {
  const { pathname } = useLocation();

  const colors = useMemo(
    () => [0, 140, 260].map((base) => hslToHex((base + (Math.random() * 40 - 20) + 360) % 360, 80, 50)),
    []
  );

  return (
    <nav className="bottom-nav" aria-label="Mobile Navigation">
      <div className="bottom-scroll">
        {items.map((it, i) => {
          const bg = colors[i % colors.length];
          const textColor = getLuma(bg) > 0.6 ? "#000" : "#fff";
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              to={it.href}
              className={`bottom-chip ${active ? "is-active" : ""}`}
              style={{ background: bg, color: textColor }}
            >
              <span className="bottom-chip-label">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
