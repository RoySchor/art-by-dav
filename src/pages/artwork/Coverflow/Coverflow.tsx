import React, { useCallback, useEffect, useMemo, useRef } from "react";
import type { ArtItem } from "../ArtworkPage";
import "./coverflow.css";

type Props = {
  items: ArtItem[];
  index: number;
  onIndexChange: (i: number) => void;
  onOpen: (i: number) => void;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const Coverflow: React.FC<Props> = ({ items, index, onIndexChange, onOpen }) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const wheelAcc = useRef(0);
  const WHEEL_THRESHOLD = 100;

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!wrapRef.current) return;
      e.preventDefault();
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      wheelAcc.current += delta;

      if (Math.abs(wheelAcc.current) >= WHEEL_THRESHOLD) {
        const dir = wheelAcc.current > 0 ? 1 : -1;
        onIndexChange(clamp(index + dir, 0, items.length - 1));
        wheelAcc.current = 0;
      }
    },
    [index, items.length, onIndexChange]
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel as any);
  }, [handleWheel]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onIndexChange(clamp(index + 1, 0, items.length - 1));
      if (e.key === "ArrowLeft") onIndexChange(clamp(index - 1, 0, items.length - 1));
      if (e.key === "Enter") onOpen(index);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onIndexChange, onOpen]);

  const rendered = useMemo(
    () =>
      items.map((item, i) => {
        const offset = i - index;
        const abs = Math.abs(offset);
        const isCenter = i === index;

        const rotate = offset === 0 ? 0 : offset > 0 ? -50 : 50;
        const x = offset * 220;
        const z = -abs * 80;
        const scale = isCenter ? 1 : 0.84;

        const style: React.CSSProperties = {
          transform: `translate3d(${x}px, 0, ${z}px) rotateY(${offset === 0 ? 0 : rotate}deg) scale(${scale})`,
          zIndex: 1000 - abs,
        };

        return (
          <button
            key={item.id}
            className={`cf-item ${isCenter ? "is-center" : ""}`}
            style={style}
            onClick={() => (isCenter ? onOpen(i) : onIndexChange(i))}
            aria-label={isCenter ? `Open ${item.title}` : `Focus ${item.title}`}
          >
            <img src={item.thumb} alt={item.title} loading="lazy" />
          </button>
        );
      }),
    [items, index, onIndexChange, onOpen]
  );

  return (
    <div className="cf-scene" ref={wrapRef}>
      <div className="cf-stage">{rendered}</div>
    </div>
  );
};

export default Coverflow;
