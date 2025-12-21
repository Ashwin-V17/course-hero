// CreateTopic.jsx
import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useState } from "react";
import "../styles/CreateTopic.css";

const CreateTopic = () => {
  const { chapterId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [quizzes, setQuizzes] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/courses/chapters/${chapterId}/topics`,
        { title, description, content, quizzes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Topic with quizzes created successfully!");
      console.log("Topic created:", response.data);
    } catch (error) {
      setMessage("Error creating topic with quizzes");
      console.error(
        "Error creating topic:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Similar quiz handling logic as before
  const handleQuizChange = (index, field, value) => {
    setQuizzes((prevQuizzes) => {
      const updatedQuizzes = [...prevQuizzes];
      if (field === "question") {
        updatedQuizzes[index].question = value;
      } else if (field.startsWith("option")) {
        const optionIndex = parseInt(field.slice(-1), 10);
        updatedQuizzes[index].options[optionIndex] = value;
      } else if (field === "correctAnswer") {
        updatedQuizzes[index].correctAnswer = value;
      }
      return updatedQuizzes;
    });
  };

  const addQuiz = () => {
    setQuizzes([
      ...quizzes,
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  return (
    <section className="create-topic-main-container">
      <form onSubmit={handleTopicSubmit} id="create-topic-form">
        <h2>Create Topic</h2>
        <input
          type="text"
          placeholder="Topic Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <h3>Add Quiz Questions</h3>
        {quizzes.map((quiz, index) => (
          <div key={index} className="quiz-section">
            <input
              type="text"
              placeholder="Question"
              className="question-input"
              value={quiz.question}
              onChange={(e) =>
                handleQuizChange(index, "question", e.target.value)
              }
            />
            <div className="quiz-options">
              {quiz.options.map((option, i) => (
                <input
                  key={i}
                  type="text"
                  className="option-inputs"
                  placeholder={`Option ${i + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleQuizChange(index, `option${i}`, e.target.value)
                  }
                />
              ))}
            </div>
            <input
              type="text"
              placeholder="Correct Answer"
              value={quiz.correctAnswer}
              onChange={(e) =>
                handleQuizChange(index, "correctAnswer", e.target.value)
              }
            />
          </div>
        ))}
        <button type="button" onClick={addQuiz}>
          Add Another Question
          <i className="fa-solid fa-circle-plus"></i>
        </button>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Topic with Quizzes"}
        </button>
        {message && <p>{message}</p>}
      </form>
    </section>
  );
};

export default CreateTopic;
