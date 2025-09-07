const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const { getAllPublishedCourses } = require("../controllers/courseController");

const {
  createCourse,
  getCoursesByInstructor,
  deleteCourse,
  getCourseById,
  updateCourse 
} = require("../controllers/courseController");


const courseUploadFields = [
  { name: "thumbnail", maxCount: 1 },
  { name: "certificateTemplate", maxCount: 1 },
  { name: "lectures[0][video]" },
  { name: "lectures[1][video]" },
  { name: "lectures[2][video]" },
  { name: "lectures[3][video]" },
  
];


router.post("/", upload.fields(courseUploadFields), createCourse);
router.put("/:courseId", upload.any(), updateCourse);
router.get("/instructor/:instructorId/courses", getCoursesByInstructor); 
router.get("/published", getAllPublishedCourses);
router.get("/:id", getCourseById);
router.delete("/:id", deleteCourse);
router.put("/:id", upload.any(), updateCourse);
module.exports = router;
