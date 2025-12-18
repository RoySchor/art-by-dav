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

  // Track container width to decide "mobile-ish" behavior
  const [width, setWidth] = useState<number>(0);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const isMobile = width > 0 && width < 700;

  // layout/tuning (leave desktop sizing as-is)
  const spacing = isMobile ? 150 : 220;
  const angle = 60;
  const sideScale = 0.9;
  const depthPerStep = isMobile ? 60 : 80;

  // wheel/trackpad sensitivity
  const wheelAcc = useRef(0);
  const WHEEL_THRESHOLD = 110;

  const didDrag = useRef(false);

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
    const onWheel: EventListener = (ev) => handleWheel(ev as unknown as WheelEvent);

    el.addEventListener("wheel", onWheel, { passive: false } as AddEventListenerOptions);
    return () => el.removeEventListener("wheel", onWheel);
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

  // Preload the current & neighbors (helps lightbox feel instant)
  useEffect(() => {
    const preload = (i: number) => {
      if (i < 0 || i >= items.length) return;
      const img = new Image();
      img.decoding = "async";
      img.src = items[i].image;
    };
    preload(index);
    preload(index - 1);
    preload(index + 1);
  }, [index, items]);

  /**
   * Mobile drag that feels "native":
   * - direction-lock (horizontal vs vertical)
   * - accumulate dx and convert to steps (no cooldown)
   */
  const drag = useRef<{
    id: number;
    startX: number;
    startY: number;
    accX: number;
    panning: "none" | "h" | "v";
  } | null>(null);

  const STEP_PX = isMobile ? 22 : 48; // pixels per 1 cover step
  const SLOP_PX = isMobile ? 6 : 10; // ignore tiny jitter

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    didDrag.current = false;

    // keep receiving move/up even if finger leaves element
    wrapRef.current?.setPointerCapture(e.pointerId);

    drag.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      accX: 0,
      panning: "none",
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;

    // decide gesture direction once
    if (d.panning === "none") {
      if (Math.abs(dx) < SLOP_PX && Math.abs(dy) < SLOP_PX) return;
      d.panning = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
    }

    // if user is scrolling vertically, let the page scroll
    if (d.panning === "v") return;

    // horizontal pan: prevent scroll/jank
    e.preventDefault();

    // accumulate horizontal travel
    d.accX += dx;
    d.startX = e.clientX;

    // convert accumulated pixels -> step count (can be multiple)
    let steps = 0;
    while (Math.abs(d.accX) >= STEP_PX) {
      steps += d.accX > 0 ? -1 : 1; // swipe right => previous, swipe left => next
      d.accX += d.accX > 0 ? -STEP_PX : STEP_PX;
    }

    if (steps !== 0) {
      didDrag.current = true;
      onIndexChange(clamp(index + steps, 0, items.length - 1));
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    const d = drag.current;
    if (el && d) el.releasePointerCapture(d.id);
    drag.current = null;
  };

  const rendered = useMemo(
    () =>
      items.map((item, i) => {
        const offset = i - index;
        const abs = Math.abs(offset);
        const isCenter = offset === 0;

        const rotateY = isCenter ? 0 : offset > 0 ? -angle : angle;
        const x = offset * spacing;
        const z = -abs * depthPerStep;
        const scale = isCenter ? 1 : sideScale;

        const style: React.CSSProperties = {
          transform: `translate3d(calc(-50% + ${x}px), calc(-50% + 0px), ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
          zIndex: 1000 - abs,
        };

        return (
          <button
            key={item.id}
            className={`cf-item ${isCenter ? "is-center" : ""}`}
            style={style}
            onClick={() => {
              if (isCenter) onOpen(i);
              else onIndexChange(i);
            }}
            onPointerUp={() => {
              // treat as tap if user didn't actually drag
              if (!didDrag.current) {
                if (isCenter) onOpen(i);
                else onIndexChange(i);
              }
            }}
            aria-label={isCenter ? `Open ${item.title}` : `Focus ${item.title}`}
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className="cf-thumb"
            />
          </button>
        );
      }),
    [items, index, spacing, angle, depthPerStep, sideScale, onIndexChange, onOpen]
  );

  return (
    <div
      className="cf-scene"
      ref={wrapRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="cf-stage">{rendered}</div>
    </div>
  );
};

export default Coverflow;
