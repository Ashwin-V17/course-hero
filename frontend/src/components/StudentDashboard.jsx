// StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(enrolledCourses, "enrolled courses");
  }, [enrolledCourses]);
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/enrolled-courses",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEnrolledCourses(response.data || []);
        console.log(enrolledCourses);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setError("Unable to fetch enrolled courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  // const calculateProgress = (completedTopics, totalTopics) => {
  //   const completed = Array.isArray(completedTopics)
  //     ? completedTopics.length
  //     : 0;
  //   const total = typeof totalTopics === "number" ? totalTopics : 0;
  //   if (total === 0) return 0;
  //   return Math.round((completed / total) * 100);
  // };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
      </div>
    );
  }
  return (
    <div id="sd-main-container">
      <header className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <p>Track your learning progress and access your courses</p>
      </header>

      <section className="enrolled-courses-section">
        <h2>Your Enrolled Courses</h2>
        {enrolledCourses.length > 0 ? (
          <ul className="courses-list">
            {enrolledCourses.map((course) => {
              const progress =
                course.progress !== undefined ? course.progress : 0;
              return (
                <li key={course._id} className="course-item">
                  <div className="course-info">
                    <h3>{course.title}</h3>
                    <p>{course.description || "No description available."}</p>
                    <div className="progress-container">
                      <label>Progress: {course.progress}%</label>
                      <progress value={course.progress} max="100"></progress>
                    </div>
                    {course.chapters?.length > 0 ? (
                      <ul className="chapters-list">
                        {course.chapters.map((chapter) => (
                          <li key={chapter._id}>
                            <Link
                              to={`/course/${course._id}/chapter/${chapter._id}`}
                              className="continue-button"
                            >
                              {chapter.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-chapters">No chapters available</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>You are not enrolled in any courses yet.</p>
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
