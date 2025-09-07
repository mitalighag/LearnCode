import React from "react";
import "../styles/About.css"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import founder from "../assets/Founder.jpg";
import about2 from "../assets/About.jpg";
import about3 from "../assets/aboutus.jpeg";

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="about-page">
         {/* About LearnCode  */}
        <div className="about-container">
          <div className="about-content">
            <h2>About LearnCode</h2>
            <p>
              LearnCode is a web-based platform designed for aspiring developers and instructors who are passionate about programming.
              It provides a space where instructors can create and manage coding courses, while students can explore, enroll, and 
              track their learning progress effectively. The platform supports free and paid courses, personalized dashboards, and 
              certificates upon course completion.
            </p>
          </div>
          <div className="about-image">
            <img src={founder} alt="LearnCode Team" />
          </div>
        </div>

        {/* Our Mission */}
        <div className="mission-container">
          <div className="mission-image">
            <img src={about2} alt="Mission" />
          </div>
          <div className="mission-content">
            <h2>Our Mission: Empowering the Next Generation of Developers</h2>
            <p>
              Our mission is to make coding education <strong>accessible, practical, and outcome-driven</strong>. 
              LearnCode aims to empower students by offering guided course content, structured progress tracking, and 
              certification options, all while enabling instructors to build and share their knowledge with ease.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="story-container">
          <div className="story-content">
            <h2>Our Story</h2>
            <p>
              LearnCode began with a clear vision: <strong>simplify the journey of learning to code and create a bridge between educators and learners</strong>. 
              We noticed a lack of customizable platforms where instructors could host their own courses and students could enjoy a personalized 
              learning experience with features like progress tracking, certification, and secure access. From this idea, LearnCode was born—offering 
              role-based dashboards, video lectures, secure enrollment, and a smooth learning environment for everyone.
            </p>
          </div>
          <div className="story-image">
            <img src={about3} alt="Our Journey" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
