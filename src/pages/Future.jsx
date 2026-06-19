import React from "react";
import { motion } from "framer-motion";

const Future = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6">

        {/* Animated Background Glow */}
        <div className="absolute w-[500px] h-[500px] bg-orange-500/20 blur-3xl rounded-full animate-pulse"></div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-8xl font-bold z-10"
        >
          The Future Begins Here
        </motion.h1>

        {/* Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-6 text-lg md:text-2xl text-gray-300 max-w-2xl z-10"
        >
          Building immersive digital experiences with React and modern animations.
        </motion.p>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-8 py-4 bg-orange-500 rounded-full text-lg font-semibold shadow-lg hover:bg-orange-400 transition z-10"
        >
          Explore More
        </motion.button>
      </section>

      {/* Feature Cards */}
      <section className="grid md:grid-cols-3 gap-8 px-10 pb-24">

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
            className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-xl"
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
