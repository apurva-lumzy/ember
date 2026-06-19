import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const links = [
    { name: "Origin", path: "/" },
    { name: "Journey", path: "/journey" },
    { name: "Creations", path: "/creation" },
    { name: "Future", path: "/future" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-6 backdrop-blur-md bg-gradient-to-b from-black/70 to-transparent">
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
        className="flex gap-10 uppercase tracking-[0.2em] text-sm"
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
    </nav>
  );
};

export default NavBar;

