const express = require("express");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();
const rateLimit = require("express-rate-limit");

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1, // Limit each user to 1 request per window
  message: "Too many password reset requests. Please try again later.",
});

router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
