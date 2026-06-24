import React from "react";
import { NavLink } from "react-router-dom";
import { motion, useScroll, useSpring } from "motion/react";
import BubbleMenu from "./BubbleMenu";

const NavBar = () => {
  const links = [
    { name: "Origin", path: "/" },
    { name: "Journey", path: "/journey" },
    { name: "Creations", path: "/creation" },
    { name: "Future", path: "/future" },
  ];

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const items = [
    {
      label: "ORIGIN",
      href: "/",
      ariaLabel: "Home",
      rotation: -8,
      hoverStyles: {
        bgColor: "#e9a23b",
        textColor: "#0a0a0a",
      },
    },
    {
      label: "JOURNEY",
      href: "/journey",
      ariaLabel: "Journey",
      rotation: 8,
      hoverStyles: {
        bgColor: "#e9a23b",
        textColor: "#0a0a0a",
      },
    },
    {
      label: "CREATIONS",
      href: "/creation",
      ariaLabel: "Creations",
      rotation: 8,
      hoverStyles: {
        bgColor: "#e9a23b",
        textColor: "#0a0a0a",
      },
    },
    {
      label: "FUTURE",
      href: "/future",
      ariaLabel: "Future",
      rotation: 8,
      hoverStyles: {
        bgColor: "#e9a23b",
        textColor: "#0a0a0a",
      },
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 backdrop-blur-md bg-gradient-to-b from-black/70 to-transparent">
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-amber-400 origin-left shadow-[0_0_10px_rgba(233,162,59,0.8)]"
        style={{ scaleX, width: "100%" }}
      />

      <div className="flex items-center gap-3 cursor-pointer">
        <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse shadow-[0_0_20px_#e9a23b]" />
        <span
          style={{ fontFamily: "Anton" }}
          className="text-xl tracking-[0.5em] text-[#f1e9da]"
        >
          EMBER
        </span>
      </div>

      <div
        style={{ fontFamily: "Oswald" }}
        className="flex gap-6 md:gap-10 uppercase tracking-[0.2em] text-sm max-sm:hidden"
      >
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `cursor-pointer transition-all duration-500 hover:text-amber-400 ${
                isActive
                  ? "text-amber-400 border-b border-amber-400 transition-all duration-500"
                  : "text-white"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      <BubbleMenu
        logo={<span style={{ fontWeight: 700 }}>RB</span>}
        items={items}
        menuAriaLabel="Toggle navigation"
        menuBg="#111111"
        menuContentColor="#f1e9da"
        useFixedPosition={false}
        animationEase="back.out(1.5)"
        animationDuration={0.5}
        staggerDelay={0.12}
        className={"sm:hidden "}
      />
    </nav>
  );
};

export default NavBar;
