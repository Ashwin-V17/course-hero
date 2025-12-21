// auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateJWT = (req, res, next) => {
  console.log("Reached authenticateJWT");

  const authHeader = req.headers["authorization"];
  console.log(authHeader ? "Auth header" : "Auth header is null");

  const token = authHeader && authHeader.split(" ")[1];
  console.log(token ? "Token is present" : "No token");

  console.log("Received Token:", token);

  if (!token) {
    console.log("No token");
    return res.sendStatus(401); // Unauthorized if no token is present
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.sendStatus(403); // Forbidden if token is invalid
    }

    console.log("User payload from JWT:", user); // Log user payload from the token
    req.user = user; // Attach user to request

    next();
  });
};

const generateJWT = (user) => {
  console.log("Generating JWT for user with role:", user.role);

  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

module.exports = { authenticateJWT, generateJWT };
