import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.tsx";
import Coverflow from "./Coverflow/Coverflow.tsx";
import Lightbox from "./Lightbox/Lightbox.tsx";
import "./artwork.css";

export type ArtItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  thumb: string;
};

const PLACEHOLDERS: ArtItem[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `art-${i}`,
  title: `Untitled No. ${i + 1}`,
  description: "A short placeholder description of this piece.",
  thumb: `https://picsum.photos/seed/a${i}/480/360`,
  image: `https://picsum.photos/seed/a${i}/1600/1200`,
}));

const ArtworkPage: React.FC = () => {
  const [selected, setSelected] = useState<number>(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="app-shell artwork-page">
      <Sidebar />

      <main className="artwork-main">
        <section className="coverflow-wrap">
          <Coverflow
            items={PLACEHOLDERS}
            index={selected}
            onIndexChange={setSelected}
            onOpen={(i) => setOpenIndex(i)}
          />
          <div className="art-meta">
            <div className="art-title">{PLACEHOLDERS[selected].title}</div>
            <div className="art-desc">{PLACEHOLDERS[selected].description}</div>
          </div>
        </section>
      </main>

      <Lightbox
        openIndex={openIndex}
        items={PLACEHOLDERS}
        onClose={() => setOpenIndex(null)}
        onPrev={() => setOpenIndex((i) => (i! > 0 ? i! - 1 : i))}
        onNext={() => setOpenIndex((i) => (i! < PLACEHOLDERS.length - 1 ? i! + 1 : i))}
      />
    </div>
  );
};

export default ArtworkPage;
