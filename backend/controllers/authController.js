// controllers/authController.js
const express = require("express");
const crypto = require("crypto");
const User = require("../models/User"); // Your user schema
const sendEmail = require("../utils/sendEmail"); // Utility to send emails
const router = express.Router();
const bcrypt = require("bcryptjs");
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist.",
      });
    }

    // Cooldown: Prevent frequent password reset requests
    const cooldownTime = 15 * 60 * 1000; // 15 minutes in milliseconds
    const now = Date.now();
    if (
      user.lastPasswordResetRequest &&
      now - new Date(user.lastPasswordResetRequest).getTime() < cooldownTime
    ) {
      const remainingTime = Math.ceil(
        (cooldownTime -
          (now - new Date(user.lastPasswordResetRequest).getTime())) /
          60000
      );
      return res.status(429).json({
        success: false,
        message: `You can request another password reset email in ${remainingTime} minutes.`,
      });
    }

    // Generate reset token and expiration
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpire = Date.now() + 3600000; // Token valid for 1 hour

    // Update reset token fields using findOneAndUpdate
    await User.findOneAndUpdate(
      { email },
      {
        resetPasswordToken: resetToken,
        resetPasswordExpire,
        lastPasswordResetRequest: now, // Update cooldown time
      },
      { new: true } // Return the updated document
    );

    // Construct the reset URL
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Email message
    const message = `
      You requested a password reset. Please click the link below to reset your password:
      ${resetUrl}

      If you did not request this, please ignore this email. The link is valid for 1 hour.
    `;

    // Send the email
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully.",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);

    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  console.log("Entered reset password");

  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Hash the new password manually
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Find the user with the token and ensure it's not expired, then update the password
    const user = await User.findOneAndUpdate(
      {
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }, // Token must still be valid
      },
      {
        $set: {
          password: hashedPassword, // Update with hashed password
          resetPasswordToken: undefined, // Clear the reset token
          resetPasswordExpire: undefined, // Clear the expiration
        },
      },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    console.log("Password reset successful for user:", user.email);
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ message: "Error resetting password", error: error.message });
  }
};

module.exports = { forgotPassword, resetPassword };
