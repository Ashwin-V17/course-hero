import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/CourseList.css";

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || role !== "staff") {
          throw new Error("Access denied. Not authorized.");
        }

        const response = await axios.get("http://localhost:5000/api/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section id="courselist-main-container">
      <div id="course-list-div">
        <h1>Course List</h1>
        <ul>
          {courses.map((course) => (
            <li key={course._id} className="course-li">
              <h2>{course.title}</h2>
              <p>{course.description}</p>

              {/* Display chapters */}
              <div className="chapters-list">
                <h3>Chapters:</h3>
                <ol>
                  {course.chapters.map((chapter) => (
                    <li key={chapter._id}>
                      <Link
                        to={`/${course._id}/chapters/${chapter._id}`}
                        className="chapterLink"
                      >
                        {chapter.title}
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>

              <Link
                to={`/courses/${course._id}/chapters/create`}
                id="create-chapter-link"
              >
                <p>
                  Create Chapter <i className="fa-solid fa-circle-plus"></i>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CourseList;
