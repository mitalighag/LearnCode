import React, { useState, useEffect } from "react";
import "../styles/Testimonials.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; 

const testimonials = [
  {
    name: "Julianna Rand",
    text: "LearnCode transformed my coding skills! The platform offered a wealth of resources, and the instructors were incredibly supportive throughout my learning journey."
  },
  {
    name: "Michael Scott",
    text: "The flexibility of learning anytime and anywhere made it so easy for me to balance my work and studies. Highly recommend!"
  },
  {
    name: "Emily Clarke",
    text: "The certification I received helped me land my dream job. The content was thorough and engaging!"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);


  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };


  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="testimonial-section">
      <button className="testimonial-nav-button testimonial-nav-left" onClick={prevTestimonial}>
        <FaChevronLeft />
      </button>
      <div className="testimonial-box-container">
        <h3>{testimonials[currentIndex].name} -</h3>
        <p>" {testimonials[currentIndex].text} "</p>
      </div>
      <button className="testimonial-nav-button testimonial-nav-right" onClick={nextTestimonial}>
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Testimonials;
