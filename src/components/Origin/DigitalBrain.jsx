import React, { useEffect, useRef, useState } from 'react';
import BrainScene from './BrainScene';
import { motion, AnimatePresence } from 'motion/react';

const DigitalBrain = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const [sceneState, setSceneState] = useState('IDLE');
  const [isStarted, setIsStarted] = useState(false);
  const [particleCount] = useState(22000);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const brainScene = new BrainScene(containerRef.current);
    sceneRef.current = brainScene;

    return () => {
      brainScene.dispose();
      sceneRef.current = null;
    };
  }, []);

  const handleStart = () => {
    if (sceneRef.current && !isStarted) {
      setIsStarted(true);
      sceneRef.current.startSequence((state) => {
        setSceneState(state);
      });
    }
  };

  const handleRestart = () => {
    if (sceneRef.current) {
      sceneRef.current.resetAll((state) => {
        setSceneState(state);
      });
      setIsStarted(false);
    }
  };

  return (
    <section className="relative w-full h-[100vh]" style={{ background: 'radial-gradient(ellipse at 50% 45%, #0b0805 0%, #050403 55%, #000000 100%)', overflow: 'hidden', fontFamily: "'JetBrains Mono', monospace" }}>
      <style>{`
        .digital-brain-ui {
          box-sizing: border-box;
          color: #f1e9da;
        }
        .digital-brain-ui .top-left {
          max-width: 320px;
          color: rgba(245, 158, 11, 0.8);
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .digital-brain-ui .eyebrow {
          margin: 0 0 0.5rem 0;
          opacity: 0.85;
        }
        .digital-brain-ui h2 {
          font-family: 'Anton', sans-serif;
          letter-spacing: 0.08em;
          font-size: clamp(1.5rem, 3vw, 2.4rem);
          color: #f59e0b;
          margin: 0 0 0.9rem 0;
          text-shadow: 0 0 18px rgba(245, 158, 11, 0.35);
        }
        .digital-brain-ui p {
          color: #9a958a;
          text-transform: none;
          letter-spacing: normal;
          line-height: 1.5;
          font-size: 0.78rem;
          margin: 0;
        }
        .digital-brain-ui .top-right {
          position: absolute;
          top: 3rem;
          right: 1.5rem;
          text-align: right;
          color: #f59e0b;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
        }
        .digital-brain-ui .particle-count {
          display: block;
          margin-top: 0.35rem;
          color: rgba(245, 158, 11, 0.5);
          font-size: 0.62rem;
        }
        .digital-brain-ui .cta-panel {
          border: 1px solid rgba(245, 158, 11, 0.3);
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(10px);
          border-radius: 18px;
          padding: 2.5rem 3rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 0 60px rgba(245, 158, 11, 0.15);
          transition: border-color 0.4s ease;
        }
        .digital-brain-ui .cta-panel:hover {
          border-color: rgba(245, 158, 11, 0.6);
        }
        .digital-brain-ui .label {
          color: rgba(251, 191, 36, 0.85);
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          margin: 0 0 0.8rem 0;
        }
        .digital-brain-ui h3 {
          font-family: 'Anton', sans-serif;
          letter-spacing: 0.04em;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          color: #f1e9da;
          margin: 0 0 1.8rem 0;
        }
        .digital-brain-ui .begin-btn {
          padding: 0.85rem 2.2rem;
          border: 1px solid #f59e0b;
          color: #fbbf24;
          background: transparent;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 4px;
        }
        .digital-brain-ui .begin-btn:hover {
          background: #f59e0b;
          color: #000;
        }
        .digital-brain-ui .legend-dot {
          width: 1.7rem;
          height: 1.7rem;
          border-radius: 50%;
          border: 1px solid rgba(245, 158, 11, 0.3);
          transition: all 0.4s ease;
        }
        .digital-brain-ui .legend-dot.active {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.25);
          box-shadow: 0 0 14px rgba(245, 158, 11, 0.5);
        }
        .digital-brain-ui .restart-btn {
          position: absolute;
          bottom: 3rem;
          right: 1.5rem;
          pointer-events: auto;
          padding: 0.6rem 1.3rem;
          border: 1px solid rgba(245, 158, 11, 0.4);
          color: #fbbf24;
          background: rgba(0, 0, 0, 0.45);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .digital-brain-ui .restart-btn:hover {
          background: rgba(245, 158, 11, 0.15);
          border-color: #f59e0b;
        }
        .digital-brain-ui .restart-btn svg {
          width: 13px;
          height: 13px;
          transition: transform 0.4s ease;
        }
        .digital-brain-ui .restart-btn:hover svg {
          transform: rotate(-160deg);
        }
        @media (max-width: 640px) {
          .digital-brain-ui .cta-panel { padding: 2rem 1.6rem; }
          .digital-brain-ui .top-left { max-width: 220px; }
        }
      `}</style>

      {/* Three.js Canvas Container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 z-0" 
      />

      {/* Overlay UI */}
      <div className="digital-brain-ui absolute inset-0 z-10 flex flex-col justify-between py-12 px-6 pointer-events-none">
        
        {/* Top left text */}
        <div className="top-left">
          <p className="eyebrow">THREE.JS INTERACTIVE COMPONENT</p>
          <h2>DIGITAL BRAIN</h2>
          <p>
            Thousands of particles form a digital brain, pulse with life, dissolve into the void, and reform again.
          </p>
        </div>

        {/* Center CTA */}
        <AnimatePresence>
          {!isStarted && (
            <motion.div
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 0.7 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            >
              <div className="cta-panel">
                <p className="label">WANT TO EXPLORE</p>
                <h3>SOMETHING CRAZY?</h3>
                <button
                  onClick={handleStart}
                  className="begin-btn"
                >
                  CLICK TO BEGIN
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Left Legend */}
        <div className="flex gap-4 sm:gap-8 text-[rgba(245,158,11,0.6)]">
          <div className="flex flex-col items-center gap-2">
             <div className={`legend-dot ${sceneState === 'IDLE' ? 'active' : ''}`} />
             <span className="text-[0.6rem] uppercase tracking-[0.1em] whitespace-nowrap">Particles</span>
          </div>
          <div className="flex flex-col items-center gap-2">
             <div className={`legend-dot ${sceneState === 'FORMING' ? 'active' : ''}`} />
             <span className="text-[0.6rem] uppercase tracking-[0.1em] whitespace-nowrap">Brain Form</span>
          </div>
          <div className="flex flex-col items-center gap-2">
             <div className={`legend-dot ${sceneState === 'PULSING' ? 'active' : ''}`} />
             <span className="text-[0.6rem] uppercase tracking-[0.1em] whitespace-nowrap">Pulse</span>
          </div>
          <div className="flex flex-col items-center gap-2">
             <div className={`legend-dot ${sceneState === 'DISSOLVING' ? 'active' : ''}`} />
             <span className="text-[0.6rem] uppercase tracking-[0.1em] whitespace-nowrap">Dissolve</span>
          </div>
        </div>
        
        {/* Top Right Current State text */}
        <div className="top-right">
          {sceneState} STATE
          <span className="particle-count">{particleCount.toLocaleString()} PARTICLES</span>
        </div>

        {/* Restart Button */}
        <AnimatePresence>
          {isStarted && (
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.4 }}
              onClick={handleRestart}
              className="restart-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
              RESTART
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DigitalBrain;
