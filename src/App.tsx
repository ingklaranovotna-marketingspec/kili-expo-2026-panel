import { useState } from "react";
import { motion } from "framer-motion";
import { Map, Calendar } from "lucide-react";
import FloorMap from "./components/FloorMap";
import SupplierDetail from "./components/SupplierDetail";
import Schedule from "./components/Schedule";
import VideoIntro from "./components/VideoIntro";
import { suppliers } from "./data/suppliers";
import type { Supplier } from "./data/suppliers";
import "./App.css";

type View = "map" | "schedule";

export default function App() {
  const [view, setView] = useState<View>("map");
  const [selected, setSelected] = useState<Supplier | null>(null);

  return (
    <div className="app">
      {/* Top bar */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="kili-logo-wrap">
            <img src="/logos/kili.svg" alt="Kili" className="kili-logo"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="kili-name">KILI</span>
          </div>
          <div className="event-info">
            <span className="event-title">EXPO 2026</span>
            <span className="event-meta">26. 5. 2026 · Šlapanice u Brna · 9:00 – 13:00</span>
          </div>
        </div>

        <nav className="topbar-nav">
          <VideoIntro />
          <button
            className={`nav-btn ${view === "map" ? "active" : ""}`}
            onClick={() => setView("map")}
          >
            <Map size={18} />
            <span>Mapa expozice</span>
          </button>
          <button
            className={`nav-btn ${view === "schedule" ? "active" : ""}`}
            onClick={() => setView("schedule")}
          >
            <Calendar size={18} />
            <span>Program dne</span>
          </button>
        </nav>
      </header>

      {/* Main content */}
      <main className="main-content">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="view-wrapper"
        >
          {view === "map" ? (
            <FloorMap suppliers={suppliers} onSelect={setSelected} />
          ) : (
            <Schedule />
          )}
        </motion.div>
      </main>

      {/* Supplier detail modal */}
      <SupplierDetail supplier={selected} onClose={() => setSelected(null)} />

      {/* Footer */}
      <footer className="footer">
        <span>© 2026 Kili s.r.o. · Šlapanice u Brna · <strong>{suppliers.length} vystavovatelů</strong></span>
      </footer>
    </div>
  );
}
