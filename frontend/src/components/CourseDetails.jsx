import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CourseDetails.css"; // Import your styles

const CourseDetails = () => {
  const { courseId } = useParams(); // Get course ID from URL params
  const [course, setCourse] = useState(null); // Store course data
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/courses/${courseId}`
        );
        setCourse(response.data);
        setIsLoading(false);
      } catch (error) {
        setError("Failed to fetch course details. Please try again later.");
        setIsLoading(false);
      }
    };
    fetchCourseDetails();
  }, [courseId]);

  const handleEnrollment = async () => {
    try {
      // Assuming you need to authenticate and send student details for enrollment
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/enroll`,
        {}, // You can send additional data like student ID here
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the JWT token for authenticated routes
          },
        }
      );

      console.log("Enrolled successfully:", response.data);
      // Redirect to a confirmation page or display success message
      // navigate(`/enrollment-success`);
      window.alert("Enrolled successfully...!");
      navigate("/student-dashboard");
    } catch (error) {
      console.error("Error during enrollment:", error);
      setError("Failed to enroll. Please try again.");
    }
  };

  if (isLoading) {
    return <p>Loading course details...</p>;
  }

  return (
    <div className="course-details-container">
      {error && <p className="error-message">{error}</p>}
      {course ? (
        <>
          <h1>{course.title}</h1>
          <p className="cd-course-description">{course.description}</p>
          <p>
            <strong>Duration:</strong> {course.duration}
          </p>
          <p>
            <strong>Category:</strong> {course.category}
          </p>
          <p>
            <strong>Price:</strong> ${course.price || "N/A"}{" "}
            {/* Add price field if applicable */}
          </p>
          <button onClick={handleEnrollment}>
            Enroll Now <i class="fa-solid fa-graduation-cap"></i>
          </button>
        </>
      ) : (
        <p>Course not found.</p>
      )}
    </div>
  );
};

export default CourseDetails;
