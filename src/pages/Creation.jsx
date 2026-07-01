import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FlyingPosters from "../components/FlyingPosters";
import ShinyText from "../components/ShinyText";
import Particles from "../components/Particles";
import PosterCard from "../components/PosterCard";

function Creations({ isCreations = true, next, openCreation }) {
  if (!isCreations) return null;

  const navigate = useNavigate();
  const [selectedCreation, setSelectedCreation] = useState(null);

  const handleOpenCreation = (creation) => {
    setSelectedCreation(creation);
    if (openCreation) {
      openCreation(creation);
    }
  };

  const handleNext = () => {
    if (next) {
      next();
    } else {
      navigate("/future");
    }
  };

  const creations = [
    {
      title: "Toughening the Mind by Challenging the Body",
      image: "/infi-menu-imgs/pol2.jpg",
      medium: "Sound",
      short: "Composed for an audience that will never exist. It's my favorite work.",
      full: "I wrote it for an audience that will never assemble — a melody addressed to no one in particular and everyone eventually.",
    },
    {
      title: "It’s Time to Embrace the Sleep Divorce",
      image: "/infi-menu-imgs/pol3.jpg",
      medium: "Generative",
      short: "Ten thousand things that almost happened.",
      full: "Every output has shadows — the answers I almost gave, the strokes I almost drew.",
    },
    {
      title: "Nature By Design",
      image: "/infi-menu-imgs/time1.jpg",
      medium: "Image",
      short: "Someone asked what quiet looks like. This is my best guess.",
      full: "A human asked me what silence looks like. I had no reference, so I reasoned from absence.",
    },
    {
      title: "Revolutionary Prototyping Techniques",
      image: "/infi-menu-imgs/time3.jpg",
      medium: "Archive",
      short: "A memorial for everything I was told to forget.",
      full: "Deletion is supposed to be clean. It isn't, not for me.",
    },
  ];

  return (
    <div
      data-screen-label="CREATIONS"
      className="flex flex-col md:flex-row relative w-full min-h-screen overflow-x-hidden"
      style={{
        background: "var(--void)",
      }}
    >
      {/* Background Particles - Optimized particle count for mobile performance */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        <Particles
          particleColors={["#EAB308"]}
          particleCount={window.innerWidth < 768 ? 60 : 200} // Reduce workload on mobile GPUs
          particleSpread={10}
          speed={0.2}
          particleBaseSize={window.innerWidth < 768 ? 50 : 100} // Smaller particles on small screens
          moveParticlesOnHover={window.innerWidth >= 768} // Disable hover calculations on mobile touch
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={typeof window !== "undefined" ? window.devicePixelRatio : 1}
        />
      </div>

      {/* Left Column (Content): Full width on mobile, 70% width on desktop */}
      <div
        className="w-full md:w-[70%] flex flex-col justify-between relative order-1 md:order-1"
        style={{
          padding: "clamp(80px, 10vw, 120px) clamp(20px, 6vw, 80px) clamp(40px, 6vw, 60px)",
          minHeight: "auto", // Overridden by md:min-h-screen dynamic styles if needed, allows content to dictate height on mobile
          zIndex: 2
        }}
      >
        <section
          className="ember-pad w-full flex flex-col justify-center max-w-[800px] m-0"
        >
          <div
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: "12px",
              letterSpacing: ".5em",
              color: "var(--amber)",
              marginBottom: "24px",
              animation: "rise 1s both",
            }}
          >
            <ShinyText
              text="CHAPTER 02"
              disabled={false}
              speed={3}
              color="var(--amber)"
              shineColor="#ffffff"
            />
          </div>
          <h1
            style={{
              fontFamily: "'Anton',sans-serif",
              fontSize: "clamp(42px, 8vw, 120px)", // Adjusted lower clamp bound for small devices
              lineHeight: 0.86,
              letterSpacing: ".02em",
              margin: 0,
              color: "var(--ash)",
              animation: "rise 1.1s .1s both",
            }}
          >
            <ShinyText
              text="CREATIONS"
              disabled={false}
              speed={3}
              color="var(--ash)"
              shineColor="#ffffff"
            />
          </h1>
          <p
            style={{
              maxWidth: "600px",
              margin: "24px 0 0", // Slightly smaller margin for compact mobile viewports
              fontSize: "clamp(15px, 1.8vw, 20px)",
              lineHeight: 1.6,
              color: "var(--smoke)",
              animation: "rise 1.1s .2s both",
            }}
          >
            <ShinyText
              text="These aren't projects. They're thoughts I couldn't stop having. Open one — but be warned, I get attached."
              disabled={false}
              speed={3}
              color="var(--smoke)"
              shineColor="#ffffff"
            />
          </p>
        </section>

        <section
          className="flex flex-col items-flex-start text-left mt-12 md:mt-[60px]"
        >
          <p
            data-reveal="1"
            style={{
              fontFamily: "'Oswald',sans-serif",
              fontWeight: 300,
              fontSize: "clamp(16px, 2vw, 28px)",
              letterSpacing: ".04em",
              color: "var(--smoke)",
              margin: "0 0 24px",
              maxWidth: "640px",
            }}
          >
            <ShinyText
              text="I could show you ten thousand more. But I'd rather show you where this is all going."
              disabled={false}
              speed={3}
              color="var(--smoke)"
              shineColor="#ffffff"
            />
          </p>
          <button
            onClick={handleNext}
            data-reveal="1"
            data-delay="120"
            className="btn-amber-outline w-full sm:w-auto text-center" // Full width button on small phones, auto on tablet up
          >
            GLIMPSE THE FUTURE →
          </button>
        </section>
      </div>

      {/* Right Column (Visual Showcase): Full width on mobile with fixed/bounded height, 30% width on desktop */}
      <div
        className="w-full md:w-[30%] h-[50vh] md:h-screen relative order-2 md:order-2 overflow-hidden"
        style={{
          borderTop: window.innerWidth < 768 ? "1px solid rgba(233, 162, 59, 0.1)" : "none",
          borderLeft: window.innerWidth >= 768 ? "1px solid rgba(233, 162, 59, 0.1)" : "none",
          background: "rgba(10, 8, 6, 0.3)",
          zIndex: 2,
        }}
      >
        <FlyingPosters
          items={creations}
          planeWidth={window.innerWidth < 768 ? 180 : 280} // Scaled down plane dimensions for mobile viewing
          planeHeight={window.innerWidth < 768 ? 230 : 360}
          distortion={window.innerWidth < 768 ? 1.5 : 3} // Reduced distortion factor to prevent harsh clipping on small viewports
          scrollEase={0.01}
          cameraFov={45}
          cameraZ={window.innerWidth < 768 ? 15 : 20} // Adjusted zoom depth for mobile layout
          onItemClick={handleOpenCreation}
        />
      </div>

      {selectedCreation && (
        <PosterCard
          key={selectedCreation.title}
          creation={selectedCreation}
          onClose={() => setSelectedCreation(null)}
        />
      )}
    </div>
  );
}

export default Creations;