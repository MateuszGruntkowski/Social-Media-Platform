import React from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import styles from "../styles/PostNavigation.module.css";

const PostNavigation = ({ onGoBack, canDelete, onDelete, isDeleting }) => {
    return (
        <div className={styles.navigation}>
            <button type="button" onClick={onGoBack} className={styles.back}>
                <ArrowLeft size={16} aria-hidden="true" />
                Back
            </button>

            {canDelete && (
                <button
                    type="button"
                    onClick={onDelete}
                    className={styles.delete}
                    disabled={isDeleting}
                >
                    <Trash2 size={16} aria-hidden="true" />
                    {isDeleting ? "Deleting..." : "Delete post"}
                </button>
            )}
        </div>
    );
};

export default PostNavigation;
