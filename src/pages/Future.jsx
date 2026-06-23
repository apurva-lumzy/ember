import React from "react";
import { motion } from "framer-motion";
import Lightfall from "../components/Lightfall";

const Future = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* Lightfall Background */}
      <div className="absolute inset-0 z-0">
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

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 z-10">

        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-8xl font-bold"
        >
          The Future Begins Here
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-6 text-lg md:text-2xl text-gray-300 max-w-2xl"
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

      {/* Feature Cards */}
      <section className="relative z-10 grid md:grid-cols-3 gap-8 px-10 pb-24">

        {[
          "AI Powered",
          "Modern UI",
          "Fast Performance",
        ].map((item, index) => (

          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="bg-zinc-900/80 backdrop-blur-md p-8 rounded-2xl border border-zinc-800 shadow-xl"
          >

            <h2 className="text-2xl font-bold text-orange-400">
              {item}
            </h2>

            <p className="mt-4 text-gray-400">
              Experience futuristic design with smooth animations and
              interactive UI.
            </p>

          </motion.div>

        ))}
      </section>
    </div>
  );
};

export default Future;