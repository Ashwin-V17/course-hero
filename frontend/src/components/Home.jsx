import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css"; // Add your CSS here

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <img src="../logo.svg" alt="img" width={"100dvw"} height={"100dvh"} />
        {/* <img
          src="https://images.pexels.com/photos/28210179/pexels-photo-28210179/free-photo-of-a-mountain-goat-sitting-on-top-of-a-mountain.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
          alt="img"
        /> */}
        <h1>Welcome to Course Heroes</h1>
        <p>Your Learning Journey Starts Here!</p>
        <div className="cta-buttons">
          <Link to="/available-courses" className="btn-primary">
            Explore Courses
          </Link>
          <Link to="/register" className="btn-secondary">
            Get Started
          </Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature">
            <i className="fa-solid fa-chalkboard-teacher"></i>
            <h3>Expert Instructors</h3>
            <p>Learn from industry experts with years of experience.</p>
          </div>
          <div className="feature">
            <i className="fa-solid fa-book-open"></i>
            <h3>Diverse Courses</h3>
            <p>Choose from a variety of subjects tailored to your needs.</p>
          </div>
          <div className="feature">
            <i className="fa-solid fa-laptop"></i>
            <h3>Interactive Learning</h3>
            <p>Engage in quizzes, discussions, and assignments.</p>
          </div>
          <div className="feature">
            <i className="fa-solid fa-chart-line"></i>
            <h3>Track Your Progress</h3>
            <p>Keep track of your learning journey and achievements.</p>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="categories-section">
        <h2>Explore Our Courses</h2>
        <div className="categories-grid">
          <div className="category">
            <h3>Technology</h3>
            <p>
              Learn cutting-edge technologies like AI, Blockchain, and more.
            </p>
            <Link to="/courses/technology" className="btn-link">
              Browse Technology
            </Link>
          </div>
          <div className="category">
            <h3>Business</h3>
            <p>
              Master business skills like marketing, finance, and management.
            </p>
            <Link to="/courses/business" className="btn-link">
              Browse Business
            </Link>
          </div>
          <div className="category">
            <h3>Design</h3>
            <p>Explore courses in UI/UX design, graphic design, and more.</p>
            <Link to="/courses/design" className="btn-link">
              Browse Design
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>Join our community and start learning today!</p>
        <p>&copy; 2024 Course Heroes | Contact Us | Privacy Policy</p>
      </footer>
    </div>
  );
};

export default Home;
