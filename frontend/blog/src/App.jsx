import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./pages/navbar/Navbar";
import Home from "./pages/home/components/Home";
import Auth from "./pages/auth/Auth";
import DraftPosts from "./pages/draftPosts/components/DraftPosts";
import Post from "./pages/post/components/Post";
import EditPost from "./pages/editPost/components/EditPost";
import "./App.css";
import NewPost from "./pages/newPost/components/NewPost";
import CategoriesAndTags from "./pages/CategoriesAndTags/components/CategoriesAndTags.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Ładowanie...</div>;
  }

  return isAuthenticated() ? children : <Navigate to="/auth" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/categories-tags" element={<CategoriesAndTags />} />
              <Route path="/posts/:id" element={<Post />} />
              <Route
                path="/edit-post/:id"
                element={
                  <ProtectedRoute>
                    <EditPost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/new"
                element={
                  <ProtectedRoute>
                    <NewPost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/drafts"
                element={
                  <ProtectedRoute>
                    <DraftPosts />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
