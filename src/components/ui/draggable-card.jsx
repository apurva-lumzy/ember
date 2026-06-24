"use client";

import React, { useRef, useState, useEffect } from "react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useVelocity,
  useAnimationControls,
} from "framer-motion";

export const DraggableCardBody = ({
  className,
  children,
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const cardRef = useRef(null);

  const controls = useAnimationControls();

  const [constraints, setConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);

  const springConfig = {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  };

  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [25, -25]),
    springConfig
  );

  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-25, 25]),
    springConfig
  );

  const opacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.8, 1, 0.8]),
    springConfig
  );

  useEffect(() => {
    const updateConstraints = () => {
      setConstraints({
        top: -window.innerHeight / 2,
        left: -window.innerWidth / 2,
        right: window.innerWidth / 2,
        bottom: window.innerHeight / 2,
      });
    };

    updateConstraints();

    window.addEventListener("resize", updateConstraints);

    return () => {
      window.removeEventListener("resize", updateConstraints);
    };
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    const { width, height, left, top } =
      cardRef.current?.getBoundingClientRect() ?? {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      };

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    mouseX.set(clientX - centerX);
    mouseY.set(clientY - centerY);
  };

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={constraints}
      style={{
        rotateX,
        rotateY,
        opacity,
      }}
      animate={controls}
      whileHover={{ scale: 1.05 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      className={cn(
        "relative min-h-96 w-80 overflow-hidden rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-6 shadow-2xl",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const DraggableCardContainer = ({
  className,
  children,
}) => {
  return (
    <div className={cn("[perspective:3000px]", className)}>
      {children}
    </div>
  );
};