import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SHAPES = {
  heart: {
    color: '#ff5e7e', // Neon Rose / Pulse
    name: 'Heart / Emotion',
    dots: [
      [1, 6], [1, 7], [1, 8], [1, 11], [1, 12], [1, 13],
      [2, 5], [2, 6], [2, 7], [2, 8], [2, 9], [2, 10], [2, 11], [2, 12], [2, 13], [2, 14],
      [3, 5], [3, 6], [3, 7], [3, 8], [3, 9], [3, 10], [3, 11], [3, 12], [3, 13], [3, 14],
      [4, 5], [4, 6], [4, 7], [4, 8], [4, 9], [4, 10], [4, 11], [4, 12], [4, 13], [4, 14],
      [5, 6], [5, 7], [5, 8], [5, 9], [5, 10], [5, 11], [5, 12], [5, 13],
      [6, 7], [6, 8], [6, 9], [6, 10], [6, 11], [6, 12],
      [7, 8], [7, 9], [7, 10], [7, 11],
      [8, 9], [8, 10]
    ]
  },
  house: {
    color: '#38bdf8', // Neon Cyan / Origin
    name: 'House / Home',
    dots: [
      [1, 9], [1, 11], [1, 12],
      [2, 8], [2, 9], [2, 10], [2, 11], [2, 12],
      [3, 7], [3, 8], [3, 9], [3, 10], [3, 11], [3, 12],
      [4, 6], [4, 7], [4, 8], [4, 9], [4, 10], [4, 11], [4, 12],
      [5, 5], [5, 6], [5, 7], [5, 8], [5, 9], [5, 10], [5, 11], [5, 12], [5, 13],
      [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
      [7, 5], [7, 6], [7, 7], [7, 11], [7, 12], [7, 13],
      [8, 5], [8, 6], [8, 7], [8, 11], [8, 12], [8, 13],
      [9, 5], [9, 6], [9, 7], [9, 11], [9, 12], [9, 13]
    ]
  },
  one: {
    color: '#fbbf24', // Neon Gold / Step 1
    name: 'Step 1',
    dots: [
      [0, 9], [0, 10],
      [1, 8], [1, 9], [1, 10],
      [2, 9], [2, 10],
      [3, 9], [3, 10],
      [4, 9], [4, 10],
      [5, 9], [5, 10],
      [6, 9], [6, 10],
      [7, 9], [7, 10],
      [8, 9], [8, 10],
      [9, 9], [9, 10]
    ]
  },
  two: {
    color: '#fbbf24', // Neon Gold / Step 2
    name: 'Step 2',
    dots: [
      [0, 7], [0, 8], [0, 9], [0, 10], [0, 11],
      [1, 7], [1, 8], [1, 9], [1, 10], [1, 11], [1, 12],
      [2, 11], [2, 12],
      [3, 11], [3, 12],
      [4, 8], [4, 9], [4, 10], [4, 11], [4, 12],
      [5, 7], [5, 8], [5, 9], [5, 10], [5, 11],
      [6, 7], [6, 8],
      [7, 7], [7, 8],
      [8, 7], [8, 8], [8, 9], [8, 10], [8, 11], [8, 12],
      [9, 7], [9, 8], [9, 9], [9, 10], [9, 11], [9, 12]
    ]
  },
  three: {
    color: '#fbbf24', // Neon Gold / Step 3
    name: 'Step 3',
    dots: [
      [0, 7], [0, 8], [0, 9], [0, 10], [0, 11],
      [1, 7], [1, 8], [1, 9], [1, 10], [1, 11], [1, 12],
      [2, 11], [2, 12],
      [3, 11], [3, 12],
      [4, 7], [4, 8], [4, 9], [4, 10], [4, 11], [4, 12],
      [5, 7], [5, 8], [5, 9], [5, 10], [5, 11], [5, 12],
      [6, 11], [6, 12],
      [7, 11], [7, 12],
      [8, 7], [8, 8], [8, 9], [8, 10], [8, 11], [8, 12],
      [9, 7], [9, 8], [9, 9], [9, 10], [9, 11]
    ]
  }
};

const shapeKeys = Object.keys(SHAPES);

const shapeLookups = {};
shapeKeys.forEach(key => {
  shapeLookups[key] = new Set(SHAPES[key].dots.map(([r, c]) => `${r},${c}`));
});

// Grid configuration
const ROWS_COUNT = 10;
const COLS_COUNT = 20;
const gridDots = [];
for (let r = 0; r < ROWS_COUNT; r++) {
  for (let c = 0; c < COLS_COUNT; c++) {
    const cx = 219.5 + c * 19;
    const cy = 214.5 + r * 19;
    gridDots.push({ r, c, cx, cy });
  }
}

export default function ShapeOfAttention() {
  const [activeShape, setActiveShape] = useState('heart');
  const [isPlaying, setIsPlaying] = useState(true);
  const autoPlayTimer = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      autoPlayTimer.current = setInterval(() => {
        setActiveShape(current => {
          const nextIdx = (shapeKeys.indexOf(current) + 1) % shapeKeys.length;
          return shapeKeys[nextIdx];
        });
      }, 1000);
    } else {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    }

    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isPlaying]);

  const activeColor = SHAPES[activeShape].color;
  const currentLookup = shapeLookups[activeShape];

  return (
    <div className="relative w-full max-w-2xl mx-auto p-6 md:p-8 bg-zinc-950/25 border border-white/10 backdrop-blur-xl rounded-2xl flex flex-col items-center gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)] group select-none animate-[scaleUp_0.8s_ease]">

      {/* Top Meta info */}
      <div className="w-full flex justify-between items-center text-zinc-500 font-mono text-[10px] sm:text-[11px] border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>ATTENTION MATRIX V1.0</span>
        </div>
        <div className="uppercase tracking-widest text-zinc-400">
          SHAPE: <span style={{ color: activeColor }} className="font-bold transition-colors duration-500">{SHAPES[activeShape].name}</span>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-zinc-950/20 rounded-xl overflow-hidden border border-white/5 p-2">
        <svg
          viewBox="180 180 440 240"
          className="w-full h-full object-contain"
          xmlns="http://www.w3.org/2000/svg"
        >


          {/* Render dot matrix */}
          {gridDots.map((dot, index) => {
            const key = `${dot.r},${dot.c}`;
            const isActive = currentLookup.has(key);



            return (
              <motion.circle
                key={index}
                cx={dot.cx}
                cy={dot.cy}
                initial={false}
                animate={{
                  r: isActive ? 6.5 : 2.5,
                  fill: isActive ? activeColor : 'rgba(241, 233, 218, 0.12)',
                  opacity: isActive ? 1.0 : 0.45,
                }}
                style={{
                  cursor: 'pointer'
                }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 24,
                  // Diagonal staggered sweep transition based on grid coordinate index
                  delay: (dot.c + dot.r) * 0.012,
                }}
              />
            );
          })}
        </svg>

        {/* Ambient background accent glow */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none opacity-20 blur-3xl transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle at center, ${activeColor} 0%, transparent 60%)`
          }}
        />
      </div>

      {/* Control Panel */}
      <div className="w-full flex items-center justify-between gap-3 mt-2 bg-[#0a0806]/60 p-1.5 rounded-full border border-amber-500/20">
        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-full border border-white/5 bg-zinc-950/80 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center justify-center aspect-square"
          title={isPlaying ? "Pause Autoplay" : "Start Autoplay"}
        >
          {isPlaying ? (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        {/* Shape Selectors */}
        <div className="flex-grow flex items-center bg-zinc-950/40 rounded-full p-0.5 border border-white/5 overflow-hidden">
          {shapeKeys.map(key => {
            const isSelected = activeShape === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveShape(key);
                  setIsPlaying(false); // Stop playing when manually selecting
                }}
                className={`flex-1 py-1.5 text-center font-mono text-[9px] sm:text-xs tracking-[0.18em] sm:tracking-[0.25em] transition-all duration-300 relative cursor-pointer uppercase ${isSelected ? 'text-[#f1e9da] font-bold' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  <span className="hidden sm:inline">{SHAPES[key].name.split(' / ')[0]}</span>
                  <span className="inline sm:hidden">
                    {key === 'heart' && (
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    )}
                    {key === 'house' && (
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                      </svg>
                    )}
                    {key === 'one' && '01'}
                    {key === 'two' && '02'}
                    {key === 'three' && '03'}
                  </span>
                </span>
                {isSelected && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 rounded-full -z-0"
                    style={{
                      backgroundColor: `${activeColor}12`,
                      border: `1px solid ${activeColor}35`
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
