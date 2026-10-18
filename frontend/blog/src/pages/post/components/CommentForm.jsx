import React, { useState } from "react";
import apiService from "../../../services/apiService";
import styles from "../styles/CommentForm.module.css";

const CommentForm = ({ postId, onCommentAdded }) => {
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      setCommentError("Comment cannot be empty");
      return;
    }

    try {
      setSubmittingComment(true);
      setCommentError(null);

      const newComment = await apiService.createComment(postId, {
        content: commentContent.trim(),
      });

      onCommentAdded(newComment);
      setCommentContent("");
    } catch (err) {
      console.error("Error creating comment:", err);
      setCommentError(err.response?.data?.message || "Failed to add comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
      <div className={styles.formWrapper}>
        <h3 className="sr-only">Add comment</h3>
        <form onSubmit={handleCommentSubmit} className={styles.form}>
        <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className={styles.textarea}
            placeholder="Enter your comment..."
            aria-label="Comment"
            rows={3}
            disabled={submittingComment}
        />

          {commentError && (
              <p className={styles.error} role="alert">
                {commentError}
              </p>
          )}

          <div className={styles.formActions}>
            <button
                type="submit"
                className={styles.submit}
                disabled={submittingComment || !commentContent.trim()}
            >
              {submittingComment ? "Adding..." : "Add Comment"}
            </button>
          </div>
        </form>
      </div>
  );
};

export default CommentForm;
