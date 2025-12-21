import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/ProfileModal.css";

const ProfileModal = ({ handleLogout, role, closeModal }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isInitialRender = useRef(true); // Ref to track the initial render

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/users/findUser",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Prevent closing modal on initial render
    if (isInitialRender.current) {
      isInitialRender.current = false;
    } else {
      closeModal(); // Close modal on subsequent route changes
    }
  }, [location, closeModal]);

  const handleLogoutAndCloseModal = () => {
    handleLogout();
    closeModal();
    navigate("/");
  };

  if (!userData) {
    return <div className="profile-modal-overlay-loading">Loading...</div>;
  }

  return (
    <div className="profile-modal-overlay" onClick={closeModal}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h3>Profile</h3>
          <button onClick={closeModal} className="close-btn">
            X
          </button>
        </div>

        <div className="profile-modal-content">
          <div id="profile-modal-image">
            <img
              src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="image"
            />
          </div>
          <div className="profile-modal-data">
            <p>Username:</p>
            <p> {userData.username}</p>
          </div>
          <div className="profile-modal-data">
            <p>Email : </p>
            <p>{userData.email}</p>
          </div>
          <div className="profile-modal-data">
            <p>Role :</p>
            {role === "staff" && <p>Staff</p>}
            {role === "student" && <p>Student</p>}
          </div>
          <button onClick={() => navigate("/update-profile")}>
            View Full Profile
          </button>
          <button onClick={handleLogoutAndCloseModal}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
