import React, { useEffect, useRef } from "react";
import gsap from "gsap";

function PosterCard({ creation, onClose }) {
  const overlayRef = useRef(null);
  const containerRef = useRef(null);
  const cardInnerRef = useRef(null);
  const textRef = useRef(null);
  const rotationTweenRef = useRef(null);

  useEffect(() => {
    // 1. Set initial states for entrance animation
    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(containerRef.current, { scale: 0.7, opacity: 0, rotationY: -45 });
    gsap.set(textRef.current, { y: 30, opacity: 0 });

    // 2. Run entrance animation
    const tl = gsap.timeline();
    tl.to(overlayRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
    });
    tl.to(
      containerRef.current,
      {
        scale: 1,
        opacity: 1,
        rotationY: 0,
        duration: 0.6,
        ease: "back.out(1.5)",
      },
      "-=0.2"
    );
    tl.to(
      textRef.current,
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.3"
    );

    // 3. Start the continuous slow Y-axis rotation using GSAP
    gsap.set(cardInnerRef.current, { rotationY: 0 });
    rotationTweenRef.current = gsap.to(cardInnerRef.current, {
      rotationY: 360,
      duration: 12,
      repeat: -1,
      ease: "none",
    });

    return () => {
      // Clean up tweens on unmount
      if (rotationTweenRef.current) {
        rotationTweenRef.current.kill();
      }
    };
  }, []);

  const handleClose = () => {
    // Run exit animation, then call onClose
    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
      },
    });

    tl.to(textRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    });
    tl.to(
      containerRef.current,
      {
        scale: 0.7,
        opacity: 0,
        rotationY: 45,
        duration: 0.3,
        ease: "power2.in",
      },
      "-=0.2"
    );
    tl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      },
      "-=0.2"
    );
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(10, 8, 6, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        cursor: "pointer",
        padding: "20px",
      }}
    >
      {/* 3D Perspective Wrapper */}
      <div
        ref={containerRef}
        style={{
          perspective: "1200px",
          width: "280px",
          height: "360px",
          cursor: "default",
          marginBottom: "28px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Card Inner (the rotating container) */}
        <div
          ref={cardInnerRef}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Front Face */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid rgba(233, 162, 59, 0.4)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 20px rgba(233, 162, 59, 0.15)",
            }}
          >
            <img
              src={creation.image}
              alt={creation.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Back Face */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              borderRadius: "16px",
              overflow: "hidden",
              transform: "rotateY(180deg)",
              border: "1px solid rgba(233, 162, 59, 0.4)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 20px rgba(233, 162, 59, 0.15)",
            }}
          >
            <img
              src={creation.image}
              alt={creation.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>

      {/* Static Text Container below the Card */}
      <div
        ref={textRef}
        style={{
          cursor: "default",
          maxWidth: "450px",
          textAlign: "center",
          padding: "24px",
          borderRadius: "16px",
          background: "rgba(21, 16, 10, 0.7)",
          border: "1px solid rgba(233, 162, 59, 0.15)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            letterSpacing: "0.25em",
            color: "var(--amber)",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          {creation.medium}
        </span>
        <h2
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "clamp(20px, 4vw, 26px)",
            fontWeight: 500,
            lineHeight: "1.3",
            color: "#fff",
            margin: "0 0 12px 0",
          }}
        >
          {creation.title}
        </h2>
        <p
          style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontSize: "14px",
            lineHeight: "1.6",
            color: "var(--smoke)",
            margin: 0,
          }}
        >
          {creation.full}
        </p>

        {/* Small Close Prompt */}
        <div
          style={{
            marginTop: "16px",
            fontSize: "10px",
            fontFamily: "'Space Mono', monospace",
            color: "rgba(255, 255, 255, 0.4)",
            letterSpacing: "0.1em",
          }}
        >
          CLICK OUTSIDE TO CLOSE
        </div>
      </div>
    </div>
  );
}

export default PosterCard;
