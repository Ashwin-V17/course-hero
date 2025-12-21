// ChapterInfo
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../styles/ChapterInfo.css";

const ChapterInfo = () => {
  const { courseId, chapterId } = useParams();
  console.log(chapterId);

  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    const fetchChapterDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/courses/${courseId}/chapters/${chapterId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setChapter(response.data);
      } catch (error) {
        console.error("Error fetching chapter details:", error);
      }
    };
    fetchChapterDetails();
  }, [chapterId]);

  if (!chapter) return <div>Loading...</div>;

  return (
    <section className="chapter-info-container">
      <h2>Topics in {chapter.title}</h2>
      <ul>
        {chapter.topics.map((topic) => (
          <li key={topic._id}>
            <i class="fa-solid fa-feather-pointed"></i>
            {topic.title}
          </li>
        ))}
      </ul>
      <Link
        to={`/courses/chapters/${chapterId}/topics/create`}
        className="create-topic-link"
      >
        <p>
          Create Topic <i className="fa-solid fa-circle-plus"></i>
        </p>
      </Link>
    </section>
  );
};

export default ChapterInfo;
