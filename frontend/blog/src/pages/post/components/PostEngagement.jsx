import React, { useState } from "react";
import LikeButton from "../../../common/LikeButton/LikeButton.jsx";
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

  return (
      <div className={styles.engagement}>
        <div className={styles.likesSection}>
          <LikeButton
              isLiked={!!post.isLikedByCurrentUser}
              likesCount={post.likesCount || 0}
              onLike={handleLikeToggle}
              disabled={likingPost}
              size={18}
          />
        </div>
      </div>
  );
};

export default PostEngagement;
