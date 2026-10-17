import React from "react";
import PostCard from "./PostCard";
import styles from "../styles/PostList.module.css";

const PostList = ({ posts, onLikeToggle, likingPost, user }) => {
  return (
      <div className={styles.postList}>
        {posts.map((post) => (
            <PostCard
                key={post.id}
                post={post}
                onLikeToggle={onLikeToggle}
                likingPost={likingPost}
                user={user}
            />
        ))}
      </div>
  );
};

export default PostList;
