const express = require("express");
const router = express.Router();
const Chapter = require("../models/Chapter");
const Course = require("../models/Course");
const Topic = require("../models/Topic"); // Import Topic model
const {
  createCourse,
  createChapter,
  getCourses,
  fetchCourse,
  getChapter,
  enrollCourse,
} = require("../controllers/courseController");
const { authenticateJWT } = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");

router.get("/", getCourses);
router.post("/", authenticateJWT, roleAuth("staff"), createCourse);

// Fetch a single course by ID
router.get("/:courseId", fetchCourse);

// Create or update chapter within a course
router.post(
  "/:courseId/chapters",
  authenticateJWT,
  roleAuth("staff"),
  createChapter
);

// Fetch specific chapter by index
// Updated route to fetch chapter details along with topics
router.get("/:courseId/chapters/:chapterId", authenticateJWT, getChapter);

// /chapters/${chapterId}/topics
// Add quiz questions to a specific topicrouter.post(
router.post(
  "/chapters/:chapterId/topics",
  authenticateJWT,
  roleAuth("staff"),
  async (req, res) => {
    try {
      console.log("Entered creating chapter topics");

      const { chapterId } = req.params;
      const { title, description, content, quizzes } = req.body;

      // Find the specified chapter
      const chapter = await Chapter.findById(chapterId);
      if (!chapter) {
        return res
          .status(404)
          .json({ message: "Chapter not found in the specified course" });
      }

      // Create a new Topic associated with the chapter
      const newTopic = new Topic({
        title,
        description,
        content,
        chapter: chapterId,
        quiz: quizzes, // Store quizzes with the topic
      });

      await newTopic.save();

      // Add the new topic ID to the chapter's 'topics' array
      chapter.topics.push(newTopic._id);
      await chapter.save();

      res.status(201).json({
        message: "Topic created successfully and added to chapter",
        topic: newTopic,
      });
    } catch (error) {
      console.error("Error creating topic:", error);
      res.status(500).json({ message: "Failed to create topic" });
    }
  }
);

// Enroll in a course
router.post("/:courseId/enroll", authenticateJWT, enrollCourse);

module.exports = router;

// useEffect(() => {
//   const fetchChapter = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const role = localStorage.getItem("role");
//       console.log(token);
//       if (!token || role !== "staff") {
//         throw new Error("Access denied. Not authorized.");
//       }
//       const response = await axios.get(
//         "http://localhost:5000/api/courses/:courseId/chapters",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Add the JWT token to the Authorization header
//           },
//         }
//       );
//       setChapter(response.data);
//     } catch (error) {
//       console.log("error : " + error);
//     }
//   };
// }, []);
