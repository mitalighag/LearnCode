import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import "../styles/Courses.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/courses/published"
        );
        setCourses(res.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p className="loading">Loading courses...</p>;

  return (
    <section className="courses">
      <h2 className="courses-title">Our Courses</h2>
      <div className="courses-container">
        {courses.length > 0 ? (
          courses.slice(0, 4).map((course, index) => (
            <CourseCard
              key={course._id || index}
              course={{
                ...course,
                name: course.title,
                duration: course.courseDuration,
              }}
            />
          ))
        ) : (
          <p className="no-courses">No courses available.</p>
        )}
      </div>

      <div className="courses-cta">
        <Link to="/browse-courses" className="view-courses-btn">
          View All Courses
        </Link>
      </div>
    </section>
  );
};

export default Courses;
