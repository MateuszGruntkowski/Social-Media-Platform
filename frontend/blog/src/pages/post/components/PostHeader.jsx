import React from "react";
import { formatDate } from "../../../utils/formatDate.js";
import styles from "../styles/PostHeader.module.css";

const PostHeader = ({ post }) => {
    const getReadingTimeText = (minutes) => `${minutes} min read`;

    const authorName = post.author?.name || "Author unknown";
    const initial = post.author?.name?.trim().charAt(0);
    const tags = post.tags ? Array.from(post.tags) : [];

    return (
        <header className={styles.header}>
            <div className={styles.author}>
                <div className={styles.avatar} aria-hidden="true">
                    {initial || "?"}
                </div>
                <div className={styles.authorText}>
                    <span className={styles.name}>{authorName}</span>
                    <div className={styles.meta}>
                        <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                        {post.readingTime && (
                            <span>{getReadingTimeText(post.readingTime)}</span>
                        )}
                    </div>
                </div>
            </div>

            <h1 className={styles.title}>{post.title}</h1>

            {(post.category || tags.length > 0) && (
                <p className={styles.taxonomy}>
                    {post.category && (
                        <span className={styles.category}>{post.category.name}</span>
                    )}
                    {tags.map((tag) => (
                        <span key={tag.id} className={styles.tag}>
              #{tag.name}
            </span>
                    ))}
                </p>
            )}
        </header>
    );
};

export default PostHeader;
