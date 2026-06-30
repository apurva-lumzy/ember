"use client";

import React from "react";
import { motion } from "framer-motion";
import PerspectiveCarousel from "./PerspectiveCarousel";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ProjectGallery = ({
  title,
  subtitle,
  desc,
  media,
  onMediaClick,
  bgVideo,
}) => {
  const sectionRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          once: true,
          onEnter: () => videoRef.current?.play().catch(() => { }),
        }
      });

      if (bgVideo) {
        tl.fromTo(".gallery-bg-video", { opacity: 0, scale: 1.1 }, { opacity: 0.35, scale: 1, duration: 1.8 });
      }

      tl.fromTo(".gallery-copy > *", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, "-=0.6");
      tl.fromTo(".desc-box", { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1 }, "-=0.5");
      tl.fromTo(".perspective-container", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.1 }, "-=0.7");
    }, sectionRef);

    return () => ctx.revert();
  }, [bgVideo]);

  const current = media[activeIndex] || {};
  console.log(current);

  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-screen py-20 sm:py-28 px-4 sm:px-6 overflow-hidden bg-black"
    >
      {bgVideo && (
        <video
          ref={videoRef}
          src={bgVideo}
          className="gallery-bg-video absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
          muted loop playsInline preload="auto"
        />
      )}

      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(245,158,11,0.12),transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="gallery-copy max-w-3xl mx-auto text-center mb-16">
          <p className="text-amber-400 tracking-widest text-sm uppercase mb-3">{subtitle}</p>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white" style={{ fontFamily: "Oswald" }}>
            {title}
          </h2>
          <p className="mt-5 text-zinc-400 text-lg">{desc}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          {/* Left Side - Description */}
          <motion.div className="desc-box lg:sticky lg:top-28 w-full lg:w-5/12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px w-10 bg-amber-500" />
                <span className="text-amber-400 text-sm uppercase tracking-widest font-medium">Featured Memory</span>
              </div>

              <motion.h3
                key={`name-${activeIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white tracking-tighter"
                style={{ fontFamily: "Oswald" }}
              >
                {current.title}
              </motion.h3>

              <motion.div
                key={`info-${activeIndex}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                {current.relation && (
                  <p className="inline-block text-amber-400 text-sm font-medium tracking-wide border-l-2 border-amber-500 pl-3">
                    {current.relation}
                  </p>
                )}
                <p className="text-zinc-300 text-lg leading-relaxed">
                  {current.description || current.desc}
                </p>
              </motion.div>

              {onMediaClick && (
                <button
                  onClick={() => onMediaClick(current, activeIndex, media)}
                  className="mt-6 px-8 py-4 border border-amber-500/40 hover:border-amber-500 rounded-full text-white hover:text-black hover:bg-amber-500 transition-all duration-300 flex items-center gap-3 group"
                >
                  Explore This Memory
                  <span className="group-hover:translate-x-1 transition">→</span>
                </button>
              )}
            </div>
          </motion.div>

          {/* Carousel */}
          <div className="perspective-container w-full lg:w-7/12">
            <PerspectiveCarousel
              items={media.map((item) => ({
                src: item.src,
                title: item.name,
                alt: item.name,
              }))}
              activeIndex={activeIndex}
              onActiveIndexChange={setActiveIndex}
              slideWidth={270}
              className="h-[420px] sm:h-[460px] md:h-[500px] w-full" c
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ProjectGallery;