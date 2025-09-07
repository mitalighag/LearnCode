import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem("name");

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    completedCourses: 0,
  });

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/enrollments/my-courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const courses = response.data.courses || [];

      const mappedCourses = courses.map((item) => {
        const totalLectures = item.course?.lectures?.length || 0;
        const completedLectures = item.progress?.completedLectures?.length || 0;

        const percentage =
          totalLectures > 0
            ? Math.floor((completedLectures / totalLectures) * 100)
            : 0;

        const isCompleted =
          totalLectures > 0 && completedLectures === totalLectures;

        return {
          id: item.course._id,
          name: item.course.title,
          progress: `${percentage}%`,
          status:
            completedLectures === 0
              ? "Not Started"
              : isCompleted
              ? "Completed"
              : "Ongoing",
        };
      });

      setEnrolledCourses(mappedCourses);
      setDashboardData({
        totalCourses: courses.length,
        completedCourses: mappedCourses.filter((c) => c.status === "Completed")
          .length,
        certificates: 0, 
      });
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1>Student Panel</h1>
        <nav>
          <Link
            to="/student-dashboard"
            className={
              location.pathname === "/student-dashboard" ? "active" : ""
            }
          >
            📊 Dashboard
          </Link>
          <Link
            to="/student-my-course"
            className={
              location.pathname === "/student-my-course" ? "active" : ""
            }
          >
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
          <button
            className="logout-button"
            onClick={() => {
              localStorage.clear();
              navigate("/");
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
          <Link to="/browse-courses" className="view-courses-btn">
            View All Courses
          </Link>
        </div>

        {/* Overview Section */}
        <div className="overview">
          <div className="card">
            <h3>Total Enrolled Courses</h3>
            <p>{dashboardData.totalCourses}</p>
          </div>
          <div className="card">
            <h3>Completed Courses</h3>
            <p>{dashboardData.completedCourses}</p>
          </div>
        </div>

        {/* Enrolled Courses Table */}
        <div className="dashboard-table">
          <h3>My Enrolled Courses</h3>
          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {enrolledCourses.length === 0 ? (
                <tr>
                  <td colSpan="4">No enrolled courses found.</td>
                </tr>
              ) : (
                enrolledCourses.map((course, index) => (
                  <tr key={index}>
                    <td>{course.name}</td>
                    <td>{course.progress}</td>
                    <td>{course.status}</td>
                    <td>
                      <button
                        className="continue-btn"
                        onClick={() => navigate(`/course-content/${course.id}`)}
                      >
                        Continue
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;

