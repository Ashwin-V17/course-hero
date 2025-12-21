const roleAuth = (requiredRole) => (req, res, next) => {
  const userRole = req.user?.role;
  console.log("User role:", userRole); // For debugging

  if (!userRole || userRole !== requiredRole) {
    return res.status(403).json({ message: "Access denied. Forbidden." });
  }
  next();
};

module.exports = roleAuth;
