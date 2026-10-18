import React from "react";
import { Link } from "react-router-dom";
import DraftPostCard from "./DraftPostCard";
import styles from "../styles/DraftPostsList.module.css";

const SKELETON_ROWS = 3;

const DraftPostsList = ({
                            posts,
                            loading,
                            loadFailed,
                            deletingId,
                            onDelete,
                            onRetry,
                        }) => {
    if (loading) {
        return (
            <div className={styles.skeletonList} aria-busy="true">
        <span className="sr-only" role="status">
          Loading drafts…
        </span>
                <div aria-hidden="true">
                    {Array.from({ length: SKELETON_ROWS }, (_, i) => (
                        <div key={i} className={styles.skeletonRow}>
                            <div className={`skeleton ${styles.skeletonLine} ${styles.w30}`} />
                            <div className={`skeleton ${styles.skeletonLine} ${styles.w80}`} />
                            <div className={`skeleton ${styles.skeletonLine} ${styles.w60}`} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (loadFailed) {
        return (
            <div className={styles.state} role="alert">
                <p className={styles.stateTitle}>Failed to load draft posts</p>
                <button type="button" className={styles.retry} onClick={onRetry}>
                    Try again
                </button>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className={styles.state}>
                <p className={styles.stateTitle}>No drafts</p>
                <p className={styles.stateText}>
                    When you save a post as a draft, it will appear here.
                </p>
                <Link to="/posts/new" className={styles.create}>
                    New Post
                </Link>
            </div>
        );
    }

    return (
        <ul className={styles.list}>
            {posts.map((post) => (
                <li key={post.id}>
                    <DraftPostCard
                        post={post}
                        onDelete={onDelete}
                        isDeleting={deletingId === post.id}
                    />
                </li>
            ))}
        </ul>
    );
};

export default DraftPostsList;
