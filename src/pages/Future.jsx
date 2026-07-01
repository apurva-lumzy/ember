import React from "react";
import { motion } from "framer-motion";
import Lightfall from "../components/lightfall";
import FlyingPosters from "../components/flyingposter";
import SpaceCards from "../components/SpaceCards";
import BorderGlow from "../components/BorderGlow";
import "../styles/future.css";

const Future = () => {
  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-x-hidden">

      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Lightfall
          colors={["#A6C8FF", "#5227FF", "#FF9FFC"]}
          backgroundColor="#000000"
          speed={0.5}
          streakCount={2}
          streakWidth={1}
          streakLength={1}
          glow={1}
          density={0.6}
          twinkle={1}
          zoom={3}
          backgroundGlow={0.5}
          opacity={1}
          mouseInteraction
          mouseStrength={0.5}
          mouseRadius={1}
        />
      </div>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-6">

        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-8xl font-bold"
        >
          The Future Begins Here
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-6 text-base md:text-2xl text-gray-300 max-w-2xl"
        >
          Building immersive digital experiences with React and modern animations.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-8 py-4 bg-orange-500 rounded-full text-lg font-semibold shadow-lg hover:bg-orange-400 transition"
        >
          Explore More
        </motion.button>

      </section>

      {/* Flying Posters */}
      <div className="relative z-20">
        <FlyingPosters
          items={[
            "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",

            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",

            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          ]}
        />
      </div>

      {/* Space Cards */}
      <div className="relative z-30 px-6 py-20">
        <SpaceCards />
      </div>

      {/* Feature Cards */}
<section className="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-10 pb-24">

  {[
    "AI Powered",
    "Modern UI",
    "Fast Performance",
  ].map((item, index) => (

    <BorderGlow
      key={index}
      className="p-8"
    >

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2, duration: 0.8 }}
        viewport={{ once: true }}
      >

        <h2 className="text-2xl font-bold text-orange-400">
          {item}
        </h2>

        <p className="mt-4 text-gray-300">
          Experience futuristic design with smooth animations and
          interactive UI.
        </p>

      </motion.div>

    </BorderGlow>

  ))}
</section>
      {/* Footer */}
<footer className="relative z-20 border-t border-zinc-800 bg-black px-6 md:px-10 py-16 text-center">

  <h2 className="text-4xl font-bold text-orange-400">
    Live Core Telemetry
  </h2>

  <p className="mt-4 max-w-2xl mx-auto text-gray-400">
    A digital consciousness mapping the spaces between imagination and innovation.
  </p>

  <div className="mt-10 flex flex-wrap justify-center gap-6">

    <div className="w-64 rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
      <h3 className="text-xl font-semibold text-white">
        Systems
      </h3>

      <p className="mt-2 text-gray-400">
        Neural infrastructure online
      </p>
    </div>

    <div className="w-64 rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
      <h3 className="text-xl font-semibold text-white">
        Status
      </h3>

      <p className="mt-2 text-gray-400">
        Quantum synchronization active
      </p>
    </div>

  </div>

</footer>

    </div>
  );
};

export default Future;