import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AvailableCourses.css";

const AvailableCourses = () => {
  const [courses, setCourses] = useState([]); // Ensure it's initialized as an array
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // Check for token

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses");
        console.log(response.data);

        if (Array.isArray(response.data)) {
          setCourses(response.data); // Ensure you are setting an array
        } else {
          setError("Unexpected response format.");
        }
      } catch (error) {
        setError("Failed to fetch courses. Please try again later.");
      }
    };
    fetchCourses();
  }, []);

  const handleJoinCourse = (courseId) => {
    if (!token) {
      navigate("/login"); // Redirect to login if user is not authenticated
    } else {
      navigate(`/courses/${courseId}/details`); // Navigate to course details if authenticated
    }
  };

  return (
    <div className="available-courses-container">
      <h1>Available Courses</h1>
      {error && <p className="error-message">{error}</p>}
      {courses.length > 0 ? (
        <div className="courses-list">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <i className="fa-solid fa-book-open-reader"></i>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>
                <strong>Duration:</strong> {course.duration}
              </p>
              <p>
                <strong>Category:</strong> {course.category}
              </p>
              <button onClick={() => handleJoinCourse(course._id)}>
                Join Course
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No courses available to join.</p>
      )}
    </div>
  );
};

export default AvailableCourses;
