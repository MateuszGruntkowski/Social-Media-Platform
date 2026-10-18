import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import apiService from "../../../services/apiService";

import PostNavigation from "./PostNavigation";
import PostArticle from "./PostArticle";
import PostComments from "./PostComments";
import styles from "../styles/Post.module.css";

const PostSkeleton = () => (
    <div className={styles.skeletonPost} aria-hidden="true">
      <div className={styles.skeletonAuthor}>
        <div className={`skeleton ${styles.skeletonAvatar}`} />
        <div className={styles.skeletonMeta}>
          <div className={`skeleton ${styles.skeletonLine} ${styles.w30}`} />
          <div className={`skeleton ${styles.skeletonLine} ${styles.w20}`} />
        </div>
      </div>
      <div className={`skeleton ${styles.skeletonLine} ${styles.skeletonTitle}`} />
      <div className={`skeleton ${styles.skeletonLine} ${styles.w100}`} />
      <div className={`skeleton ${styles.skeletonLine} ${styles.w100}`} />
      <div className={`skeleton ${styles.skeletonLine} ${styles.w80}`} />
      <div className={`skeleton ${styles.skeletonLine} ${styles.w60}`} />
    </div>
);

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, getUserId } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(false);
  const [error, setError] = useState(null);
  const [deletingPost, setDeletingPost] = useState(false);

  // The cleanup flag drops responses that arrive after the user has moved
  // on to another post.
  useEffect(() => {
    let cancelled = false;

    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);
        setPost(null);
        const postData = await apiService.getPost(id);
        if (!cancelled) setPost(postData);
      } catch (err) {
        console.error("Error loading post:", err);
        if (!cancelled) setError("Failed to load post.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const loadComments = async () => {
      try {
        setCommentsLoading(true);
        setCommentsError(false);
        setComments([]);
        const commentsData = await apiService.getComments(id);
        if (!cancelled) setComments(commentsData);
      } catch (err) {
        console.error("Error loading comments:", err);
        if (!cancelled) setCommentsError(true);
      } finally {
        if (!cancelled) setCommentsLoading(false);
      }
    };

    loadPost();
    loadComments();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleLikeToggle = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const updatedPost = await apiService.togglePostLike(id);
      setPost(updatedPost);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      setDeletingPost(true);
      await apiService.deletePost(id);
      navigate("/");
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post.");
    } finally {
      setDeletingPost(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const handleCommentDeleted = (commentId) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  };

  const canDeletePost = () => {
    if (!user || !post) return false;
    return (
        isAdmin() || (post.author?.id != null && post.author.id === getUserId())
    );
  };

  const renderBody = () => {
    if (loading) {
      return (
          <>
          <span className="sr-only" role="status">
            Loading post…
          </span>
            <PostSkeleton />
          </>
      );
    }

    if (error || !post) {
      return (
          <div className={styles.errorState} role="alert">
            <p className={styles.errorTitle}>{error || "Post not found"}</p>
          </div>
      );
    }

    return (
        <>
          <PostArticle post={post} onLikeToggle={handleLikeToggle} />

          <PostComments
              comments={comments}
              commentsLoading={commentsLoading}
              commentsError={commentsError}
              postId={id}
              user={user}
              onCommentAdded={handleCommentAdded}
              onCommentDeleted={handleCommentDeleted}
          />
        </>
    );
  };

  return (
      <main className="page">
        <PostNavigation
            onGoBack={() => navigate(-1)}
            canDelete={!loading && canDeletePost()}
            onDelete={handleDeletePost}
            isDeleting={deletingPost}
        />
        {renderBody()}
      </main>
  );
};

export default Post;
