import React, { useEffect, useRef } from "react";

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
      el.style.animation = `tvOpen 650ms cubic-bezier(.2,.9,.2,1) forwards`;
    }, delayMs);
    return () => clearTimeout(id);
  }, [delayMs]);

  return (
    <div style={{ overflow: "hidden" }}>
      <div ref={ref} style={{ transform: "scaleY(0)", transformOrigin: "50% 50%" }}>
        {children}
      </div>
    </div>
  );
};

export default TVReveal;
