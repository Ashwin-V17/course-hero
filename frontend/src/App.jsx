import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import CourseList from "./components/CourseList";
import ChapterInfo from "./components/ChapterInfo";
import CreateCourse from "./components/CreateCourse";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateChapter from "./components/CreateChapter";
import CreateTopic from "./components/CreateTopic";
import StudentDashboard from "./components/StudentDashboard";
import Navbar from "./components/NavBar";
import Home from "./components/Home.jsx";
import AvailableCourses from "./components/AvailableCourses.jsx";
import CourseDetails from "./components/CourseDetails.jsx";
import ChapterViewer from "./components/ChapterViewer";
import UpdateProfile from "./components/UpdateProfile";
import SessionModal from "./components/SessionModal";
import ForgetPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import axios from "axios";
import "./App.css";

const decodeJwt = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Invalid token format:", error);
    return null;
  }
};

const App = () => {
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const navigate = useNavigate();

  // Token validation and role setup
  useEffect(() => {
    const validateToken = () => {
      const publicRoutes = ["/login", "/register", "/available-courses"];
      const currentPath = window.location.pathname;

      if (token) {
        const decodedToken = decodeJwt(token);

        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          setRole(decodedToken.role);
        } else {
          console.warn("Token expired or invalid.");
          handleLogout();
        }
      } else if (!publicRoutes.includes(currentPath)) {
        navigate("/");
      }
    };

    validateToken();
  }, [token, navigate]);

  // Session timeout handling
  useEffect(() => {
    if (token) {
      const decodedToken = decodeJwt(token);
      if (!decodedToken) return;

      const timeRemaining = decodedToken.exp * 1000 - Date.now();
      const warningTime = Math.max(timeRemaining - 300000, 0); // Warn 5 minutes before expiration

      const warningTimeout = setTimeout(() => {
        setIsSessionModalOpen(true);
      }, warningTime);

      const expirationTimeout = setTimeout(() => {
        handleLogout();
      }, timeRemaining);

      return () => {
        clearTimeout(warningTimeout);
        clearTimeout(expirationTimeout);
      };
    }
  }, [token]);

  const handleLogin = (newToken, role) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", role);
    setToken(newToken);
    setRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole("");
    setIsSessionModalOpen(false);
    navigate("/");
  };

  const extendSession = async () => {
    try {
      // Simulate token refresh via an API call
      const response = await axios.post(
        "http://localhost:5000/api/users/refresh-token",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { newToken } = response.data;
      handleLogin(newToken, decodeJwt(newToken).role);
      setIsSessionModalOpen(false);
    } catch (error) {
      console.error("Error extending session:", error);
      handleLogout();
    }
  };

  return (
    <>
      <Navbar role={role} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/available-courses" element={<AvailableCourses />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute forLoginPage>
              <Login handleLogin={handleLogin} />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/update-profile"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        {/* Staff-specific routes */}
        {role === "staff" && (
          <>
            <Route
              path="/staff-dashboard"
              element={
                <ProtectedRoute>
                  <CourseList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path=":courseId/chapters/:chapterId"
              element={
                <ProtectedRoute>
                  <ChapterInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId/chapters/create"
              element={
                <ProtectedRoute>
                  <CreateChapter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/chapters/:chapterId/topics/create"
              element={
                <ProtectedRoute>
                  <CreateTopic />
                </ProtectedRoute>
              }
            />
          </>
        )}

        {/* Student-specific routes */}
        {role === "student" && (
          <>
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId/details"
              element={
                <ProtectedRoute>
                  <CourseDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/chapter/:chapterId"
              element={
                <ProtectedRoute>
                  <ChapterViewer />
                </ProtectedRoute>
              }
            />
          </>
        )}
      </Routes>

      {/* Session modal */}
      <SessionModal
        isOpen={isSessionModalOpen}
        onExtendSession={extendSession}
        onLogout={handleLogout}
      />
    </>
  );
};

export default App;
