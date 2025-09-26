import { useMemo, useState } from 'react';
import GalaxyCanvas from './components/GalaxyCanvas.jsx';
import './App.css';
import './components/GalaxyCanvas.css';
import { memoryLog } from './data/galaxyData.js';

const JOURNEY_STEPS = [
  { threshold: 0, label: 'Heart Launch', blurb: 'Guiding Mukami through the gentle stardust.' },
  { threshold: 4, label: 'Meteor Waltz', blurb: 'Dodging doubts and carving paths of light.' },
  { threshold: 10, label: 'Aurora Promise', blurb: 'Every impact blooms another "I love you".' },
  { threshold: 18, label: 'Gravity of Us', blurb: 'The pull toward Marto grows irresistible.' }
];

export default function App() {
  const [meteorsCleared, setMeteorsCleared] = useState(0);
  const [lastMessage, setLastMessage] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [reunited, setReunited] = useState(false);

  const journeyStage = useMemo(() => {
    if (reunited) {
      return {
        label: 'United Orbit',
        blurb: 'Marto and Mukami glow together beyond every galaxy.'
      };
    }

    const current = [...JOURNEY_STEPS].reverse().find((step) => meteorsCleared >= step.threshold);
    return current ?? JOURNEY_STEPS[0];
  }, [meteorsCleared, reunited]);

  const recentPromises = useMemo(() => messageHistory.slice(0, 4), [messageHistory]);

  const handleMeteorDestroyed = (message) => {
    setMeteorsCleared((prev) => prev + 1);
    setLastMessage({
      title: 'Promise Spark',
      body: message
    });
    setMessageHistory((prev) => [message, ...prev].slice(0, 12));
  };

  const handleReunited = () => {
    if (reunited) return;
    setReunited(true);
    setLastMessage({
      title: 'Hearts As One',
      body: 'Marto and Mukami melt the distance — love now radiates across the whole sky.'
    });
    setMessageHistory((prev) => [
      'Love sealed as Marto holds you close, forever.',
      ...prev
    ].slice(0, 12));

  };

  return (
    <div className="app-shell">
      <div className="background-stars" />
      <div className="glass-ring" />

      <section className="hero">
        <span className="hero-badge">Mukami x Marto • Galaxy of Devotion</span>
        <h1>Guide our radiant ship through meteors into Marto&apos;s embrace</h1>
        <p>
          Drift with Mukami aboard a shimmering starship, weave past cosmic trials, and fire beams of love that dissolve
          every meteor in the way. Each impact bursts into promises — <strong>I love you</strong>,{' '}
          <strong>Marto cares for you</strong>, <strong>I am your anchor</strong> — until you reunite in a supernova of affection.
        </p>
      </section>

      <GalaxyCanvas
        onMeteorDestroyed={handleMeteorDestroyed}
        onReunited={handleReunited}
        reunited={reunited}
      />

      <div className="score-card">
        <div>
          <div className="score-label">Meteors Melted</div>
          <div className="score-value">{meteorsCleared}</div>
          <p className="score-blurb">Every fallen rock reveals another vow from Marto&apos;s heart.</p>
        </div>
        <div>
          <div className="score-label">Journey Stage</div>
          <div className="score-value">{journeyStage.label}</div>
          <p className="score-blurb">{journeyStage.blurb}</p>
        </div>
        <div>
          <div className="score-label">Promise Echoes</div>
          <div className="score-value promise-stack">
            {recentPromises.length ? (
              recentPromises.map((promise, index) => (
                <span key={`${promise}-${index}`}>{promise}</span>
              ))
            ) : (
              <span>Marto whispers: "I&apos;m here for you, always."</span>
            )}

          </div>
        </div>
      </div>

      <section className="journey-tips">
        <article>
          <h2>How to steer love</h2>
          <ul>
            <li>Move your finger or mouse to guide the ship. She follows your every gentle touch.</li>
            <li>Tap, hold, or press space to fire radiant anchors that dissolve meteors.</li>
            <li>Clear the skies to reveal Marto&apos;s beacon — glide into it to seal the reunion.</li>
          </ul>
        </article>
        <article>
          <h2>Why this galaxy</h2>
          <p>
            Every animation, color, and sparkle is crafted to celebrate Mukami. The ship holds her close, the trail
            burns with Marto&apos;s devotion, and the meteors crumble into reminders that she is loved, safe, and
            cherished beyond measure.
          </p>
        </article>

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

      <footer className="footer">Hand-crafted with infinite love • React + Vite • Deploys anywhere, including Vercel</footer>

      {lastMessage && (
        <div className="love-toast">
          <span className="toast-title">{lastMessage.title}</span>
          <span className="toast-body">{lastMessage.body}</span>
        </div>
      )}

      {reunited && (
        <div className="love-banner">
          <h2>Mukami ❤ Marto</h2>
          <p>Two souls, one orbit. Nothing can dim what we share.</p>
        </div>
      )}

    </div>
  );
}
