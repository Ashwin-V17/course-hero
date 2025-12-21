// Course.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Add this for enrolled students
  progress: { type: Number, default: 0 },
});

module.exports = mongoose.model("Course", courseSchema);
