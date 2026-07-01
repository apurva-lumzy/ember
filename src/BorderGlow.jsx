import React from "react";
import { motion } from "framer-motion";

const BorderGlow = ({
  children,
  className = "",
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`
        relative overflow-hidden rounded-3xl
        border border-white/10
        bg-zinc-900/70
        backdrop-blur-xl
        ${className}
      `}
    >
      {/* Glow Border */}
      <div
        className="
          absolute inset-0 rounded-3xl
          bg-gradient-to-r
          from-orange-500
          via-pink-500
          to-cyan-400
          opacity-30 blur-xl
          animate-pulse
        "
      />

      {/* Inner Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default BorderGlow;