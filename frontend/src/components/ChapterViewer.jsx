import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ChapterViewer.css";

const ChapterViewer = () => {
  const { courseId, chapterId } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizStatus, setQuizStatus] = useState("");
  const [completedTopics, setCompletedTopics] = useState([]);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState([]);
  const [showDescription, setShowDescription] = useState(null);

  useEffect(() => {
    console.log("Chapters" + chapter);
    const fetchChapterWithTopics = async () => {
      console.log("Chapters" + chapter);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/courses/${courseId}/chapters/${chapterId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Chapters" + response.data);
        setChapter(response.data);

        const userResponse = await axios.get(
          `http://localhost:5000/api/users/completedTopicsWithAnswers`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const completedData = userResponse.data;
        console.log("user res" + userResponse.data);
        setCompletedTopics(completedData.map((item) => item.topicId));

        // Prepare the map for correct answers
        const correctAnswersMap = completedData.reduce((acc, item) => {
          acc[item.topicId] = item.correctAnswers;
          return acc;
        }, {});
        setShowCorrectAnswers((prev) =>
          response.data.topics.map(
            (topic) => correctAnswersMap[topic._id] || null
          )
        );
      } catch (error) {
        console.error("Error fetching chapter or user data:", error);
      }
    };

    fetchChapterWithTopics();
  }, [courseId, chapterId]);

  const handleAnswerChange = (topicIndex, questionIndex, answer) => {
    const updatedAnswers = [...quizAnswers];
    if (!updatedAnswers[topicIndex]) updatedAnswers[topicIndex] = [];
    updatedAnswers[topicIndex][questionIndex] = answer;
    setQuizAnswers(updatedAnswers);
  };
  const handleSubmitQuiz = async (topicIndex) => {
    const topic = chapter.topics[topicIndex];
    const isQuizCorrect = topic.quiz.every(
      (quizItem, i) => quizItem.correctAnswer === quizAnswers[topicIndex]?.[i]
    );

    // Save correct answers in state and local storage
    const correctAnswers = topic.quiz.map((quizItem) => quizItem.correctAnswer);

    if (isQuizCorrect) {
      setQuizStatus(
        `Correct answers for ${topic.title}! Moving to next topic...`
      );

      // Update the quizAnswers state to show correct answers
      setQuizAnswers((prev) => {
        const updatedAnswers = [...prev];
        updatedAnswers[topicIndex] = correctAnswers;
        return updatedAnswers;
      });

      setCompletedTopics((prev) => [...prev, topic._id]);

      try {
        // Mark topic as completed
        await axios.post(
          `http://localhost:5000/api/users/completeTopic`,
          { topicId: topic._id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Update chapter progress
        await axios.post(
          `http://localhost:5000/api/users/updateChapterProgress`,
          {
            chapterId,
            courseId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (error) {
        console.error("Error updating topic or chapter progress:", error);
      }

      const updatedProgress = calculateProgress();
      setChapter((prevChapter) => ({
        ...prevChapter,
        progress: updatedProgress,
      }));
    } else {
      setQuizStatus("Incorrect answers, please review and try again.");
    }

    setTimeout(() => setQuizStatus(""), 3000);
  };

  const calculateProgress = () => {
    if (!chapter || chapter.topics.length === 0) return 0;
    const completedCount = chapter.topics.filter((topic) =>
      completedTopics.includes(topic._id)
    ).length;
    return Math.floor((completedCount / chapter.topics.length) * 100);
  };
  const toggleDescription = (topicIndex) => {
    setShowDescription((prev) => (prev === topicIndex ? null : topicIndex));
  };
  //  toggleDescription
  return (
    <section className="chapter-viewer-container">
      {chapter ? (
        <>
          <h2>{chapter.title}</h2>
          <p>{chapter.description}</p>

          <div className="progress-bar-container">
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            <p>{calculateProgress()}% completed</p>
          </div>

          {chapter.topics && chapter.topics.length > 0 ? (
            chapter.topics.map((topic, topicIndex) => (
              <div
                key={topic._id}
                className={`topic-section ${
                  completedTopics.includes(topic._id) ? "completed" : ""
                }`}
              >
                <h3>
                  {topic.title}
                  <span
                    className="info-icon"
                    onClick={() => toggleDescription(topicIndex)}
                    title="View topic description"
                  >
                    ℹ️
                  </span>
                </h3>

                {showDescription === topicIndex && (
                  <div className="tooltip">
                    <p>{topic.description}</p>
                  </div>
                )}

                <p>{topic.content}</p>

                <div className="quiz-section">
                  <h4>Quiz for {topic.title}</h4>
                  {topic.quiz.map((quizItem, questionIndex) => (
                    <div key={questionIndex} className="quiz-item">
                      <p className="quiz-questions">{quizItem.question}</p>
                      <div className="quiz-options-container">
                        {quizItem.options.map((option, i) => (
                          <label key={i}>
                            <input
                              type="radio"
                              name={`topic-${topicIndex}-question-${questionIndex}`}
                              value={option}
                              className="quiz-input"
                              checked={
                                quizAnswers[topicIndex]?.[questionIndex] ===
                                option
                              }
                              onChange={() =>
                                handleAnswerChange(
                                  topicIndex,
                                  questionIndex,
                                  option
                                )
                              }
                              disabled={completedTopics.includes(topic._id)}
                            />
                            {option}
                          </label>
                        ))}
                      </div>

                      {/* Show correct answer after submission */}
                      {showCorrectAnswers[topicIndex] && (
                        <p className="correct-answer">
                          Correct Answer:{" "}
                          <span className="correct-answer-text">
                            {quizItem.correctAnswer}
                          </span>
                        </p>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => handleSubmitQuiz(topicIndex)}
                    className="submit-button"
                    disabled={completedTopics.includes(topic._id)}
                  >
                    {completedTopics.includes(topic._id)
                      ? "Completed"
                      : "Submit Quiz"}
                  </button>
                  {quizStatus && <p className="quiz-status">{quizStatus}</p>}
                </div>
              </div>
            ))
          ) : (
            <p>No topics available for this chapter.</p>
          )}
        </>
      ) : (
        <p>Loading chapter details...</p>
      )}
    </section>
  );
};

export default ChapterViewer;
