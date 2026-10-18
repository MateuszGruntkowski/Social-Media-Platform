import React from "react";
import { Trash2 } from "lucide-react";
import styles from "../styles/TaxonomyList.module.css";

const TaxonomyList = ({
                          items,
                          config,
                          loading,
                          loadFailed,
                          onDelete,
                          onRetry,
                      }) => {
    const handleDelete = async (id) => {
        if (!window.confirm(config.confirmDelete)) {
            return;
        }
        await onDelete(id);
    };

    if (loading) {
        return (
            <div aria-busy="true">
        <span className="sr-only" role="status">
          Loading {config.plural}…
        </span>
                <ul className={styles.list} aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                        <li key={i} className={styles.skeletonRow}>
                            <div className={`skeleton ${styles.skeletonName}`} />
                            <div className={`skeleton ${styles.skeletonCount}`} />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    if (loadFailed) {
        return (
            <div className={styles.empty} role="alert">
                <p>{config.messages.load}</p>
                <button type="button" className={styles.retry} onClick={onRetry}>
                    Try again
                </button>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className={styles.empty}>
                <p>No {config.plural}</p>
            </div>
        );
    }

    return (
        <ul className={styles.list}>
            {items.map((item) => {
                const count = item.postCount || 0;
                return (
                    <li key={item.id} className={styles.row}>
            <span className={styles.name}>
              {config.prefix && (
                  <span className={styles.prefix} aria-hidden="true">
                  {config.prefix}
                </span>
              )}
                {item.name}
            </span>
                        <span className={styles.count}>
              {count} {count === 1 ? "post" : "posts"}
            </span>
                        <button
                            type="button"
                            className={styles.delete}
                            onClick={() => handleDelete(item.id)}
                            title="Delete"
                            aria-label={`Delete ${item.name}`}
                        >
                            <Trash2 size={16} aria-hidden="true" />
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};

export default TaxonomyList;
