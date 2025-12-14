import React, { useEffect, useRef } from "react";
import "./loader-line.css";

interface LoaderLineProps {
  durationMs?: number;
  onDone?: () => void;
}

const LoaderLine: React.FC<LoaderLineProps> = ({ durationMs = 1100, onDone }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = () => onDone?.();
    el.addEventListener("animationend", handle);
    return () => el.removeEventListener("animationend", handle);
  }, [onDone]);

  return (
    <div className="loader-overlay">
      <div ref={ref} className="loader-line" style={{ animationDuration: `${durationMs}ms` }} />
    </div>
  );
};

export default LoaderLine;
