// CreateChapter.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useState } from "react";
import "../styles/CreateChapter.css";

const CreateChapter = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChapterSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/chapters`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Chapter created successfully!");
      console.log("Chapter created:", response.data);

      const chapterId = response.data.chapter._id;
      navigate(`/courses/chapters/${chapterId}/topics/create`); // Navigate to CreateTopic page
    } catch (error) {
      setMessage("Error creating chapter");
      console.error(
        "Error creating chapter:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="create-chapter-main-container">
      <form onSubmit={handleChapterSubmit} id="create-chapter-form">
        <h2>Create Chapter</h2>
        <input
          type="text"
          placeholder="Chapter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Chapter"}
        </button>
        {message && <p>{message}</p>}
      </form>
    </section>
  );
};

export default CreateChapter;
