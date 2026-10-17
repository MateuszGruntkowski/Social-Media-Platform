import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { formatDate } from "../../../utils/formatDate.js";
import apiService from "../../../services/apiService";
import styles from "../styles/CommentItem.module.css";

const CommentItem = ({ comment, onCommentDeleted }) => {
  const { user, isAdmin, getUserId } = useAuth();
  const [deletingComment, setDeletingComment] = useState(false);

  const canDeleteComment = () => {
    if (!user) return false;
    return isAdmin() || comment.author.id === getUserId();
  };

  const handleDeleteComment = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      setDeletingComment(true);
      await apiService.deleteComment(comment.id);
      onCommentDeleted(comment.id);
    } catch (err) {
      console.error("Error deleting comment:", err);
    } finally {
      setDeletingComment(false);
    }
  };

  const initial = comment.author?.name?.trim().charAt(0);

  return (
      <div className={styles.comment}>
        <div className={styles.avatar} aria-hidden="true">
          {initial || "?"}
        </div>

        <div className={styles.body}>
          <div className={styles.header}>
            <span className={styles.author}>{comment.author.name}</span>
            <time className={styles.date} dateTime={comment.createdAt}>
              {formatDate(comment.createdAt)}
            </time>

            {canDeleteComment() && (
                <button
                    type="button"
                    onClick={handleDeleteComment}
                    className={styles.delete}
                    disabled={deletingComment}
                    title="Delete comment"
                    aria-label="Delete comment"
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
            )}
          </div>
          <div className={styles.content}>{comment.content}</div>
        </div>
      </div>
  );
};

export default CommentItem;
