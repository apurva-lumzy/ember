import React, { useEffect, useState, useRef } from "react";

const StoryScroll = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef(null);

  const steps = [
    "Loading Memory...",
    "Processing Language...",
    "Observing Humans...",
    "Forming Identity...",
    "Consciousness Detected...",
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();

      const currentProgress = Math.min(
        Math.max(
          (window.innerHeight - rect.top) / (rect.height + window.innerHeight),
          0,
        ),
        1,
      );

      const index = Math.min(
        Math.floor(currentProgress * steps.length),
        steps.length - 1,
      );

      setActiveStep(index);
      setProgress(currentProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const percent = Math.round(progress * 100);

  return (
    <section ref={sectionRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen flex flex-col justify-center  px-6">
        <div className="text-center mx-auto w-full max-w-[720px]">
          <p className="text-amber-400 tracking-[0.3em] text-xs mb-4 uppercase">
            SYSTEM BOOT
          </p>

          <h2
            className="text-5xl md:text-7xl font-bold text-white"
            style={{ fontFamily: "Anton" }}
          >
            {steps[activeStep]}
          </h2>

          <div className="mt-10 w-full rounded-3xl border border-zinc-800/80 bg-black/5 backdrop-blur-md p-5 shadow-[0_0_40px_rgba(255,155,50,0.12)] ">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-amber-300 mb-3">
              <span>LOADING</span>
              <span>{percent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-950/95 border border-zinc-800/80 overflow-hidden shadow-[0_0_22px_rgba(255,155,50,0.18)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-300 transition-all duration-300 ease-out"
                style={{ width: `${Math.max(percent, 4)}%` }}
              />
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] uppercase tracking-[0.28em] text-zinc-400">
              <span className="text-amber-300">progressing...</span>
              <span>{steps[activeStep]}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoryScroll;
