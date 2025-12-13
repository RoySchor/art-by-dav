import React, { useState } from "react";
import LoaderLine from "./components/LoaderLine";
import TVReveal from "./components/TVReveal";
import LogoCard from "./components/LogoCard";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";

const App: React.FC = () => {
  const [done, setDone] = useState(false);

  return (
    <>
      {!done && <LoaderLine onDone={() => setDone(true)} />}

      <div className="app-shell" aria-live="polite">
        {/* Desktop sidebar (hidden on mobile via CSS grid change) */}
        <Sidebar />

        {/* Main content */}
        <main>
          <section className="content-center" id="home">
            {/* TV style reveal after loader finishes */}
            {done && (
              <TVReveal>
                <LogoCard />
              </TVReveal>
            )}
          </section>
        </main>
      </div>

      {/* Mobile sticky, horizontal scroll nav */}
      <BottomNav />
    </>
  );
};

export default App;
