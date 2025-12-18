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

  const spacing = isMobile ? 150 : 220;
  const angle = 60;
  const sideScale = 0.9;
  const depthPerStep = isMobile ? 60 : 80;
  const DRAG_THRESHOLD_PX = isMobile ? 8 : 42;
  const STEP_COOLDOWN_MS = isMobile ? 90 : 160;

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
    [index, items.length, onIndexChange, WHEEL_THRESHOLD]
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

  const drag = useRef<{ id: number; startX: number; startY: number; lastStepTime: number } | null>(
    null
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    didDrag.current = false;
    drag.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastStepTime: performance.now(),
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;

    if (Math.abs(dy) > Math.abs(dx)) return;

    e.preventDefault();

    const now = performance.now();
    if (Math.abs(dx) >= DRAG_THRESHOLD_PX && now - drag.current.lastStepTime >= STEP_COOLDOWN_MS) {
      const dir = dx < 0 ? 1 : -1;
      onIndexChange(clamp(index + dir, 0, items.length - 1));
      drag.current.startX = e.clientX;
      drag.current.lastStepTime = now;
      didDrag.current = true;
    }
  };

  const endDrag = () => {
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
