import React, { useEffect } from "react";
import type { ArtItem } from "../ArtworkPage";
import "./lightbox.css";

type Props = {
  openIndex: number | null;
  items: ArtItem[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

const Lightbox: React.FC<Props> = ({ openIndex, items, onClose, onPrev, onNext }) => {
  const open = openIndex !== null;
  const item = open ? items[openIndex!] : null;

  const hasPrev = open && openIndex! > 0;
  const hasNext = open && openIndex! < items.length - 1;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onPrev, onNext, hasPrev, hasNext]);

  if (!open || !item) return null;

  return (
    <div className="lb-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lb-panel" onClick={(e) => e.stopPropagation()}>
        <div className="lb-media">
          <img src={item.image} alt={item.title} />
        </div>

        <aside className="lb-sidebar">
          <div className="lb-title">{item.title}</div>
          <div className="lb-desc">{item.description}</div>
        </aside>

        <button className="lb-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {hasPrev && (
          <button className="lb-nav lb-prev" onClick={onPrev} aria-label="Previous">
            ‹
          </button>
        )}

        {hasNext && (
          <button className="lb-nav lb-next" onClick={onNext} aria-label="Next">
            ›
          </button>
        )}
      </div>
    </div>
  );
};

export default Lightbox;
