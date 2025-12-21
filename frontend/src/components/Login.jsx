import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(false); // Used for toggle state
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student"); // Default to student role
  const navigate = useNavigate();

  // Toggle between Student and Staff roles
  const handleToggle = () => {
    setIsActive(!isActive);
    setRole(!isActive ? "staff" : "student"); // Update the role based on the active state
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Ensure role is properly set before login
    const finalRole = isActive ? "staff" : "student";

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password, role: finalRole } // Send correct role in the request
      );

      // Pass both token and role to handleLogin
      handleLogin(response.data.token, finalRole); // Call handleLogin and pass the role

      // Redirect based on the role
      if (finalRole === "staff") {
        navigate("/staff-dashboard"); // Navigate to staff dashboard
      } else {
        navigate("/student-dashboard"); // Navigate to student dashboard
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Invalid credentials");
      } else {
        console.error("Login failed:", error);
      }
    }
  };

  return (
    <section className="form-main-container">
      <form onSubmit={handleLoginSubmit} id="login-form">
        <div
          className={`toggle-button ${isActive ? "active" : ""}`}
          onClick={handleToggle}
        >
          <span className="role">
            Student <i className="fa-solid fa-graduation-cap"></i>
          </span>
          <span className="role">
            Staff <i className="fa-solid fa-user-tie"></i>
          </span>
          <div className="toggle-knob"></div>
        </div>
        <div className="input-div">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-div">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <i
            className={
              showPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"
            }
            onClick={togglePasswordVisibility}
          ></i>
        </div>
        <button type="submit" className="login-submit-button">
          Login
        </button>
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="login-switch">
            Register <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
