import React from "react";
import { Link } from "react-router-dom";
import "../styles/CourseCard.css"; 

const CourseCard = ({ course }) => {
  const BASE_URL = "http://localhost:5000";
  const thumbnailSrc = course.thumbnail
    ? `${BASE_URL}/${course.thumbnail}`
    : "/default-thumbnail.jpg"; 

  return (
    <div className="updated-course-card">
      <img className="updated-course-image" src={thumbnailSrc} alt={course.title} />

      <div className="updated-course-info">
        <h3 className="updated-course-title">{course.title}</h3>
        <p>
          By {course.instructor?.firstName} {course.instructor?.lastName}
        </p>

        <p className="updated-course-duration">
          {course.accessType === "lifetime"
            ? "Lifetime Access"
            : `${course.durationInWeeks || 0} weeks`}
        </p>
        <p className="updated-course-price">
          {course.price === 0 ? "Free" : `₹${course.price}`}
        </p>
      </div>

      <Link to={`/course/${course._id}`} className="updated-course-link">View Course</Link>
    </div>
  );
};

export default CourseCard;
