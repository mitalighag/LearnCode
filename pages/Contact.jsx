import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Contact.css";
import contactImage from "../assets/contact.png";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

 
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.(com|in|org|net)$/i.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      alert("❗ Please enter a valid email address.");
      return;
    }

    try {
      await fetch("https://sheetdb.io/api/v1/ivjs1o2am4ypa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: formData }),
      });

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("Failed to send message.");
    }
  };

  return (
    <div className="contact-page">
      <Navbar />
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-image">
            <img src={contactImage} alt="Contact Us" />
          </div>

          <div className="contact-form">
            <h2>GET IN TOUCH</h2>
            <p>We'd love to hear from you and help you on your journey.</p>

            <div className="contact-info">
              <span>📧 support@learnCode.com</span>
              <span>📞 +1-202-555-0127</span>
            </div>

            {submitted ? (
              <p className="success-message">✅ Message sent successfully!</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your name here"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />

                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Your email here"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />

                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  placeholder="Your message here"
                  required
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>

                <button type="submit">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
