import React from "react";
import DraftPostsList from "./DraftPostsList";
import { useDraftPosts } from "../hooks/useDraftPosts";
import styles from "../styles/DraftPosts.module.css";

const DraftPosts = () => {
  const {
    posts,
    loading,
    loadFailed,
    error,
    notice,
    deletingId,
    reload,
    deleteDraft,
  } = useDraftPosts();

  const handleDelete = (post) => {
    const confirmed = window.confirm(
        `Are you sure you want to delete the draft "${post.title}"? This action cannot be undone.`
    );
    if (confirmed) {
      deleteDraft(post.id);
    }
  };

  return (
      <main className="page">
        <header className={styles.header}>
          <h1 className={styles.title}>Drafts</h1>
          <p className={styles.description}>
            Continue working on your unpublished posts.
          </p>
        </header>

        {/* Live region stays mounted so the notice is announced when it appears */}
        <div role="status">
          {notice && <p className={styles.notice}>{notice}</p>}
        </div>
        {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
        )}

        <DraftPostsList
            posts={posts}
            loading={loading}
            loadFailed={loadFailed}
            deletingId={deletingId}
            onDelete={handleDelete}
            onRetry={reload}
        />
      </main>
  );
};

export default DraftPosts;
