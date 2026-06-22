import React from "react";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h4 className="sub-text">YOUR FUTURE STARTS HERE</h4>

        <h1 className="title">
          Build Your Future <br /> With Confidence
        </h1>

        <p className="desc">
          Learn, create, and grow step by step. Every small effort today builds
          a better tomorrow.
        </p>

        <div className="buttons">
          <button className="btn primary">Get Started</button>
          <button className="btn outline">Explore</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;