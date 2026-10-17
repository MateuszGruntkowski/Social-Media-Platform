import React, { useState } from "react";
import { Heart } from "lucide-react";
import styles from "../styles/PostEngagement.module.css";

const PostEngagement = ({ post, onLikeToggle }) => {
  const [likingPost, setLikingPost] = useState(false);

  const handleLikeToggle = async () => {
    setLikingPost(true);
    try {
      await onLikeToggle();
    } finally {
      setLikingPost(false);
    }
  };

  const likesCount = post.likesCount || 0;
  const liked = !!post.isLikedByCurrentUser;

  return (
      <div className={styles.engagement}>
        <div className={styles.likesSection}>
          <button
              type="button"
              onClick={handleLikeToggle}
              className={`${styles.btnLike} ${liked ? styles.liked : ""}`}
              disabled={likingPost}
              title={liked ? "undo like" : "like post"}
              aria-pressed={liked}
              aria-label={`${liked ? "Undo like" : "Like post"}, ${likesCount} likes`}
          >
            <Heart
                size={18}
                fill={liked ? "currentColor" : "none"}
                aria-hidden="true"
            />
            <span className={styles.likesCount}>{likesCount}</span>
          </button>
        </div>
      </div>
  );
};

export default PostEngagement;
