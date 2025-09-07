import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ userType = "guest" }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate(userType === "instructor" ? "/instructor-landing" : "/landing");
  };

  return (
    <nav className="navbar">
      <div className="logo">LearnCode</div>

      <ul className={menuOpen ? "nav-links open" : "nav-links"}>
        <li><Link to={userType === "instructor" ? "/instructor-landing" : "/landing"}>Home</Link></li>
        {userType === "instructor" ? (
          <>
            <li><a href="#why-teach">Features</a></li>
            <li><Link to="/landing">Student</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/instructor-landing">Instructor</Link></li>
            <li><Link to="/about">About</Link></li>
          </>
        )}
        <li><Link to="/contact">Contact</Link></li>
        {isLoggedIn && (
          <li>
            <Link to={userType === "instructor" ? "/dashboard" : "/student-dashboard"}>
              Dashboard
            </Link>
          </li>
        )}
      </ul>

      <div className="auth-buttons">
        {!isLoggedIn ? (
          <>
            <Link to="/login"><button className="login-btn">Login</button></Link>
            <Link to={`/signup?role=${userType}`}><button className="signup-btn">Sign Up</button></Link>
          </>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        )}
      </div>

      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</div>
    </nav>
  );
};

export default Navbar;
