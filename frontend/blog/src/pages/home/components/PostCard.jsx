import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, MessageCircle } from "lucide-react";
import { formatDate } from "../../../utils/formatDate";
import LikeButton from "./LikeButton";
import apiService from "../../../services/apiService";
import styles from "../styles/PostCard.module.css";

const PostCard = ({ post, onLikeToggle, likingPost, user }) => {
  const navigate = useNavigate();
  const [imageData, setImageData] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Load image data if post has an image
  useEffect(() => {
    if (!post.image?.id) return;

    let cancelled = false;
    let objectUrl = null;

    const loadImage = async () => {
      try {
        setImageLoading(true);
        setImageError(false);
        const imageBlob = await apiService.getPostImage(post.image.id);
        if (cancelled) return;
        objectUrl = URL.createObjectURL(
            new Blob([imageBlob], {
              type: post.image.contentType,
            })
        );
        setImageData(objectUrl);
      } catch (error) {
        console.error("Error loading image:", error);
        if (!cancelled) setImageError(true);
      } finally {
        if (!cancelled) setImageLoading(false);
      }
    };

    loadImage();

    // Revoke the object URL created by this effect run
    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [post.image?.id]);

  const renderPostContent = (content) => {
    const truncatedContent =
        content.length > 200 ? content.substring(0, 200) + "..." : content;
    return { __html: truncatedContent };
  };

  const getReadingTimeText = (minutes) => `${minutes} min read`;

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

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
            {post.readingTime && (
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
          {post.content && (
              <div
                  className={styles.excerpt}
                  dangerouslySetInnerHTML={renderPostContent(post.content)}
              />
          )}

          {/* Image */}
          {post.image && (
              <div className={styles.image}>
                {imageLoading && <div className={styles.imageLoading} />}
                {imageError && (
                    <div className={styles.imageError}>
                      <span>Couldn't load image</span>
                    </div>
                )}
                {imageData && !imageLoading && !imageError && (
                    <img
                        src={imageData}
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
