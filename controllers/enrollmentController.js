const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

exports.enrollStudentToCourse = async (req, res) => {
  try {
    const { courseId, paymentStatus } = req.body;
    const studentId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "The requested course doesn't exist. Please check the course ID." });
    }

    if (req.user.role === "instructor") {
      return res
        .status(403)
        .json({ error: "Instructors cannot enroll in courses" });
    }

    const existing = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });
    if (existing) {
      return res.status(200).json({ message: "Already enrolled" });
    }

    const validPaymentStatus = ["free", "paid"];
    const status = validPaymentStatus.includes(paymentStatus)
      ? paymentStatus
      : "free";

    const enrollment = new Enrollment({
      student: studentId,
      course: courseId,
      paymentStatus: status,
      accessDurationWeeks: course.durationInWeeks,
    });

    await enrollment.save();

    res.status(201).json({
      message: "Enrollment successful",
      courseTitle: course.title,
      enrollment,
    });
  } catch (err) {
    console.error("❌ Error enrolling student:", err);
    res.status(500).json({ error: "Enrollment failed" });
  }
};

exports.getMyEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    const now = new Date();

    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: "course",
        select: "title thumbnail level price category lectures",
      })
      .select("course progress accessDurationWeeks enrolledAt");

    const activeCourses = enrollments
      .filter((enrollment) => enrollment.course !== null)
      .filter((enrollment) => {
        if (enrollment.accessDurationWeeks === 0) return true; 
        const enrolledDate = new Date(enrollment.enrolledAt);
        const accessUntil = new Date(enrolledDate);
        accessUntil.setDate(
          accessUntil.getDate() + enrollment.accessDurationWeeks * 7
        );
        return accessUntil > now;
      });

    res.status(200).json({
      courses: activeCourses.map((enrollment) => {
        const totalLectures = enrollment.course?.lectures?.length || 0;
        const completed =
          enrollment.progress?.completedLectures?.length || 0;

        const percentage =
          totalLectures > 0
            ? Math.round((completed / totalLectures) * 100)
            : 0;

        return {
          course: enrollment.course,
          access: {
            lifetime: enrollment.accessDurationWeeks === 0,
            enrolledAt: enrollment.enrolledAt,
          },
          progress: {
            currentLecture: enrollment.progress.currentLecture,
            completedLectures: enrollment.progress.completedLectures,
            percentage,
          },
        };
      }),
    });
  } catch (err) {
    console.error("❌ Error fetching enrolled courses:", err);
    res.status(500).json({ error: "Failed to get enrolled courses" });
  }
};

exports.updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureIndex, unmark } = req.body;
    const studentId = req.user.id;

    if (lectureIndex === undefined || lectureIndex < 0) {
      return res
        .status(400)
        .json({ error: "Valid lecture index is required" });
    }

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    
    enrollment.progress.currentLecture = lectureIndex;

    if (unmark) {
      
      enrollment.progress.completedLectures = enrollment.progress.completedLectures.filter(
        (index) => index !== lectureIndex
      );
    } else {
     
      if (!enrollment.progress.completedLectures.includes(lectureIndex)) {
        enrollment.progress.completedLectures.push(lectureIndex);
      }
    }

    await enrollment.save();

    res.status(200).json({ message: "Progress updated" });
  } catch (err) {
    console.error("❌ Error updating progress:", err);
    res.status(500).json({ error: "Failed to update progress" });
  }
};

exports.getStudentsEnrolledInCourse = async (req, res) => {
  try {
    const instructorId = req.user.id; 
    const { courseId } = req.params; 

    
    const course = await Course.findOne({
      _id: courseId,
      instructor: instructorId,
    });

    if (!course) {
      return res.status(403).json({ error: "Not authorized or course not found" });
    }

    
    const enrollments = await Enrollment.find({ course: courseId })
      .populate("student", "name email") 
      .select("student progress enrolledAt");

   
    const totalLectures = course.lectures?.length || 0;

    const formattedEnrollments = enrollments.map((enrollment) => {
      const completed =
        enrollment.progress?.completedLectures?.length || 0;
      const percentage =
        totalLectures > 0 ? Math.round((completed / totalLectures) * 100) : 0;

      return {
        student: enrollment.student, 
        progress: {
          currentLecture: enrollment.progress.currentLecture,
          completedLectures: enrollment.progress.completedLectures, 
          percentage, 
        },
        enrolledAt: enrollment.enrolledAt, 
      };
    });

    
    res.status(200).json({ enrollments: formattedEnrollments });
  } catch (err) {
    console.error("❌ Error fetching enrolled students:", err);
    res.status(500).json({ error: "Failed to get enrolled students" });
  }
};
