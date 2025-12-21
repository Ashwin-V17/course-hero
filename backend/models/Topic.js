const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  content: String,
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" },
  quiz: [
    {
      question: { type: String, required: true },
      options: [String],
      correctAnswer: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Topic", topicSchema);
