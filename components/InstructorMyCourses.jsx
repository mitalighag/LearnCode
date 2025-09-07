import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/InstructorMyCourses.css";

const InstructorMyCourses = () => {
  const navigate = useNavigate();
  const [publishedCourses, setPublishedCourses] = useState([]);
  const [draftCourses, setDraftCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const instructorId = localStorage.getItem("userId");

    if (!instructorId) {
      alert("Instructor ID not found. Please log in again.");
      navigate("/login");
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/courses/instructor/${instructorId}/courses`
        );

        const sortedCourses = response.data.courses.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPublishedCourses(sortedCourses.filter(course => course.isPublished));
        setDraftCourses(sortedCourses.filter(course => course.isDraft && !course.isPublished));
      } catch (error) {
        console.error("Error fetching courses:", error);
        alert("⚠️ Failed to load courses. Please check your network or try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  const deleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`${BASE_URL}/api/courses/${id}`);
        setPublishedCourses(prev => prev.filter(course => course._id !== id));
        setDraftCourses(prev => prev.filter(course => course._id !== id));
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("❌ Failed to delete course. Please try again.");
      }
    }
  };

  const handleEdit = (course) => {
    navigate(`/instructor/edit-course/${course._id}`);
  };

  const renderCoursesTable = (title, courses, statusClass) => (
    <>
      <h3>{title}</h3>
      <table className="my-courses-table">
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Course Name</th>
            <th>Total Lectures</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td>
                <img
                  src={`${BASE_URL}/${course.thumbnail}`}
                  alt="Thumbnail"
                  className="thumbnail"
                />
              </td>
              <td>{course.title}</td>
              <td>{course.lectures?.length || 0}</td>
              <td className={`status ${statusClass}`}>{statusClass === "published" ? "Active" : "Draft"}</td>
              <td className="action-buttons">
                <button className="edit-btn" onClick={() => handleEdit(course)}>✏️ Edit</button>
                <button className="delete-btn" onClick={() => deleteCourse(course._id)}>❌ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  return (
    <div className="my-courses-container">
      <div className="my-courses-header">
        <h2>📚 My Courses</h2>
        <button className="add-course-btn" onClick={() => navigate("/add-course")}>
          ➕ Add New Course
        </button>
      </div>

      {loading ? (
        <p className="loading-text">⏳ Loading courses...</p>
      ) : publishedCourses.length === 0 && draftCourses.length === 0 ? (
        <p className="no-courses-text">No courses found.</p>
      ) : (
        <>
          {renderCoursesTable("✅ Published Courses", publishedCourses, "published")}
          {renderCoursesTable("📝 Draft Courses", draftCourses, "draft")}
        </>
      )}
    </div>
  );
};

export default InstructorMyCourses;
