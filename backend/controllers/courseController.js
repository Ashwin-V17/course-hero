const Course = require("../models/Course");
const Chapter = require("../models/Chapter");
const Topic = require("../models/Topic");
const User = require("../models/User"); // Add this if it’s missing

// Create a course
const createCourse = async (req, res) => {
  const { title, description, duration, price, category } = req.body;
  try {
    const course = new Course({
      title,
      description,
      duration,
      price,
      category,
    });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createChapter = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let chapter = await Chapter.findOne({
      course: req.params.courseId,
      title: req.body.title,
    });

    if (chapter) {
      console.log("checking chapter");
      chapter.description = req.body.description;
      const updatedChapter = await chapter.save();
      return res.status(200).json({
        message: "Chapter updated successfully",
        chapter: updatedChapter,
      });
    } else {
      chapter = new Chapter({
        title: req.body.title,
        description: req.body.description,
        course: req.params.courseId,
        quiz: req.body.quizzes || [],
      });
      const savedChapter = await chapter.save();
      course.chapters.push(savedChapter._id);
      await course.save();

      res.status(201).json({
        message: "Chapter created successfully",
        chapter: savedChapter,
      });
    }
  } catch (error) {
    console.error("Error handling chapter creation/update:", error);
    res.status(400).json({ message: error.message });
  }
};

const fetchCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate(
      "chapters"
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all courses
const getCourses = async (req, res) => {
  console.log("reached get courses");
  try {
    const courses = await Course.find().populate("chapters");
    // console.log(courses + "Fetching all courses");

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getChapter = async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;

    const chapter = await Chapter.findById(chapterId)
      .populate({
        path: "topics",
        populate: {
          path: "quiz", // Assuming each topic includes a quiz
        },
      })
      .where("course")
      .equals(courseId);

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    res.status(200).json(chapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const enrollCourse = async (req, res) => {
  try {
    console.log("Entered Enroll course");

    const course = await Course.findById(req.params.courseId);
    console.log("Crossed course id");

    const studentId = req.user.id;
    console.log("Crossed student id");

    if (!course) {
      console.log("cheching course");
      return res.status(404).json({ message: "Course not found" });
    }

    // Add student ID to course's enrolledStudents if not already present
    if (!course.enrolledStudents.includes(studentId)) {
      console.log("cheching course enrolled students ID");
      course.enrolledStudents.push(studentId);
      await course.save();
    }

    // Add course ID to student's enrolledCourses if not already present
    const student = await User.findById(studentId);
    if (!student.enrolledCourses.includes(course._id)) {
      console.log("cheching course enrolled students include  course id");
      student.enrolledCourses.push(course._id);
      await student.save();
    }

    res.status(200).json({ message: "Enrolled successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createCourse,
  createChapter,
  fetchCourse,
  getCourses,
  getChapter,
  enrollCourse,
};
