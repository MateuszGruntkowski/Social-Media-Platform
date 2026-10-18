import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, MessageCircle } from "lucide-react";
import { formatDate } from "../../../utils/formatDate";
import { getExcerpt } from "../../../utils/getExcerpt";
import { usePostImage } from "../../../hooks/usePostImage.js";
import LikeButton from "../../../common/LikeButton/LikeButton.jsx";
import styles from "../styles/PostCard.module.css";

const PostCard = ({ post, onLikeToggle, likingPost, user }) => {
  const navigate = useNavigate();
  const {
    src: imageSrc,
    loading: imageLoading,
    error: imageError,
  } = usePostImage(post.image);

  const excerpt = useMemo(() => getExcerpt(post.content), [post.content]);

  const getReadingTimeText = (minutes) => `${minutes} min read`;

  const handleLikeClick = () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    onLikeToggle(post.id);
  };

  const authorName = post.author?.name || "Author unknown";
  const initial = post.author?.name?.trim().charAt(0);
  const commentsCount = post.commentsCount || 0;

  return (
      <article className={styles.post}>
        <div className={styles.avatar} aria-hidden="true">
          {initial || <User size={16} />}
        </div>

        <div className={styles.body}>
          {/* Author + secondary metadata */}
          <header className={styles.meta}>
            <span className={styles.author}>{authorName}</span>
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
            {post.readingTime > 0 && (
                <span>{getReadingTimeText(post.readingTime)}</span>
            )}
          </header>

          {/* Title — its link stretches over the whole row */}
          <h2 className={styles.title}>
            <Link to={`/posts/${post.id}`} className={styles.titleLink}>
              {post.title}
            </Link>
          </h2>

          {/* Excerpt */}
          {excerpt && <p className={styles.excerpt}>{excerpt}</p>}

          {/* Image */}
          {post.image && (
              <div className={styles.image}>
                {imageLoading && (
                    <div className={`skeleton ${styles.imageLoading}`} />
                )}
                {imageError && (
                    <div className={styles.imageError}>
                      <span>Couldn't load image</span>
                    </div>
                )}
                {imageSrc && !imageLoading && !imageError && (
                    <img
                        src={imageSrc}
                        alt={post.image.fileName || post.title}
                        className={styles.imageEl}
                        loading="lazy"
                    />
                )}
              </div>
          )}

          {/* Category + tags */}
          {(post.category || (post.tags && post.tags.length > 0)) && (
              <p className={styles.taxonomy}>
                {post.category && (
                    <span className={styles.category}>{post.category.name}</span>
                )}
                {post.tags &&
                    post.tags.map((tag) => (
                        <span key={tag.id} className={styles.tag}>
                  #{tag.name}
                </span>
                    ))}
              </p>
          )}

          {/* Interaction row */}
          <div className={styles.actions}>
            <LikeButton
                isLiked={post.isLikedByCurrentUser}
                likesCount={post.likesCount || 0}
                onLike={handleLikeClick}
                disabled={likingPost === post.id}
            />

            <span
                className={styles.comments}
                aria-label={`${commentsCount} comments`}
            >
            <MessageCircle size={16} aria-hidden="true" />
            <span>{commentsCount}</span>
          </span>
          </div>
        </div>
      </article>
  );
};

export default PostCard;
