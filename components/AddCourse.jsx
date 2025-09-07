import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AddCourse.css";

const predefinedCategories = [
  "Web Development",
  "Programming Languages",
  "Data Science & AI",
  "Mobile Development",
  "Cybersecurity",
  "DevOps & Cloud",
  "Database & Backend",
  "Other",
];

const AddCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [courseDetails, setCourseDetails] = useState({
    title: "",
    description: "",
    thumbnail: null,
    category: "",
    customCategory: "",
    level: "",
    isPaid: false,
    price: 0,
    lectures: [],
    providesCertificate: false,
    certificateTemplate: null,
    courseDuration: 0,
    accessType: "lifetime",
    durationInWeeks: "",
  });

  const [lecture, setLecture] = useState({
    title: "",
    video: null,
    videoName: "",
    duration: 0,
  });

  const lectureVideoInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log({ name, value, type, checked });
    if (name === "price" && value < 0) {
      return;
    }
    setCourseDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    console.log(courseDetails);
  };

  const handleAccessTypeChange = (e) => {
    const accessType = e.target.value;
    setCourseDetails((prev) => ({
      ...prev,
      accessType,
      durationInWeeks: accessType === "limited" ? prev.durationInWeeks : "",
    }));
  };

  const handlePaymentTypeChange = (e) => {
    const isPaid = e.target.value === "paid";
    setCourseDetails((prev) => ({
      ...prev,
      isPaid,
      price: isPaid ? prev.price : "",
    }));
  };

  const handleFileChange = (e) => {
    setCourseDetails({ ...courseDetails, thumbnail: e.target.files[0] });
  };

  const removeThumbnail = () => {
    setCourseDetails({ ...courseDetails, thumbnail: null });
  };

  const handleLectureChange = (e) => {
    setLecture({ ...lecture, [e.target.name]: e.target.value });
  };

  const handleLectureFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.src = URL.createObjectURL(file);

    videoElement.onloadedmetadata = () => {
      window.URL.revokeObjectURL(videoElement.src);
      const duration = Math.floor(videoElement.duration);
      setLecture((prev) => ({
        ...prev,
        video: file,
        videoName: file.name,
        duration,
      }));
    };
  };

  const calculateTotalDuration = (lectures) => {
    return lectures.reduce((sum, lec) => sum + (lec.duration || 0), 0);
  };

  const addLecture = () => {
    console.log("Adding lecture:", lecture);
    if (!lecture.title || !lecture.video || lecture.duration === undefined) {
      alert("Please enter a title and select a video file for the lecture.");
      return;
    }

    const updatedLectures = [...courseDetails.lectures, lecture];
    const updatedDuration = calculateTotalDuration(updatedLectures);

    setCourseDetails((prev) => ({
      ...prev,
      lectures: updatedLectures,
      courseDuration: updatedDuration,
    }));

    setLecture({ title: "", video: null, videoName: "", duration: 0 });
    if (lectureVideoInputRef.current) lectureVideoInputRef.current.value = null;
  };

  const removeLecture = (index) => {
    const updatedLectures = [...courseDetails.lectures];
    updatedLectures.splice(index, 1);
    const updatedDuration = calculateTotalDuration(updatedLectures);

    setCourseDetails((prev) => ({
      ...prev,
      lectures: updatedLectures,
      courseDuration: updatedDuration,
    }));
  };

  const moveLecture = (index, direction) => {
    const updatedLectures = [...courseDetails.lectures];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= updatedLectures.length) return;
    [updatedLectures[index], updatedLectures[targetIndex]] = [
      updatedLectures[targetIndex],
      updatedLectures[index],
    ];
    setCourseDetails({ ...courseDetails, lectures: updatedLectures });
  };

  const handleCertificateUpload = (e) => {
    setCourseDetails({
      ...courseDetails,
      certificateTemplate: e.target.files[0],
    });
  };

  const removeCertificateTemplate = () => {
    setCourseDetails({
      ...courseDetails,
      certificateTemplate: null,
    });
  };

  const validateCourseForPublishing = () => {
    if (!courseDetails.title.trim()) return "Course title is required.";
    if (!courseDetails.description.trim())
      return "Course description is required.";
    if (!courseDetails.thumbnail) return "Course thumbnail is required.";
    if (!courseDetails.category) return "Course category must be selected.";
    if (
      courseDetails.category === "Other" &&
      !courseDetails.customCategory.trim()
    )
      return "Please specify a custom category.";
    if (!courseDetails.level) return "Please select the course level.";
    if (courseDetails.lectures.length === 0)
      return "At least one lecture is required.";
    if (
      courseDetails.accessType === "limited" &&
      !courseDetails.durationInWeeks
    )
      return "Please specify the number of weeks for limited access.";
    if (courseDetails.providesCertificate && !courseDetails.certificateTemplate)
      return "Please upload a certificate template.";
    return null;
  };

  const prepareFormData = (isPublished) => {
    const formData = new FormData();
    formData.append("title", courseDetails.title);
    formData.append("description", courseDetails.description);
    formData.append("thumbnail", courseDetails.thumbnail);
    formData.append(
      "category",
      courseDetails.category === "Other"
        ? courseDetails.customCategory
        : courseDetails.category
    );
    formData.append("level", courseDetails.level);
    formData.append("isPaid", courseDetails.isPaid);
    if (courseDetails.isPaid) {
      formData.append("price", courseDetails.price);
    }
    formData.append("accessType", courseDetails.accessType);
    if (courseDetails.accessType === "limited") {
      formData.append("durationInWeeks", courseDetails.durationInWeeks);
    }
    formData.append("providesCertificate", courseDetails.providesCertificate);
    if (
      courseDetails.providesCertificate &&
      courseDetails.certificateTemplate
    ) {
      formData.append("certificateTemplate", courseDetails.certificateTemplate);
    }
    formData.append("courseDuration", courseDetails.courseDuration);
    formData.append("isPublished", isPublished);
    formData.append("instructor", localStorage.getItem("userId"));
    console.log("Lectures to be uploaded:", courseDetails.lectures);
    courseDetails.lectures.forEach((lecture, index) => {
      formData.append(`lectures[${index}][title]`, lecture.title);
      formData.append(`lectures[${index}][duration]`, lecture.duration);
      formData.append(`lectures[${index}][videoName]`, lecture.videoName);
      formData.append(`lectures[${index}][video]`, lecture.video); 
    });

    return formData;
  };

  const saveDraft = async () => {
    if (
      !courseDetails.title ||
      !courseDetails.description ||
      !courseDetails.thumbnail
    ) {
      alert("Please complete the required fields before saving as draft.");
      return;
    }

    const formData = prepareFormData(false);

    try {
      const method = courseId ? "put" : "post";
      const url = courseId
        ? `http://localhost:5000/api/courses/${courseId}`
        : "http://localhost:5000/api/courses";

      await axios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert(`Course ${courseId ? "updated" : "saved"} as draft.`);
    } catch (err) {
      console.error("Draft save error:", err);
      alert("Failed to save draft.");
    }
  };

  const publishCourse = async () => {
    const error = validateCourseForPublishing();
    if (error) return alert(error);

    const formData = prepareFormData(true);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    try {
      const method = courseId ? "put" : "post";

      const url = courseId
        ? `http://localhost:5000/api/courses/${courseId}`
        : "http://localhost:5000/api/courses";

      await axios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert(`Course ${courseId ? "updated" : "published"} successfully.`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Publish error:", err);
      alert("Failed to publish course.");
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/courses/${courseId}`
        );
        const data = res.data.course;
        console.log(data);
        setCourseDetails({
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail,
          category: data.category,
          customCategory: data.customCategory || "",
          level: data.level,
          isPaid: data.price !== 0,
          price: data.price || 0,
          lectures: data.lectures,
          providesCertificate: data.providesCertificate,
          certificateTemplate: data.certificateTemplate || null,
          courseDuration: data.courseDuration,
          accessType: data.accessType || "lifetime",
          durationInWeeks: data.durationInWeeks || "",
        });
      } catch (err) {
        console.error("Failed to fetch course:", err);
      }
    };

    fetchCourse();
  }, [courseId]);

  return (
    <div className="add-course-container">
      <h2>{courseId ? "Edit Course" : "Add New Course"}</h2>

      {/* Title */}
      <input
        type="text"
        name="title"
        placeholder="Course Title"
        value={courseDetails.title}
        onChange={handleInputChange}
        required
      />

      {/* Description */}
      <textarea
        name="description"
        placeholder="Course Description"
        value={courseDetails.description}
        onChange={handleInputChange}
        required
      />

      {/* Thumbnail Upload */}
      <div>
        <label>Thumbnail:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {courseDetails.thumbnail && (
          <div>
            <span>
              {typeof courseDetails.thumbnail === "string"
                ? "Existing thumbnail"
                : courseDetails.thumbnail.name}
            </span>
            <button type="button" onClick={removeThumbnail}>
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Category */}
      <div>
        <label>Category:</label>
        <select
          name="category"
          value={courseDetails.category}
          onChange={handleInputChange}
        >
          <option value="">Select Category</option>
          {predefinedCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {courseDetails.category === "Other" && (
          <input
            type="text"
            name="customCategory"
            placeholder="Enter custom category"
            value={courseDetails.customCategory}
            onChange={handleInputChange}
          />
        )}
      </div>

      {/* Level */}
      <div>
        <label>Level:</label>
        <select
          name="level"
          value={courseDetails.level}
          onChange={handleInputChange}
        >
          <option value="">Select Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Free or Paid */}
      <div>
        <label>Course Type:</label>
        <label>
          <input
            type="radio"
            value="free"
            checked={!courseDetails.isPaid}
            onChange={handlePaymentTypeChange}
          />{" "}
          Free
        </label>
        <label>
          <input
            type="radio"
            value="paid"
            checked={courseDetails.isPaid}
            onChange={handlePaymentTypeChange}
          />{" "}
          Paid
        </label>

        {courseDetails.isPaid && (
          <input
            type="number"
            name="price"
            placeholder="Course Price"
            value={courseDetails.price}
            onChange={handleInputChange}
          />
        )}
      </div>

      
      <div>
        <label>Access Type:</label>
        <label>
          <input
            type="radio"
            value="lifetime"
            checked={courseDetails.accessType === "lifetime"}
            onChange={handleAccessTypeChange}
          />{" "}
          Lifetime Access
        </label>
        <label>
          <input
            type="radio"
            value="limited"
            checked={courseDetails.accessType === "limited"}
            onChange={handleAccessTypeChange}
          />{" "}
          Limited Duration
        </label>

        {courseDetails.accessType === "limited" && (
          <input
            type="number"
            name="durationInWeeks"
            placeholder="Duration in weeks"
            value={courseDetails.durationInWeeks}
            onChange={handleInputChange}
          />
        )}
      </div>

      
      <div>
        <label>
          <input
            type="checkbox"
            name="providesCertificate"
            checked={courseDetails.providesCertificate}
            onChange={handleInputChange}
          />{" "}
          Provide Certificate
        </label>

        {courseDetails.providesCertificate && (
          <div>
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={handleCertificateUpload}
            />
            {courseDetails.certificateTemplate && (
              <div>
                <span>
                  {courseDetails.certificateTemplate.name ||
                    "Certificate selected"}
                </span>
                <button type="button" onClick={removeCertificateTemplate}>
                  Remove
                </button>
              </div>
            )}
          </div>
        )}
      </div>

     
      {/* Lectures Section */}
      <div className="lecture-section">
        <h3>Lectures</h3>

        {/* Lecture Title Input */}
        <input
          type="text"
          name="title"
          placeholder="Lecture Title"
          value={lecture.title}
          onChange={handleLectureChange}
        />

        {/* Lecture Video Upload */}
        <input
          type="file"
          accept="video/*"
          onChange={handleLectureFileChange}
          ref={lectureVideoInputRef}
        />

        {/* Show selected video name and duration */}
        {lecture.video && (
          <div>
            <p>
              <strong>Video:</strong> {lecture.video.name}
            </p>
            <p>
              <strong>Duration:</strong> {lecture.duration} seconds
            </p>
          </div>
        )}

        {/* Add Lecture Button */}
        <button type="button" onClick={addLecture}>
          Add Lecture
        </button>

        {/* Display Added Lectures */}
        <div className="added-lectures">
          <h4>Added Lectures</h4>
          {courseDetails.lectures.map((lec, index) => (
            <div key={index} className="lecture-item">
              <p>
                <strong>
                  {index + 1}. {lec.title}
                </strong>{" "}
                ({lec.duration} sec)
              </p>
              <button onClick={() => moveLecture(index, -1)}>Move Up</button>
              <button onClick={() => moveLecture(index, 1)}>Move Down</button>
              <button onClick={() => removeLecture(index)}>Remove</button>
            </div>
          ))}
        </div>
      </div>

      {/* Course Total Duration Display */}
      <div>
        <strong>Total Duration:</strong> {courseDetails.courseDuration} seconds
      </div>

      {/* Save & Publish Buttons */}
      <div className="form-actions">
        <button type="button" onClick={saveDraft}>
          Save as Draft
        </button>
        <button type="button" onClick={publishCourse}>
          Publish Course
        </button>
      </div>
    </div>
  );
};

export default AddCourse;
