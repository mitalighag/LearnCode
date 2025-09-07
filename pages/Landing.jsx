import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Courses from "../components/Courses";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

const Landing = () => {

  return (
    <div>
      <Navbar userType="student" />
      <Hero />
      <Courses />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Landing;
