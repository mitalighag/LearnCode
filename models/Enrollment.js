const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["free", "paid"],
    default: "free",
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  accessDurationWeeks: {
    type: Number,
    default: 0, 
  },
  progress: {
    currentLecture: {
      type: Number,
      default: 0,
    },
    completedLectures: [
      {
        type: Number,
      },
    ],
  },
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
