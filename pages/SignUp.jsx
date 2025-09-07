import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/SignUp.css";

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const defaultRole = queryParams.get("role") || "student";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: defaultRole,
    qualification: "",
    description: "",
    experience: "",
    specialization: "",
    linkedinProfile: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(formData.firstName)) {
      setError("First Name can only contain letters.");
      return;
    }
    if (!nameRegex.test(formData.lastName)) {
      setError("Last Name can only contain letters.");
      return;
    }

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov|co)$/i;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email ending");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.role === "instructor") {
      if (
        !formData.qualification ||
        !formData.description ||
        !formData.experience
      ) {
        setError("Please complete all instructor fields.");
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            minLength={8}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>

          {formData.role === "instructor" && (
            <div>
              <input
                type="text"
                name="qualification"
                placeholder="Your Qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Enter your description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="experience"
                placeholder="Your Experience (e.g., 5 years)"
                value={formData.experience}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="specialization"
                placeholder="Your Specialization (Optional)"
                value={formData.specialization}
                onChange={handleChange}
              />
              <input
                type="url"
                name="linkedinProfile"
                placeholder="LinkedIn Profile URL (Optional)"
                value={formData.linkedinProfile}
                onChange={handleChange}
              />
            </div>
          )}

          {error && <p className="register-error">{error}</p>}
          <button type="submit">Sign Up</button>
        </form>
        <p className="register-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
