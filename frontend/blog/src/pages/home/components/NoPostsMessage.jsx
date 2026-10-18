import React from "react";
import styles from "../styles/NoPostsMessage.module.css";

const NoPostsMessage = () => {
    return (
        <div className={styles.container}>
            <p className={styles.text}>No posts match the selected criteria</p>
            <small className={styles.subtext}>
                Try changing filters or check back later
            </small>
        </div>
    );
};

export default NoPostsMessage;
