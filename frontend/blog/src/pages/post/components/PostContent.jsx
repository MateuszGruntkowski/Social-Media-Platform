import React, { useState, useEffect } from "react";
import apiService from "../../../services/apiService";
import styles from "../styles/PostContent.module.css";
import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({
  breaks: true, // Converts \n to <br>
  gfm: true, // GitHub Flavored Markdown
});

const PostContent = ({ post }) => {
  const [imageData, setImageData] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const content = post.content;

  const getMarkdownAsHtml = (markdown) => {
    const html = marked.parse(markdown || "");
    return DOMPurify.sanitize(html);
  };

  useEffect(() => {
    if (!post?.image?.id) return;

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
  }, [post?.image?.id]);

  return (
      <div className={styles.content}>
        {post?.image && (
            <div className={styles.image}>
              {imageLoading && <div className={styles.imageLoading} />}
              {imageError && (
                  <div className={styles.imageError}>
                    <span>Failed to load image</span>
                  </div>
              )}
              {imageData && !imageError && (
                  <img
                      src={imageData}
                      alt={post.image.fileName || post.title}
                      className={styles.imageEl}
                  />
              )}
            </div>
        )}

        <div
            className={styles.postText}
            dangerouslySetInnerHTML={{ __html: getMarkdownAsHtml(content) }}
        />
      </div>
  );
};

export default PostContent;
