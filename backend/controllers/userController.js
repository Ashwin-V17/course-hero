const User = require("../models/User");
const Course = require("../models/Course");
const Chapter = require("../models/Chapter");
const Topic = require("../models/Topic");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../middleware/auth");

// Register user
const register = async (req, res) => {
  const { username, email, password, role, dob, gender, staffId, phone } =
    req.body;

  if (!role) {
    return res.status(400).json({ message: "Role is required." });
  }

  if (role === "student" && staffId) {
    return res
      .status(400)
      .json({ message: "Students cannot have a staff ID." });
  }

  if (role === "staff" && !staffId) {
    return res
      .status(400)
      .json({ message: "Staff must have a valid staff ID." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      username,
      email,
      password,
      role,
      dob,
      gender,
      staffId,
      phone,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
const login = async (req, res) => {
  const { email, password, role } = req.body; // Include role in the request
  try {
    const user = await User.findOne({ email, role }); // Verify both email and role
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials or role" });
    }

    const token = generateJWT(user);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Find user by ID
const findUser = async (req, res) => {
  try {
    // The user ID is extracted from the token
    const user = await User.findById(req.user.id).select("-password"); // Exclude the password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.user; // Assuming user ID is attached to the request after authentication middleware
    const { username, email, dob, gender, phone, password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required to update the profile" });
    }

    // Fetch the user to validate the password
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log("Password match:", isPasswordValid);

    // Update fields that have been provided in the request body
    const updates = {};
    if (username) updates.username = username;
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }
      updates.email = email;
    }
    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
      updates.phone = phone;
    }
    if (dob) updates.dob = new Date(dob);
    if (gender) updates.gender = gender;

    // Perform the update operation
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

//? fetching courses
const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is obtained from the token

    // Fetch user details along with enrolled courses
    const user = await User.findById(userId).populate("enrolledCourses").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch each enrolled course with its chapters and topics
    const enrichedCourses = await Promise.all(
      user.enrolledCourses.map(async (courseId) => {
        const course = await Course.findById(courseId)
          .populate("chapters")
          .lean();

        // Get all topics within the course
        const topics = await Topic.find({
          chapter: { $in: course.chapters.map((ch) => ch._id) },
        });

        // Calculate progress
        const completedTopicIds = user.completedTopics.map((topic) =>
          topic.toString()
        );
        const completedTopicsInCourse = topics.filter((topic) =>
          completedTopicIds.includes(topic._id.toString())
        );

        const progress = topics.length
          ? Math.round((completedTopicsInCourse.length / topics.length) * 100)
          : 0;

        return {
          ...course,
          totalTopics: topics.length,
          completedTopics: completedTopicsInCourse.length,
          progress,
        };
      })
    );

    res.status(200).json(enrichedCourses);
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ message: "Error fetching enrolled courses." });
  }
};

const updateChapterProgress = async (req, res) => {
  const { courseId, chapterId } = req.body;
  const userId = req.user.id;
  console.log("Reached update chapter progress");

  try {
    const user = await User.findById(userId).populate("completedTopics");
    if (!user) return res.status(404).json({ error: "User not found" });

    const chapter = await Chapter.findById(chapterId).populate("topics");
    if (!chapter) return res.status(404).json({ error: "Chapter not found" });

    const completedTopicsInChapter = chapter.topics.filter((topic) =>
      user.completedTopics.includes(topic._id)
    ).length;

    const totalTopics = chapter.topics.length;
    const chapterProgress = totalTopics
      ? Math.floor((completedTopicsInChapter / totalTopics) * 100)
      : 0;

    chapter.progress = chapterProgress;
    chapter.isCompleted = chapterProgress === 100;
    await chapter.save();

    const course = await Course.findById(courseId).populate("chapters");
    const totalChapters = course.chapters.length;
    const totalChapterProgress = course.chapters.reduce(
      (sum, chapter) => sum + (chapter.progress || 0),
      0
    );
    const courseProgress = totalChapters
      ? Math.floor(totalChapterProgress / totalChapters)
      : 0;

    course.progress = courseProgress;
    await course.save();

    res.status(200).json({
      chapterProgress,
      courseProgress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Invalid token:", err);
      return res.sendStatus(403); // Forbidden
    }

    // Generate a new token
    const newToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token: newToken });
  });
};
// roleAuth
module.exports = {
  register,
  login,
  findUser,
  updateUserProfile,
  getEnrolledCourses,
  updateChapterProgress,
  refreshToken,
};

// Failed to load resource: the server responded with a status of 404 (Not Found)Understand this errorAI
// App.jsx:115 Failed to refresh session.
