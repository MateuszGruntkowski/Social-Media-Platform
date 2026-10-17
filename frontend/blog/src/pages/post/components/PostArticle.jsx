import React from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostEngagement from "./PostEngagement";
import styles from "../styles/PostArticle.module.css";

const PostArticle = ({ post, onLikeToggle }) => {
    return (
        <article className={styles.article}>
            <PostHeader post={post} />
            <PostContent post={post} />
            <PostEngagement post={post} onLikeToggle={onLikeToggle} />
        </article>
    );
};

export default PostArticle;
