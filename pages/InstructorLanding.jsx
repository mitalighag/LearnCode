import React from "react";
import { Link } from "react-router-dom";
import {FaCalendarCheck,FaMoneyBillWave,FaChartLine,FaFolderOpen} from "react-icons/fa";
import heroImage from "../assets/instructorhero.jpeg";
import Footer from "../components/Footer";
import "../styles/InstructorLanding.css"; 
import step1 from "../assets/step1.jpg";
import step2 from "../assets/step2.jpg";
import step3 from "../assets/step3.jpg";
import Navbar from "../components/Navbar";
import { useState } from "react";
const InstructorLanding = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      title: "Step 01",
      description: "Sign up as an instructor. Fill out your details and create an account to start teaching.",
      image: step1,
    },
    {
      title: "Step 02",
      description: "Create your course content by uploading videos, PDFs, and quizzes for your students.",
      image: step2,
    },
    {
      title: "Step 03",
      description: "Track your earnings, student progress, and engagement via a personalized dashboard.",
      image: step3,
    },
  ];
  return (
    <div className="instructor-landing">
      <Navbar userType="instructor" />
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>
            Empower Others, <span>Earn More!</span>
          </h1>
          <p>
            Share your knowledge with students worldwide and grow your income on
            your own terms.
          </p>
          <Link to="/signup?role=instructor">
            <button className="cta-button">Start Teaching Today</button>
          </Link>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Instructor Teaching" />
        </div>
      </header>

      {/* Why Teach With Us Section */}
      <section className="why-teach" id="why-teach">
        <div className="why-teach-left">
          <div className="teacher-image">
            <img src={heroImage} alt="Instructor" />
          </div>
        </div>

        <div className="why-teach-right">
          <h2>Why Teach With Us</h2>
          <div className="features-list">
            <div className="feature-box">
              <div className="icon">
                <FaCalendarCheck />
              </div>
              <h3>Teach Anytime Anywhere</h3>
              <p>
              Teach from anywhere in the world at your convenience and reach students globally.
              </p>
            </div>
            <div className="feature-box">
              <div className="icon">
                <FaMoneyBillWave />
              </div>
              <h3>Set your Price and Earn Revenue</h3>
              <p>
              Set your course price and earn passive income from your valuable knowledge.
              </p>
            </div>
            <div className="feature-box">
              <div className="icon">
                <FaChartLine />
              </div>
              <h3>Track Students Progress and Engage</h3>
              <p>
              Monitor student progress, analyze performance, and engage with learners effectively.
              </p>
            </div>
            <div className="feature-box">
              <div className="icon">
                <FaFolderOpen />
              </div>
              <h3>Upload Videos, PDFs, and Quizzes</h3>
              <p>
              Easily upload and manage course materials, including videos, PDFs, and quizzes.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="steps-section">
        <div className="steps-nav">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step-title ${activeStep === index + 1 ? "active" : ""}`}
              onClick={() => setActiveStep(index + 1)}
            >
              <h3>{step.title}</h3>
              <hr className={`step-line ${activeStep === index + 1 ? "active-line" : ""}`} />
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="step-content">
          <div className="step-description">
            <h2>{steps[activeStep - 1].title}</h2>
            <p>{steps[activeStep - 1].description}</p>
          </div>
          <div className="step-image">
            <img src={steps[activeStep - 1].image} alt={`Step ${activeStep}`} />
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default InstructorLanding;

