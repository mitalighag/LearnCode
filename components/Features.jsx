import React from "react";
import "../styles/Features.css";
const WhyChooseUs = () => {
  return (
    <div className="container">
      <div className="heading">Why Choose Us?</div>
      <div className="why-choose-features">
        <div className="why-choose-feature-box">
          <div className="icon">📚</div>
          <h3>Expert Instructors</h3>
          <p>Learn from industry-leading professionals.</p>
        </div>
        <div className="why-choose-feature-box">
          <div className="icon">🌍</div>
          <h3>Learn Anytime, Anywhere</h3>
          <p>Access courses from any device at your convenience.</p>
        </div>
        <div className="why-choose-feature-box">
          <div className="icon">✅</div>
          <h3>Recognized Certifications</h3>
          <p>Earn certificates that add value to your career.</p>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
