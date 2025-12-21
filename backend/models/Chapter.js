// Chapter.js
const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  isCompleted: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
});

const Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = Chapter;
