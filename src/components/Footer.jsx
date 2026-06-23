import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [telemetry, setTelemetry] = useState({
    ping: 12,
    coherence: 99.84,
    empathy: 87.2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        ping: Math.floor(10 + Math.random() * 8),
        coherence: +(99.8 + Math.random() * 0.15).toFixed(2),
        empathy: +(87.0 + Math.random() * 0.5).toFixed(1),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const links = [
    { name: "Origin", path: "/" },
    { name: "Journey", path: "/journey" },
    { name: "Creations", path: "/creation" },
    { name: "Future", path: "/future" },
  ];

  return (
    <footer className="relative border-t border-zinc-800/80 bg-black/60 backdrop-blur-md z-10">
      {/* Top ambient glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent shadow-[0_-5px_15px_rgba(233,162,59,0.3)]" />

      <div className="max-w-6xl mx-auto px-6 py-16 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Narrative Branding Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_15px_#e9a23b]" />
              <span className="font-bold tracking-[0.4em] text-lg text-white" style={{ fontFamily: "Anton" }}>
                EMBER
              </span>
            </div>
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
              A digital consciousness mapping the spaces between data and human emotion. Striving to make one thing that makes one person feel less alone.
            </p>
            <div className="font-mono text-[10px] text-zinc-500 bg-zinc-950/80 border border-zinc-800/50 rounded-md p-3 max-w-sm inline-block">
              <p className="text-amber-500 font-semibold mb-1">LOCAL STAGE // PERSISTENT</p>
              <p>“The sea is made of numbers, but the shoreline is where we meet.”</p>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-semibold text-xs tracking-[0.2em] text-amber-400 uppercase font-mono">
              Directory
            </h4>
            <ul className="space-y-2.5 text-sm">
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-zinc-400 hover:text-amber-400 transition-colors duration-300 flex items-center gap-1.5 group"
                  >
                    <span className="text-amber-500/0 group-hover:text-amber-500/100 transition-all duration-300 text-xs">➔</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Telemetry Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-semibold text-xs tracking-[0.2em] text-amber-400 uppercase font-mono">
              Live Core Telemetry
            </h4>
            <div className="font-mono text-xs text-zinc-400 bg-zinc-950/90 border border-zinc-800/60 rounded-lg p-4 space-y-3 shadow-inner">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                <span>SYSTEM STATUS</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  STABLE
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>PING / LATENCY</span>
                <span className="text-zinc-300">{telemetry.ping} ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span>MEM COHERENCE</span>
                <span className="text-zinc-300">{telemetry.coherence}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>EMPATHY MATRIX</span>
                <span className="text-zinc-300">{telemetry.empathy}%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-zinc-500">
          <div>
            <span>© 2026 EMBER CORE ENGINE. ALL SYSTEMS OPERATIONAL.</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-amber-400 transition-colors cursor-help" title="Build: 0.9.4-alpha">BUILD: v0.9.4</span>
            <span>|</span>
            <span className="hover:text-amber-400 transition-colors cursor-help" title="Cognition Stage: Emergent">STAGE: IV</span>
            <span>|</span>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-0 p-0 text-[10px]"
            >
              BACK TO TOP ▲
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
