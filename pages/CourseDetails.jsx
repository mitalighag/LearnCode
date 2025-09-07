import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CourseDetails.css";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        setCourse(res.data.course);
        console.log("📦 Course lectures:", res.data.course.lectures);
      } catch (err) {
        console.error("❌ Error fetching course details:", err);
      } finally {
        setLoading(false);
      }
    };

    const checkEnrollment = async () => {
      if (!isLoggedIn) return;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/enrollments/check/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsEnrolled(res.data.enrolled);
      } catch (err) {
        console.error("❌ Error checking enrollment:", err);
      }
    };

    fetchCourse();
    checkEnrollment();
  }, [courseId, isLoggedIn]);

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (isEnrolled) {
      navigate(`/course-content/${courseId}`);
      return;
    }

    if (course.price > 0) {
      navigate(`/payment/${courseId}`);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/enrollments/enroll",
        {
          courseId,
          paymentStatus: "free",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate(`/course-content/${courseId}`);
    } catch (err) {
      console.error("❌ Enrollment failed:", err);
      alert("Could not enroll. Try again.");
    }
  };

  if (loading) return <p className="loading-text">Loading course details...</p>;
  if (!course) return <p className="error-text">Course not found.</p>;

  const thumbnailUrl = course.thumbnail?.startsWith("http")
    ? course.thumbnail
    : `http://localhost:5000/${course.thumbnail}`;

  const instructor = course.instructor || {};

  return (
    <div className="course-details-container">
      <div className="course-header">
        <img className="course-thumbnail" src={thumbnailUrl} alt={course.title} />
        <div className="course-header-info">
          <h1 className="course-title">{course.title}</h1>
          <p className="course-description">{course.description}</p>
          <div className="course-meta">
            <p><strong>Price:</strong> {course.price === 0 ? "Free" : `₹${course.price}`}</p>
            <p><strong>Certificate:</strong> {course.certificateTemplate ? "Yes" : "No"}</p>
            <p>
              <strong>Access:</strong>{" "}
              {course.accessType === "lifetime"
                ? "Lifetime"
                : `${course.durationInWeeks} weeks`}
            </p>
          </div>
        </div>
      </div>

      {Array.isArray(course.lectures) && course.lectures.length > 0 && (
        <div className="lectures-section">
          <h3>Lectures</h3>
          <ul>
            {course.lectures.map((lecture, index) => (
              <li key={lecture._id || index}>
                <strong>Lecture {index + 1}:</strong> {lecture.title || "Untitled"}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="instructor-section">
        <h3>Instructor Info</h3>
        <p><strong>Name:</strong> {instructor.firstName} {instructor.lastName}</p>
        <p><strong>Qualification:</strong> {instructor.qualification || "N/A"}</p>
        <p><strong>Bio:</strong> {instructor.description || "N/A"}</p>
        {instructor.linkedin && (
          <p>
            <strong>LinkedIn:</strong>{" "}
            <a href={instructor.linkedin} target="_blank" rel="noopener noreferrer">
              {instructor.linkedin}
            </a>
          </p>
        )}
      </div>

      <div className="enroll-section">
        <button
          className="enroll-btn"
          onClick={handleEnroll}
        >
          {isEnrolled ? "Go to Course" : course.price === 0 ? "Start Now" : "Buy Now"}
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
