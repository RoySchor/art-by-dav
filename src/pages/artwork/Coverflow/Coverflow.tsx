import React, { useCallback, useEffect, useMemo, useRef, useLayoutEffect, useState } from "react";
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

  // Track container width to adapt spacing on small screens
  const [width, setWidth] = useState<number>(0);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    ro.observe(el);
    // initialize immediately
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const isMobile = width > 0 && width < 700;
  const spacing = isMobile ? 150 : 220; // horizontal distance between covers
  const angle = isMobile ? 40 : 50; // Y rotation for side items
  const sideScale = isMobile ? 0.9 : 0.84; // scale for non-center items
  const depthPerStep = isMobile ? 60 : 80; // Z push for depth

  const wheelAcc = useRef(0);
  const WHEEL_THRESHOLD = isMobile ? 160 : 100; // less sensitive on phones/trackpads

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
    [index, items.length, onIndexChange, WHEEL_THRESHOLD]
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
        const offset = i - index; // negative = left, positive = right
        const abs = Math.abs(offset);
        const isCenter = offset === 0;

        const rotateY = isCenter ? 0 : offset > 0 ? -angle : angle;
        const x = offset * spacing;
        const z = -abs * depthPerStep;
        const scale = isCenter ? 1 : sideScale;

        // We position each item from the TRUE center of the stage
        const style: React.CSSProperties = {
          transform: `translate3d(calc(-50% + ${x}px), calc(-50% + 0px), ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
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
            <img src={item.thumb} alt={item.title} loading="lazy" className="cf-thumb" />
          </button>
        );
      }),
    [items, index, spacing, angle, depthPerStep, sideScale, onIndexChange, onOpen]
  );

  return (
    <div className="cf-scene" ref={wrapRef}>
      <div className="cf-stage">{rendered}</div>
    </div>
  );
};

export default Coverflow;
