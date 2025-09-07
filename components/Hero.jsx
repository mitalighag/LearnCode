import React from "react";
import "../styles/Hero.css";
import heroImage from "../assets/Hero.png"; 
import { Link } from "react-router-dom"; 

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Learn to Code, <span className="bold-text">Build Your</span>
          <span className="highlight">Future</span>
        </h1>
        <p>
          Explore a wide range of programming courses and advance your skills
          with expert guidance.
        </p>
        
        <Link to="/signup">
          <button className="cta-button">Get Started</button>
        </Link>
      </div>
      <div className="hero-image">
        <img src={heroImage} alt="Coding Illustration" />
      </div>
    </section>
  );
};

export default Hero;
