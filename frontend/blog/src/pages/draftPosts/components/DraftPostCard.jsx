import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ImageOff, Trash2 } from "lucide-react";
import { formatDate } from "../../../utils/formatDate";
import { getExcerpt } from "../../../utils/getExcerpt";
import { usePostImage } from "../../../hooks/usePostImage.js";
import styles from "../styles/DraftPostCard.module.css";

const DraftPostCard = ({ post, onDelete, isDeleting }) => {
  const { src, loading, error } = usePostImage(post.image);
  const excerpt = useMemo(() => getExcerpt(post.content), [post.content]);

  const title = post.title?.trim() || "Untitled draft";
  const editPath = `/edit-post/${post.id}`;
  const tags = Array.from(post.tags || []);
  const lastChange = post.updatedAt || post.createdAt;
  const dateLabel = `${post.updatedAt ? "Updated" : "Created"} ${formatDate(
      lastChange
  )}`;

  return (
      <article
          className={`${styles.draft} ${isDeleting ? styles.deleting : ""}`}
          aria-busy={isDeleting}
      >
        <div className={styles.main}>
          {lastChange && (
              <p className={styles.meta}>
                <time dateTime={lastChange}>{dateLabel}</time>
              </p>
          )}

          {/* Title — its link stretches over the whole row */}
          <h2 className={styles.title}>
            <Link to={editPath} className={styles.titleLink}>
              {title}
            </Link>
          </h2>

          {excerpt && <p className={styles.excerpt}>{excerpt}</p>}

          {(post.category || tags.length > 0) && (
              <p className={styles.taxonomy}>
                {post.category && (
                    <span className={styles.category}>{post.category.name}</span>
                )}
                {tags.map((tag) => (
                    <span key={tag.id}>#{tag.name}</span>
                ))}
              </p>
          )}

          <div className={styles.actions}>
            <Link
                to={editPath}
                className={styles.edit}
                aria-label={`Edit draft: ${title}`}
            >
              Edit
            </Link>
            <button
                type="button"
                className={styles.delete}
                onClick={() => onDelete(post)}
                disabled={isDeleting}
                aria-label={`Delete draft: ${title}`}
            >
              <Trash2 size={15} aria-hidden="true" />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {post.image && (
            <div className={styles.thumb}>
              {loading && <div className={`skeleton ${styles.thumbLoading}`} />}
              {error && (
                  <span role="img" aria-label="Failed to load image">
              <ImageOff size={18} aria-hidden="true" />
            </span>
              )}
              {src && !error && (
                  <img
                      src={src}
                      alt={post.image.fileName || title}
                      className={styles.thumbImg}
                  />
              )}
            </div>
        )}
      </article>
  );
};

export default DraftPostCard;
