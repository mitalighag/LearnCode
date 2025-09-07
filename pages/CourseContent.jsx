import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CourseContent.css";

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState(0);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [studentName, setStudentName] = useState("");
  const canvasRef = useRef(null);
  const downloadRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/enrollments/content/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCourse(res.data.course);
        setCompletedLectures(res.data.progress?.completedLectures || []);
        calculateProgress(
          res.data.course.lectures,
          res.data.progress?.completedLectures || []
        );
        if (res.data.course.lectures && res.data.course.lectures.length > 0) {
          setSelectedLecture(0);
        }
      } catch (err) {
        console.error("❌ Error loading content:", err);
        alert("Access denied or you're not enrolled.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [courseId, navigate, token]);

  const calculateProgress = (lectures, completed) => {
    const total = lectures?.length || 0;
    const completedCount = completed?.length || 0;
    const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    setProgressPercentage(percent);
  };

  const handleMarkComplete = async () => {
    try {
      const lectureIndex = selectedLecture;
      const alreadyCompleted = completedLectures.includes(lectureIndex);

      await axios.put(
        "http://localhost:5000/api/enrollments/progress",
        { courseId, lectureIndex, unmark: alreadyCompleted },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let updatedCompleted;
      if (alreadyCompleted) {
        updatedCompleted = completedLectures.filter((i) => i !== lectureIndex);
      } else {
        updatedCompleted = [...completedLectures, lectureIndex];
      }

      setCompletedLectures(updatedCompleted);
      calculateProgress(course.lectures, updatedCompleted);
    } catch (err) {
      console.error("❌ Failed to update progress:", err);
      alert("Failed to update progress");
    }
  };

  const handleDownloadWithName = () => {
    if (!studentName.trim()) {
      alert("Please enter your name before downloading.");
      return;
    }
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.crossOrigin = "anonymous";
  
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
  
      ctx.drawImage(image, 0, 0);
      ctx.font = studentName.length > 20 ? "bold 36px 'Times New Roman', serif" : "bold 48px 'Times New Roman', serif";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.fillText(studentName, canvas.width / 2, canvas.height * 0.65);
  
      const dataURL = canvas.toDataURL("image/png");
      downloadRef.current.href = dataURL;
      downloadRef.current.download = "Certificate_with_Name.png";
      downloadRef.current.click();
    };
  
    image.src = `http://localhost:5000/${course.certificateTemplate.replace(/\\/g, "/")}`;
  };

  if (loading || course === null) {
    return <p>Loading course content...</p>;
  }

  const lecture = course.lectures[selectedLecture];

  return (
    <div className="course-container">
      <div className="sidebar">
        <h3>Lectures</h3>
        <ul>
          {course.lectures.map((lecture, index) => (
            <li
              key={lecture._id || index}
              className={
                !showCertificate && selectedLecture === index ? "active" : ""
              }
              onClick={() => {
                setSelectedLecture(index);
                setShowCertificate(false);
              }}
            >
              {index + 1}. {lecture.title}{" "}
              {completedLectures.includes(index) && (
                <span className="check-icon">✔</span>
              )}
            </li>
          ))}

          {course.providesCertificate && course.certificateTemplate && (
            <li
              className={showCertificate ? "active" : ""}
              onClick={() => setShowCertificate(true)}
            >
              🎓 Certificate
            </li>
          )}
        </ul>
      </div>

      <div className="content-area">
        <h2>{course.title}</h2>
        <p>
          Progress: {progressPercentage}%{" "}
          {progressPercentage === 100 && (
            <span className="completed-text">🎉 Completed!</span>
          )}
        </p>

        {showCertificate ? (
          <div className="certificate-section">
            <h3>Certificate Preview</h3>
            <img
              src={`http://localhost:5000/${course.certificateTemplate.replace(
                /\\/g,
                "/"
              )}`}
              alt="Certificate Template"
              className="certificate-image"
            />
            <p className="certificate-note">
              You will receive this certificate upon course completion.
            </p>

            {progressPercentage === 100 ? (
              <div className="certificate-download-area">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
                <button onClick={handleDownloadWithName}>
                  Download with Name
                </button>
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <a ref={downloadRef} style={{ display: "none" }}>
                  Download
                </a>
              </div>
            ) : (
              <p style={{ color: "gray", fontStyle: "italic" }}>
                Complete the course to enable certificate download.
              </p>
            )}
          </div>
        ) : lecture ? (
          <div className="video-section">
            <h4>{lecture.title}</h4>
            <video
              className="video-player"
              controls
              src={`http://localhost:5000/${lecture.video.replace(/\\/g, "/")}`}
            />

            <div className="action-buttons">
              <button className="complete-btn" onClick={handleMarkComplete}>
                {completedLectures.includes(selectedLecture)
                  ? "Unmark as Completed"
                  : "Mark as Completed"}
              </button>

              <button
                className="back-btn"
                onClick={() => navigate("/student-dashboard")}
              >
                ⬅ Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <p>Select a lecture to view.</p>
        )}
      </div>
    </div>
  );
};

export default CourseContent;
