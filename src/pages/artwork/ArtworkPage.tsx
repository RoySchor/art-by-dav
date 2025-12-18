import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.tsx";
import Coverflow from "./Coverflow/Coverflow.tsx";
import Lightbox from "./Lightbox/Lightbox.tsx";
import placeholder1 from "../../assets/artwork/placeholder-painting.webp";
import placeholder2 from "../../assets/artwork/placeholder-painting-2.webp";
import "./artwork.css";

export type ArtItem = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const ARTWORK: ArtItem[] = [
  {
    id: "placeholder_1",
    title: "Placeholder",
    description: "A short placeholder description of this piece.",
    image: placeholder1,
  },
  {
    id: "placeholder_2",
    title: "Placeholder",
    description: "A short placeholder description of this piece.",
    image: placeholder2,
  },
  {
    id: "placeholder_3",
    title: "Placeholder",
    description: "A short placeholder description of this piece.",
    image: placeholder1,
  },
  {
    id: "placeholder_4",
    title: "Placeholder",
    description: "A short placeholder description of this piece.",
    image: placeholder2,
  },
  {
    id: "placeholder_5",
    title: "Placeholder",
    description: "A short placeholder description of this piece.",
    image: placeholder1,
  },
  {
    id: "placeholder_6",
    title: "Placeholder",
    description: "A short placeholder description of this piece.",
    image: placeholder2,
  },
  {
    id: "placeholder_7",
    title: "Placeholder",
    description: "A short placeholder description of this piece.",
    image: placeholder1,
  },
  {
    id: "placeholder_8",
    title: "Placeholder",
    description: "A short placeholder description of this piece.",
    image: placeholder2,
  },
  {
    id: "placeholder_9",
    title: "Placeholder",
    description: "A short placeholder description of this piece.",
    image: placeholder1,
  },
  {
    id: "placeholder_10",
    title: "Placeholder",
    description: "A short placeholder description of this piece.",
    image: placeholder2,
  },
];
const ArtworkPage: React.FC = () => {
  const [selected, setSelected] = useState<number>(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="app-shell artwork-page">
      <Sidebar />

      <main className="artwork-main">
        <section className="coverflow-wrap">
          <Coverflow
            items={ARTWORK}
            index={selected}
            onIndexChange={setSelected}
            onOpen={(i) => setOpenIndex(i)}
          />
          <div className="art-meta">
            <div className="art-title">{ARTWORK[selected].title}</div>
            <div className="art-desc">{ARTWORK[selected].description}</div>
          </div>
        </section>
      </main>

      <Lightbox
        openIndex={openIndex}
        items={ARTWORK}
        onClose={() => setOpenIndex(null)}
        onPrev={() => setOpenIndex((i) => (i! > 0 ? i! - 1 : i))}
        onNext={() => setOpenIndex((i) => (i! < ARTWORK.length - 1 ? i! + 1 : i))}
      />
    </div>
  );
};

export default ArtworkPage;
