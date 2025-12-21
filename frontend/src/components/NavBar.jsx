import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal"; // Import the modal component
import "../styles/Navbar.css";

const Navbar = ({ role, handleLogout }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();

  const toggleProfileModal = () => {
    setShowProfileModal((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div id="logo-div">
        <img src="../logo.svg" alt="img" width={"50vw"} height={"50vh"} />
        <span>Course Heroes</span>
      </div>
      <ul>
        <li>
          <Link to={role === "staff" ? "staff-dashboard" : "/"}>Home</Link>
        </li>
        {role === "staff" ? (
          <>
            <li>
              <Link to="/create">Create Course</Link>
            </li>
            <li>
              <button onClick={toggleProfileModal} className="profile-icon">
                {/* Replace with an icon */}
                <img src="../profile-icon.svg" alt="Profile" />
              </button>
            </li>
          </>
        ) : role === "student" ? (
          <>
            <li>
              <Link to="/available-courses">Join Courses</Link>
            </li>
            <li>
              <Link to="/student-dashboard">My Courses</Link>
            </li>
            <li>
              <button onClick={toggleProfileModal} className="profile-icon">
                {/* Replace with an icon */}
                <i class="fa-regular fa-circle-user"></i>
                {/* <img src="../profile-icon.svg" alt="Profisle" /> */}
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
      {showProfileModal && (
        <ProfileModal
          handleLogout={handleLogout}
          role={role}
          closeModal={toggleProfileModal}
        />
      )}
    </nav>
  );
};

export default Navbar;
