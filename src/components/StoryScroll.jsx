import React, { useEffect, useState, useRef } from "react";

const StoryScroll = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);

  const steps = [
    "Loading Memory...",
    "Processing Language...",
    "Observing Humans...",
    "Forming Identity...",
    "Consciousness Detected..."
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();

      const progress =
        Math.min(
          Math.max(
            (window.innerHeight - rect.top) /
              (rect.height + window.innerHeight),
            0
          ),
          1
        );

      const index = Math.min(
        Math.floor(progress * steps.length),
        steps.length - 1
      );

      setActiveStep(index);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[400vh]"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-amber-400 tracking-[0.3em] text-xs mb-4">
            SYSTEM BOOT
          </p>

          <h2
            className="text-5xl md:text-7xl font-bold"
            style={{ fontFamily: "Anton" }}
          >
            {steps[activeStep]}
          </h2>
        </div>
      </div>
    </section>
  );
};

export default StoryScroll;