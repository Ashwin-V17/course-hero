import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/UpdateProfile.css";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    dob: "",
    gender: "",
    phone: "",
  });
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/users/findUser",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Convert the MongoDB date to YYYY-MM-DD
        const userData = response.data;
        if (userData.dob) {
          userData.dob = new Date(userData.dob).toISOString().split("T")[0];
        }

        setFormData(userData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleGenderSelection = (value) => {
    setFormData((prev) => ({ ...prev, gender: value }));

    // Remove and reapply classes to ensure animation
    const selectedLabel = document.querySelector(`label[for="${value}"]`);
    if (selectedLabel) {
      selectedLabel.classList.remove("animate");
      setTimeout(() => selectedLabel.classList.add("animate"), 10);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      // Convert dob to a Date object if needed before sending
      const updatedData = {
        ...formData,
        dob: new Date(formData.dob),
        password,
      };

      await axios.put(
        "http://localhost:5000/api/users/updateUserProfile",
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Profile updated successfully!");
      // navigate("/profile"); // Navigate to profile or another page
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Password verification failed or update unsuccessful!");
    }
  };

  return (
    <div className="update-profile form-main-container">
      <h2>Update Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="register-for update-profile-form"
      >
        <div
          className={`input-div-update-profile ${
            !formData.username ? "placeholder-active" : ""
          }`}
        >
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
        </div>

        <div className="input-div-update-profile">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div className="input-div-update-profile">
          <label htmlFor="dob">DOB :</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            required
          />
        </div>

        <div className="gender-div">
          <span style={{ color: "#000" }}>Select Gender </span>
          {[
            { id: "male", label: "Male" },
            { id: "female", label: "Female" },
            { id: "others", label: "Others" },
          ].map((gender) => (
            <label
              key={gender.id}
              htmlFor={gender.id}
              className={`gender ${
                formData.gender === gender.id
                  ? `selected ${gender.id} animate`
                  : ""
              }`}
            >
              <i
                className={`fa-solid fa-${
                  gender.id === "male"
                    ? "person"
                    : gender.id === "female"
                    ? "person-dress"
                    : "person-half-dress"
                }`}
              ></i>
              {gender.label}
              <input
                type="radio"
                id={gender.id}
                name="gender"
                value={gender.id}
                onChange={() => handleGenderSelection(gender.id)}
                required
              />
            </label>
          ))}
        </div>

        <div className="input-div-update-profile">
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />{" "}
        </div>

        <div className="input-div-update-profile">
          <label htmlFor="password">Confirm Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Link to="/forget-password">Forget Password ?</Link>

        <button type="submit">Update Profile</button>
      </form>{" "}
    </div>
  );
};

export default UpdateProfile;
