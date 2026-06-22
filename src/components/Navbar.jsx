import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        Ember
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/journey">Journey</Link>
        </li>

        <li>
          <Link to="/future">Future</Link>
        </li>

        <li>
          <Link to="/goals">Goals</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;