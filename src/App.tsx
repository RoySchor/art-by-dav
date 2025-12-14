import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoaderLine from "./components/LoaderLine/LoaderLine.tsx";
import TVReveal from "./components/TVReveal/TVReveal.tsx";
import LogoCard from "./components/LogoCard/LogoCard.tsx";
import Sidebar from "./components/Sidebar/Sidebar.tsx";
import BottomNav from "./components/BottomNav/BottomNav.tsx";
import ArtworkPage from "././pages/artwork/ArtworkPage";
import "./styles.css";

const Home: React.FC<{ done: boolean }> = ({ done }) => (
  <div className="app-shell" aria-live="polite">
    <Sidebar />
    <main>
      <section className="content-center" id="home">
        {done && (
          <TVReveal>
            <LogoCard />
          </TVReveal>
        )}
      </section>
    </main>
  </div>
);

const App: React.FC = () => {
  const [done, setDone] = useState(false);

  return (
    <BrowserRouter>
      {!done && <LoaderLine onDone={() => setDone(true)} />}
      <Routes>
        <Route path="/" element={<Home done={done} />} />
        <Route path="/artwork" element={<ArtworkPage />} />
        {/* future: <Route path="/contact" element={<ContactPage />} /> */}
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
};

export default App;
