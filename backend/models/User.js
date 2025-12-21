// Importing required modules
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (value) {
        const exists = await mongoose.models.User.findOne({ email: value });
        return !exists; // Return true if no matching email exists
      },
      message: "Email already exists.",
    },
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: async function (value) {
        const exists = await mongoose.models.User.findOne({ phone: value });
        return !exists; // Return true if no matching phone exists
      },
      message: "Phone number already exists.",
    },
  },
  password: { type: String, required: true },
  dob: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        const minAge = 12; // Minimum age required for e-learning
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          return age - 1 >= minAge; // Adjust age if the birthday hasn't occurred yet this year
        }
        return age >= minAge;
      },
      message: "User must be at least 12 years old to start e-learning.",
    },
  },
  gender: { type: String, enum: ["male", "female", "others"], required: true },
  role: { type: String, enum: ["student", "staff"], required: true },
  staffId: {
    type: String,
    unique: true,
    validate: {
      validator: async function (value) {
        if (this.role === "staff") {
          const exists = await mongoose.models.User.findOne({ staffId: value });
          return !exists; // Return true if no matching staffId exists
        }
        return !value; // Ensure staffId is not provided for non-staff roles
      },
      message: (props) =>
        props.value
          ? "Staff ID already exists or not valid for the role."
          : "Staff must have a valid and unique staff ID.",
    },
  },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], // Optional for student-specific data
  completedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastPasswordResetRequest: Date,
});

// Hashing password before saving
userSchema.methods.hashPassword = async function () {
  this.password = await bcrypt.hash(this.password, 10);
};

// Compare password for authentication
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
