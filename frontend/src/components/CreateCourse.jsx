// src/components/CreateCourse.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/CreateCourse.css";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/courses",
        {
          title,
          description,
          duration,
          price,
          category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      window.alert("Course created successfully🤝🏼");
      console.log("Course created:", response.data);
      // Redirect to the CreateChapter page using the created course's ID
      navigate(`/courses/${response.data._id}/chapters/create`);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <div id="create-course-main-container">
      <section className="create-course-container">
        <form onSubmit={handleSubmit}>
          <h2>Create Course</h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="Number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button type="submit">Create Course</button>
        </form>
      </section>
    </div>
  );
};

export default CreateCourse;
