import React, { useState } from "react";
import { Tag, Plus } from "lucide-react";
import styles from "../styles/TagForm.module.css";

const TagForm = ({ onAddTags }) => {
  const [newTagNames, setNewTagNames] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTagNames.trim()) return;

    const tagNamesArray = newTagNames
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (tagNamesArray.length === 0) return;

    const success = await onAddTags(tagNamesArray);
    if (success) {
      setNewTagNames("");
    }
  };

  return (
    <div className={styles.form}>
      <h3 className={styles.title}>
        <Tag size={20} />
        Add new tags
      </h3>
      <form onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.group}>
            <label className="form-label">Tag names</label>
            <input
              type="text"
              className="form-input"
              value={newTagNames}
              onChange={(e) => setNewTagNames(e.target.value)}
              placeholder="Enter tag names separated by commas"
              required
            />
            <div className={styles.helpText}>
              Examples: "Sport, Animals, Cars"
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Add <Plus size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default TagForm;
