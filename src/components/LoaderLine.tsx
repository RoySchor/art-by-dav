import React, { useEffect, useRef } from "react";

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
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "var(--bg)",
        zIndex: 1000,
      }}
    >
      <div
        ref={ref}
        style={{
          width: "100vw",
          height: 2,
          background: "var(--accent)",
          transformOrigin: "center",
          transform: "scaleX(0)",
          animation: `lineGrow ${durationMs}ms cubic-bezier(.22,.61,.36,1) forwards`,
        }}
      />
    </div>
  );
};

export default LoaderLine;
