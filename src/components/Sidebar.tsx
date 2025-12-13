import React, { useMemo } from "react";

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
  const rl = toLin(r),
    gl = toLin(g),
    bl = toLin(b);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

const labels = [
  { num: "00", title: "Home", href: "#" },
  { num: "01", title: "Artwork", href: "#" },
  { num: "02", title: "Contact", href: "#" },
];

const Sidebar: React.FC = () => {
  const colors = useMemo(() => {
    // three distinct-ish hues
    return [0, 140, 260].map((base) => {
      const h = (base + Math.floor(Math.random() * 40) - 20 + 360) % 360;
      const s = 80;
      const l = 50;
      return hslToHex(h, s, l);
    });
  }, []);

  return (
    <aside className="sidebar" aria-label="Primary">
      {labels.map((item, i) => {
        const bg = colors[i % colors.length];
        const luma = getLuma(bg);
        const textColor = luma > 0.6 ? "#000" : "#fff"; // if very light, use black
        return (
          <a
            key={item.title}
            className="sidebar-card"
            href={item.href}
            style={{ background: bg, color: textColor }}
          >
            <div className="sidebar-num">{item.num}</div>
            <div style={{ fontWeight: 800, fontSize: 28 }}>{item.title}</div>
          </a>
        );
      })}
    </aside>
  );
};

export default Sidebar;
