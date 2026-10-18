import React from "react";
import { Heart } from "lucide-react";
import styles from "./LikeButton.module.css";

const LikeButton = ({ isLiked, likesCount, onLike, disabled, size = 16 }) => {
  return (
      <button
          type="button"
          onClick={onLike}
          className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`}
          disabled={disabled}
          title={isLiked ? "Undo like" : "Like post"}
          aria-pressed={!!isLiked}
          aria-label={`${isLiked ? "Undo like" : "Like post"}, ${likesCount} likes`}
      >
        <Heart size={size} fill={isLiked ? "currentColor" : "none"} aria-hidden="true" />
        <span className={styles.likesCount}>{likesCount}</span>
      </button>
  );
};

export default LikeButton;
