import { useEffect, useMemo, useState } from 'react';
import GalaxyCanvas from './components/GalaxyCanvas.jsx';
import './App.css';
import './components/GalaxyCanvas.css';
import { memoryLog, missionStats, planetOrbits } from './data/galaxyData.js';

function formatCombo(combo) {
  if (combo >= 42) return 'Supernova Connection';
  if (combo >= 24) return 'Nebula Embrace';
  if (combo >= 12) return 'Aurora Synchrony';
  if (combo >= 5) return 'Stardust Harmony';
  return 'Hearts Align';
}

export default function App() {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [toast, setToast] = useState(null);
  const [collectedColors, setCollectedColors] = useState([]);

  const collectedPalette = useMemo(
    () => (collectedColors.length ? collectedColors.slice(-5) : ['#ff8fcb', '#7d6bff', '#82f3ff']),
    [collectedColors]
  );

  useEffect(() => {
    if (!combo) {
      setToast(null);
      return;
    }

    const title = formatCombo(combo);
    setToast({ title, message: `Combo x${combo}! Your love ship is blazing.` });

    const timeout = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timeout);
  }, [combo]);

  const handleCollect = ({ hue, combo: nextCombo }) => {
    setScore((prev) => prev + Math.ceil(10 * (1 + nextCombo / 4)));
    setCollectedColors((prev) => [...prev, `hsl(${hue} 90% 70%)`].slice(-12));
  };

  const handleComboChange = (value) => {
    setCombo(value);
  };

  return (
    <div className="app-shell">
      <div className="background-stars" />
      <div className="glass-ring" />

      <section className="hero">
        <span className="hero-badge">Mukami Galaxy Mission</span>
        <h1>A cosmos of love where every orbit whispers your name</h1>
        <p>
          Sail the heart-ship across nebulae, collect luminous memories, and explore a universe handcrafted for you,
          Mukami. Every sparkle, every animation, and every planet celebrates the infinite ways you are loved.
        </p>
      </section>

      <GalaxyCanvas onCollect={handleCollect} onComboChange={handleComboChange} />

      <div className="score-card">
        <div>
          <div className="score-label">Collected Starlight</div>
          <div className="score-value">{score.toLocaleString()}</div>
        </div>
        <div>
          <div className="score-label">Combo Energy</div>
          <div className="score-value">x{combo}</div>
        </div>
        <div>
          <div className="score-label">Love Spectrum</div>
          <div className="score-value" style={{ display: 'flex', gap: '0.4rem' }}>
            {collectedPalette.map((color, index) => (
              <span
                key={`${color}-${index}`}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: color,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                  border: '1px solid rgba(255,255,255,0.35)'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="orbital-ring">
        <div className="orbit-track" />
        {planetOrbits.map((planet, index) => (
          <PlanetOrbit key={planet.name} index={index} {...planet} />
        ))}
      </div>

      <section className="mission-grid">
        {missionStats.map((stat) => (
          <article key={stat.label}>
            <span className="score-label">{stat.label}</span>
            <span className="score-value">{stat.value}</span>
            <p style={{ margin: 0, color: 'rgba(214,216,255,0.74)' }}>{stat.description}</p>
          </article>
        ))}
      </section>

      <section className="memory-grid">
        {memoryLog.map((memory) => (
          <article className="memory-card" key={memory.title}>
            <time>{memory.date}</time>
            <h3>{memory.title}</h3>
            <p>{memory.description}</p>
          </article>
        ))}
      </section>

      <footer className="footer">Hand-coded constellations for Mukami • React + Vite • Deploy-ready for Vercel</footer>

      {toast && (
        <div className="love-toast" style={{ borderImage: `linear-gradient(120deg, ${collectedPalette.join(',')}) 1` }}>
          <span className="toast-title">{toast.title}</span>
          <span className="toast-body">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

function PlanetOrbit({ name, color, period, blurb, radius, index }) {
  const angle = (index / planetOrbits.length) * Math.PI * 2;
  const orbitRadius = Math.min(45, radius / 6);
  const x = 50 + Math.cos(angle) * orbitRadius;
  const y = 50 + Math.sin(angle) * orbitRadius;

  return (
    <div
      className="orbit-planet"
      style={{
        background: `radial-gradient(circle at 30% 30%, ${color}, rgba(255,255,255,0.45))`,
        top: `${y}%`,
        left: `${x}%`,
        animationDuration: `${period}s`,
        animationDelay: `${index * -1.5}s`
      }}
    >
      <span>{name.charAt(0)}</span>
      <span className="orbit-label">{blurb}</span>
    </div>
  );
}
