const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Course = require("../models/Course");

//  Utility to delete a file from disk
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

//  CREATE course
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      level,
      accessType,
      durationInWeeks,
      providesCertificate,
      courseDuration,
      isPublished,
      instructor,
      price,
    } = req.body;

    const lectures = [];

    
    console.log(" Raw lecture title:", req.body["lectures[0][title]"]);
    console.log(" Raw lecture duration:", req.body["lectures[0][duration]"]);
    console.log(" Raw lecture videoName:", req.body["lectures[0][videoName]"]);

    for (let key in req.files) {
      if (key.startsWith("lectures")) {
        const match = key.match(/lectures\[(\d+)\]\[video\]/);
        
        if (match) {
          const index = parseInt(match[1]);

          const lectureTitle = req.body["lectures"][index].title;
          const videoName = req.body["lectures"][index].videoName;
          const duration = req.body["lectures"][index].duration;

          lectures[index] = {
            title: lectureTitle || "Untitled Lecture",
            video: req.files[key][0]?.path || "",
            videoName: videoName || req.files[key][0]?.originalname || "",
            duration: Number(duration) || 0,
          };

          console.log(` Lecture ${index}:`, lectures[index]);
        }
      }
    }


    const course = new Course({
      title,
      description,
      thumbnail: req.files?.thumbnail?.[0]?.path || "",
      category,
      level,
      accessType,
      durationInWeeks,
      providesCertificate,
      certificateTemplate: req.files?.certificateTemplate?.[0]?.path || "",
      courseDuration,
      price: Number(price) || 0,
      lectures,
      instructor: new mongoose.Types.ObjectId(instructor),
      isDraft: isPublished === "false" || isPublished === false,
      isPublished: isPublished === "true" || isPublished === true,
    });

    await course.save();
    console.log(" Course saved:", course);

    res.status(201).json({ success: true, course });
  } catch (err) {
    console.error("❌ Course creation error:", err);
    res.status(500).json({ success: false, error: "Course creation failed." });
  }
};

//  GET all courses by instructor ID (with instructor name populated)
exports.getCoursesByInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const objectId = new mongoose.Types.ObjectId(instructorId);

    const courses = await Course.find({ instructor: objectId })
      .populate("instructor", "firstName lastName")
      .sort({ createdAt: -1 });

    console.log(" Instructor's courses fetched:", courses.length);
    res.status(200).json({ courses });
  } catch (error) {
    console.error(" Error fetching instructor courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

//  DELETE course and its uploaded files
exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    
    deleteFile(course.thumbnail);
    deleteFile(course.certificateTemplate);
    course.lectures.forEach((lecture) => deleteFile(lecture.video));

    
    await Course.findByIdAndDelete(courseId);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(" Error deleting course:", error);
    res.status(500).json({ message: "Failed to delete course" });
  }
};


exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId).populate(
      "instructor", "firstName lastName qualification description linkedinProfile"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ course });
  } catch (error) {
    console.error(" Error fetching course by ID:", error);
    res.status(500).json({ message: "Failed to fetch course" });
  }
};


exports.getAllPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate("instructor", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({ courses });
  } catch (error) {
    console.error(" Error fetching published courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    console.log(" req.body[lectures]:", req.body["lectures"]);
    console.log(" req.files:", req.files);
    const courseId = req.params.courseId;
    const existingCourse = await Course.findById(courseId);

    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (req.files?.thumbnail?.[0]?.path) {
      deleteFile(existingCourse.thumbnail);
    }

   
    if (req.files?.certificateTemplate?.[0]?.path) {
      deleteFile(existingCourse.certificateTemplate);
    }

    const {
      title,
      description,
      category,
      level,
      accessType,
      durationInWeeks,
      providesCertificate,
      courseDuration,
      isPublished,
      instructor,
      price,
    } = req.body;

    
    let lectures = existingCourse.lectures || [];

    console.log(req.body);

    
    for (let key in req.files) {
      if (req.files[key].fieldname?.startsWith("lectures")) {

        let lectureTitle = req.body["lectures"][key].title;
        let videoName = req.body["lectures"][key].videoName;
        let duration = req.body["lectures"][key].duration;

        
        lectures[key] = {
          title: lectureTitle || "Untitled Lecture",
          video: req.files[key]?.path || lectures[key]?.video, 
          videoName: videoName || req.files[key]?.originalname || lectures[key]?.videoName,
          duration: Number(duration) || lectures[key]?.duration,
        };

        console.log(` Updated Lecture ${key}:`, lectures[key]);
      }
    }

    
    for (let key in existingCourse.lectures) {
      if (!(key in req.body["lectures"])) {
      
        deleteFile(existingCourse.lectures[key].video);
        
        delete lectures[key];
        console.log(` Removed Lecture ${key}`);
      }
    }

    
    existingCourse.title = title;
    existingCourse.description = description;
    existingCourse.category = category;
    existingCourse.level = level;
    existingCourse.accessType = accessType;
    existingCourse.durationInWeeks = durationInWeeks;
    existingCourse.providesCertificate = providesCertificate;
    existingCourse.courseDuration = courseDuration;
    existingCourse.price = Number(price) || 0;
    existingCourse.lectures = lectures;  
    existingCourse.instructor = instructor;
    existingCourse.thumbnail = req.files?.thumbnail?.[0]?.path || existingCourse.thumbnail;
    existingCourse.certificateTemplate = req.files?.certificateTemplate?.[0]?.path || existingCourse.certificateTemplate;
    existingCourse.isPublished = isPublished === "true" || isPublished === true;
    existingCourse.isDraft = isPublished === "false" || isPublished === false;

    await existingCourse.save();

    res.status(200).json({ success: true, course: existingCourse });
  } catch (err) {
    console.error("❌ Error updating course:", err);
    res.status(500).json({ message: "Failed to update course" });
  }
};



