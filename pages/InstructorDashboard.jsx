import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/InstructorDashboard.css";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem("name");

  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    enrolledStudents: 0,
    totalEarnings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [recentCourses, setRecentCourses] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const instructorId = localStorage.getItem("userId");

        const statsRes = await axios.get(
          "http://localhost:5000/api/instructor/dashboard-stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDashboardData(statsRes.data);

        
        const coursesRes = await axios.get(
          `http://localhost:5000/api/courses/instructor/${instructorId}/courses`
        );

        const sorted = coursesRes.data.courses
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5); // 

        setRecentCourses(sorted);
      } catch (error) {
        console.error("Failed to load instructor stats or recent courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1>Instructor Panel</h1>
        <nav>
          <Link
            to="/dashboard"
            className={location.pathname === "/dashboard" ? "active" : ""}
            onClick={(e) => {
              if (location.pathname === "/dashboard") e.preventDefault();
            }}
          >
            📊 Dashboard
          </Link>
          <Link
            to="/instructor-my-courses"
            className={
              location.pathname === "/instructor-my-courses" ? "active" : ""
            }
          >
            📚 My Courses
          </Link>
          <Link
            to="/add-course"
            className={location.pathname === "/add-course" ? "active" : ""}
          >
            ➕ Add New Course
          </Link>
          <Link
            to="/instructor-messages-and-support"
            className={
              location.pathname === "/instructor-messages-and-support"
                ? "active"
                : ""
            }
          >
            📩 Messages & Support
          </Link>
          <Link
            to="/update-profile"
            className={
              location.pathname === "/update-profile"
                ? "active"
                : ""
            }
          >
            📝 Update Profile
          </Link>
          <Link to="/instructor-landing">🏠 Home</Link>
          
          <button
            className="logout-button"
            onClick={() => {
              localStorage.clear();
              navigate("/instructor-landing");
            }}
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Dashboard */}
      <main className="main-dashboard">
        <div className="dashboard-header">
          <h2>Welcome, {name}</h2>
          <button onClick={() => navigate("/add-course")}>
            Add New Course
          </button>
        </div>

        {/* Overview Section */}
        <div className="overview">
          <div className="card">
            <h3>Total Courses</h3>
            <p>
              {loading ? <span className="loading">Loading...</span> : dashboardData.totalCourses}
            </p>
          </div>
          <div className="card">
            <h3>Enrolled Students</h3>
            <p>
              {loading ? <span className="loading">Loading...</span> : dashboardData.enrolledStudents}
            </p>
          </div>
        </div>

        {/* Recent Courses Table */}
        <div className="dashboard-table">
          <h3>Recent Courses</h3>
          {recentCourses.length === 0 ? (
            <p>No recent courses found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Total Lectures</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentCourses.map((course) => (
                  <tr key={course._id}>
                    <td>{course.title}</td>
                    <td>{course.lectures?.length || 0}</td>
                    <td className={course.isPublished ? "status published" : "status draft"}>
                      {course.isPublished ? "Active" : "Draft"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;

