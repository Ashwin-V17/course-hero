//userRoutes.js
const express = require("express");
const {
  register,
  login,
  updateUserProfile,
  getEnrolledCourses,
  updateChapterProgress,
  refreshToken,
  findUser,
} = require("../controllers/userController");
const { authenticateJWT } = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/findUser", authenticateJWT, findUser);
router.put("/updateUserProfile", authenticateJWT, updateUserProfile);
router.get("/enrolled-courses", authenticateJWT, getEnrolledCourses);
router.post("/updateChapterProgress", authenticateJWT, updateChapterProgress);
router.post("/refresh-token", refreshToken);

router.post("/:courseId/progress", authenticateJWT, async (req, res) => {
  const { courseId } = req.params;
  const { chapterIndex } = req.body;
  const userId = req.user.id; // Assuming authenticateToken adds `id` to req.user

  try {
    // Find the user and update progress
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const enrolledCourse = user.enrolledCourses.find(
      (course) => course.courseId.toString() === courseId
    );

    if (!enrolledCourse) {
      return res
        .status(404)
        .json({ message: "Course not found for this user" });
    }

    // Update the progress in the enrolled course
    enrolledCourse.progress = chapterIndex; // Adjust to your specific progress-tracking approach
    await user.save();

    res.status(200).json({ message: "Progress updated successfully" });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

router.post("/completeTopic", authenticateJWT, async (req, res) => {
  const { topicId } = req.body;
  console.log(topicId);

  const userId = req.user.id;
  try {
    console.log(" complete Topic try block");
    const user = await User.findById(userId);
    console.log(user + "User from CT");

    console.log(user.completedTopics + "complete topic array");

    if (!user.completedTopics.includes(topicId)) {
      user.completedTopics.push(topicId);
      await user.save();
    }
    res.status(200).json({ message: "Topic marked as completed." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/completedTopicsWithAnswers", authenticateJWT, async (req, res) => {
  console.log("Entered Completed Topics With Answers");
  const userId = req.user.id;
  try {
    // Fetch user and populate completedTopics if it's a reference
    const user = await User.findById(userId).populate("completedTopics"); // Assuming completedTopics is an array of Topic references

    // Map completed topics to include topicId and correct answers
    const completedTopicsWithAnswers = user.completedTopics.map((topic) => ({
      topicId: topic._id,
      correctAnswers: topic.quiz.map((quizItem) => quizItem.correctAnswer),
    }));

    res.json(completedTopicsWithAnswers);
    console.log(completedTopicsWithAnswers);
  } catch (error) {
    console.error("Error fetching completed topics with answers:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
