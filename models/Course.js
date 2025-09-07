const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
  title: String,
  video: String,
  videoName: String,
  duration: Number
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail: String,
  category: String,
  level: String,
  accessType: String,
  durationInWeeks: String,
  courseDuration: Number,
  providesCertificate: Boolean,
  certificateTemplate: String,
  price: { type: Number, default: 0 },
  lectures: [lectureSchema],
  createdAt: { type: Date, default: Date.now },
  isDraft: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Course", courseSchema);