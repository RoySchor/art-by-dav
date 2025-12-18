import React, { useEffect, useState } from "react";
import LoaderLine from "../LoaderLine/LoaderLine";
import LogoCard from "../LogoCard/LogoCard";
import "./intro.css";

type Props = { onDone: () => void };

const Intro: React.FC<Props> = ({ onDone }) => {
  const [phase, setPhase] = useState<"line" | "tvOpen" | "tvClose">("line");

  useEffect(() => {
    if (phase !== "tvOpen") return;

    // keep logo shown briefly, then close
    const t = window.setTimeout(() => setPhase("tvClose"), 650);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "tvClose") return;

    // after close animation, hand off to app
    const t = window.setTimeout(() => onDone(), 700);
    return () => window.clearTimeout(t);
  }, [phase, onDone]);

  return (
    <div className="intro-overlay" aria-hidden={phase !== "tvClose"}>
      {phase === "line" && <LoaderLine onDone={() => setPhase("tvOpen")} />}

      {phase !== "line" && (
        <div className={`intro-tv ${phase === "tvClose" ? "intro-tv--close" : "intro-tv--open"}`}>
          <LogoCard />
        </div>
      )}

      {phase === "tvClose" && <div className="intro-close-line" />}
    </div>
  );
};

export default Intro;
