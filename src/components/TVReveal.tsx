import React, { useEffect, useRef } from "react";
import "./tv-reveal.css";

interface TVRevealProps {
  delayMs?: number;
  children: React.ReactNode;
}

const TVReveal: React.FC<TVRevealProps> = ({ delayMs = 50, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const id = setTimeout(() => {
      el.classList.add("tv-inner--revealed");
    }, delayMs);
    return () => clearTimeout(id);
  }, [delayMs]);

  return (
    <div className="tv-wrapper">
      <div ref={ref} className="tv-inner">
        {children}
      </div>
    </div>
  );
};

export default TVReveal;
