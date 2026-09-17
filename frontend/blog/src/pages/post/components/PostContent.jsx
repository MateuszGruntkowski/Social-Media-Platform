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
    const loadImage = async () => {
      if (!post?.image?.id) return;

      try {
        setImageLoading(true);
        setImageError(false);
        const imageBlob = await apiService.getPostImage(post.image.id);
        const imageUrl = URL.createObjectURL(
          new Blob([imageBlob], {
            type: post.image.contentType,
          })
        );
        setImageData(imageUrl);
      } catch (error) {
        console.error("Error loading image:", error);
        setImageError(true);
      } finally {
        setImageLoading(false);
      }
    };

    loadImage();

    return () => {
      if (imageData) {
        URL.revokeObjectURL(imageData);
      }
    };
  }, [post?.image?.id]);

  return (
    <div className={styles.content}>
      {post?.image && (
        <div className={styles.imageContainer}>
          {imageLoading && (
              <div className={styles.imageLoading}>
                <span>Loading image...</span>
              </div>
          )}
          {imageError && (
            <div className={styles.imageError}>
              <span>Failed to load image</span>
            </div>
          )}
          {imageData && !imageError && (
            <img
              src={imageData}
              alt={post.image.fileName || post.title}
              className={styles.postImage}
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
