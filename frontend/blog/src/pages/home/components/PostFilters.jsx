import React from "react";
import styles from "../styles/PostFilters.module.css";

const PostFilters = ({
                       categories,
                       tags,
                       selectedCategory,
                       selectedTag,
                       onCategoryChange,
                       onTagChange,
                     }) => {
  return (
      <div className={styles.filters}>
        {categories.length > 0 && (
            <div
                className={styles.categories}
                role="group"
                aria-label="Filter by category"
            >
              <div className={styles.scroller}>
                <button
                    type="button"
                    className={`${styles.tab} ${
                        !selectedCategory ? styles.tabActive : ""
                    }`}
                    aria-pressed={!selectedCategory}
                    onClick={() => onCategoryChange("")}
                >
                  All
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        type="button"
                        className={`${styles.tab} ${
                            selectedCategory === category.id ? styles.tabActive : ""
                        }`}
                        aria-pressed={selectedCategory === category.id}
                        onClick={() => onCategoryChange(category.id)}
                    >
                      {category.name}
                    </button>
                ))}
              </div>
            </div>
        )}

        {tags.length > 0 && (
            <div className={styles.tags} role="group" aria-label="Filter by tag">
              <div className={styles.scroller}>
                <button
                    type="button"
                    className={`${styles.tag} ${
                        !selectedTag ? styles.tagActive : ""
                    }`}
                    aria-pressed={!selectedTag}
                    onClick={() => onTagChange("")}
                >
                  All tags
                </button>
                {tags.map((tag) => (
                    <button
                        key={tag.id}
                        type="button"
                        className={`${styles.tag} ${
                            selectedTag === tag.id ? styles.tagActive : ""
                        }`}
                        aria-pressed={selectedTag === tag.id}
                        onClick={() => onTagChange(tag.id)}
                    >
                      #{tag.name}
                    </button>
                ))}
              </div>
            </div>
        )}
      </div>
  );
};

export default PostFilters;
