import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/StudentMyCourse.css";

const StudentMyCourses = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/enrollments/my-courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEnrolledCourses(response.data.courses || []);
      } catch (error) {
        console.error("Failed to fetch enrolled courses", error);
      }
    };

    fetchEnrolledCourses();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1>Student Panel</h1>
        <nav>
          <Link to="/student-dashboard" className={location.pathname === "/student-dashboard" ? "active" : ""}>
            📊 Dashboard
          </Link>
          <Link to="/student-my-course" className={location.pathname === "/student-my-course" ? "active" : ""}>
            📚 My Courses
          </Link>
          <Link
            to="/update-profile"
            className={
              location.pathname === "/update-profile" ? "active" : ""
            }
          >
            📝 Update Profile
          </Link>
          <Link to="/landing">🏠 Home</Link>
          <button className="logout-button" onClick={() => {
            localStorage.clear();
            navigate("/");
          }}>
            🚪 Logout
          </button>
        </nav>
      </aside>

      <main className="main-dashboard">
        <h2>My Enrolled Courses</h2>
        <div className="my-courses-grid">
          {enrolledCourses.length === 0 ? (
            <p>You haven’t enrolled in any courses yet.</p>
          ) : (
            enrolledCourses.map((item, index) => {
              const { course, progress } = item;
              const totalLectures = course.lectures?.length || 0;
              const completed = progress?.completedLectures?.length || 0;
              const percentage = totalLectures ? Math.round((completed / totalLectures) * 100) : 0;

              return (
                <div className="course-card" key={index}>
                  <img src={`http://localhost:5000/${course.thumbnail}`} alt={course.title} />
                  <div className="course-info">
                    <h3>{course.title}</h3>
                    <p><strong>Progress:</strong> {percentage}%</p>
                    <Link to={`/course-content/${course._id}`} className="continue-btn">▶️ Continue Course</Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentMyCourses;
