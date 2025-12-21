import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    staffId: "",
    phone: "",
    dob: "",
    gender: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const navigate = useNavigate();
  const handleGenderSelection = (value) => {
    setFormData((prev) => ({ ...prev, gender: value }));

    // Remove and reapply classes to ensure animation
    const selectedLabel = document.querySelector(`label[for="${value}"]`);
    if (selectedLabel) {
      selectedLabel.classList.remove("animate");
      setTimeout(() => selectedLabel.classList.add("animate"), 10);
    }
  };

  const toggleRole = () => {
    setFormData((prev) => ({
      ...prev,
      role: prev.role === "student" ? "staff" : "student",
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validatePassword = (password) => {
    setPasswordRules({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&#]/.test(password),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      validatePassword(value);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (Object.values(passwordRules).some((rule) => !rule)) {
      alert("Password does not meet the required criteria.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const { role, staffId, ...restData } = formData;
    const userData = {
      ...restData,
      role,
      staffId: role === "staff" ? staffId : null,
    };

    try {
      await axios.post("http://localhost:5000/api/users/register", userData);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error);
    }
  };

  return (
    <section className="form-main-container">
      <form onSubmit={handleRegister} className="register-form">
        {/* Role Toggle */}
        <div
          className={`toggle-button ${
            formData.role === "staff" ? "active" : ""
          }`}
          onClick={toggleRole}
        >
          <span className="role">
            Student <i className="fa-solid fa-graduation-cap"></i>
          </span>
          <span className="role">
            Staff <i className="fa-solid fa-user-tie"></i>
          </span>
          <div className="toggle-knob"></div>
        </div>

        {/* Username */}
        <div className="input-div">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Email */}
        <div className="input-div">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Staff ID (Conditional for Staff Role) */}
        {formData.role === "staff" && (
          <div className="input-div">
            <input
              type="text"
              name="staffId"
              placeholder="Staff ID"
              value={formData.staffId}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        {/* Phone Number */}
        <div className="input-div">
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Date of Birth */}
        <div className="input-div">
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Gender Selection */}
        <div className="gender-div">
          <span>Select Gender </span>
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
              />
            </label>
          ))}
        </div>

        {/* animate */}
        {/* Password */}
        <div className="input-div password-div">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            autoComplete="new-password"
          />
          <i
            className={
              showPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"
            }
            onClick={togglePasswordVisibility}
          ></i>
        </div>

        {/* Live Password Rules */}
        <div className="password-rules">
          <p className={passwordRules.length ? "valid" : "invalid"}>
            • At least 8 characters
          </p>
          <p className={passwordRules.uppercase ? "valid" : "invalid"}>
            • At least one uppercase letter
          </p>
          <p className={passwordRules.lowercase ? "valid" : "invalid"}>
            • At least one lowercase letter
          </p>
          <p className={passwordRules.number ? "valid" : "invalid"}>
            • At least one number
          </p>
          <p className={passwordRules.specialChar ? "valid" : "invalid"}>
            • At least one special character (@$!%*?&#)
          </p>
        </div>

        {/* Confirm Password */}
        <div className="input-div password-div">
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            autoComplete="new-password"
          />
          <i
            className={
              showPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"
            }
            onClick={togglePasswordVisibility}
          ></i>
        </div>

        {/* Submit Button */}
        <button type="submit" className="register-submit-button">
          Register
        </button>

        {/* Login Redirect */}
        <p>
          Already have an account?{" "}
          <Link to="/login" className="login-switch">
            Login <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
