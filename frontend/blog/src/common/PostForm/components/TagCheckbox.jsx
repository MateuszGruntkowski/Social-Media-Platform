import React from "react";
import styles from "../styles/TagCheckbox.module.css";

const TagCheckbox = ({ tag, isChecked, onChange }) => (
    <label className={styles.tag}>
        <input
            className="sr-only"
            type="checkbox"
            checked={isChecked}
            onChange={onChange}
        />
        <span className={styles.chip}>{tag.name}</span>
    </label>
);

export default TagCheckbox;
