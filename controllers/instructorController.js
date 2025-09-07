const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const getInstructorDashboardStats = async (req, res) => {
  try {
    const instructorId = req.user.id;
    console.log("Current logged-in instructor ID:", req.user.id);
    

    //  courses by this instructor
    const courses = await Course.find({ instructor: instructorId });
    const courseIds = courses.map((course) => course._id);

    //  Total courses
    const totalCourses = courses.length;

    //  Total enrolled students
    const enrolledStudents = await Enrollment.countDocuments({
      course: { $in: courseIds },
    });

    res.status(200).json({
      totalCourses,
      enrolledStudents,
    });
  } catch (error) {
    console.error("Instructor Dashboard Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

module.exports = {
  getInstructorDashboardStats,
};
