import React, { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav/BottomNav";
import Intro from "./components/Intro/Intro";
import ArtworkPage from "./pages/artwork/ArtworkPage";
import "./styles.css";

const App: React.FC = () => {
  const [introDone, setIntroDone] = useState(false);

  return (
    <HashRouter>
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}

      {introDone && (
        <>
          <Routes>
            {/* Artwork is now the root: /#/ */}
            <Route path="/" element={<ArtworkPage />} />
          </Routes>
          <BottomNav />
        </>
      )}
    </HashRouter>
  );
};

export default App;
