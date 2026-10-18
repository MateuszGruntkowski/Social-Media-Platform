import React, { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { usePostImage } from "../../../hooks/usePostImage.js";
import styles from "../styles/PostContent.module.css";

// breaks: newline -> <br>; gfm: GitHub Flavored Markdown.
// Passed per call, not via marked.setOptions, so other markdown consumers
// (e.g. getExcerpt) are not affected by this component being imported.
const MARKED_OPTIONS = { breaks: true, gfm: true };

const renderMarkdown = (markdown) =>
    DOMPurify.sanitize(marked.parse(markdown || "", MARKED_OPTIONS));

const PostContent = ({ post }) => {
  const { src, loading, error } = usePostImage(post.image);
  const html = useMemo(() => renderMarkdown(post.content), [post.content]);

  return (
      <div className={styles.content}>
        {post.image && (
            <div className={styles.image}>
              {loading && <div className={`skeleton ${styles.imageLoading}`} />}
              {error && (
                  <div className={styles.imageError}>
                    <span>Failed to load image</span>
                  </div>
              )}
              {src && !error && (
                  <img
                      src={src}
                      alt={post.image.fileName || post.title}
                      className={styles.imageEl}
                  />
              )}
            </div>
        )}

        <div
            className={styles.postText}
            dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
  );
};

export default PostContent;
