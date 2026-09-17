import React, { useState } from "react";
import { Folder, Plus } from "lucide-react";
import styles from "../styles/CategoryForm.module.css";

const CategoryForm = ({ onAddCategory }) => {
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const success = await onAddCategory(newCategoryName.trim());
    if (success) {
      setNewCategoryName("");
    }
  };

  return (
    <div className={styles.form}>
      <h3 className={styles.title}>
        <Folder size={20} />
        Add new category
      </h3>
      <form onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.group}>
            <label className="form-label">Category name</label>
            <input
              type="text"
              className="form-input"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter a category name"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add <Plus size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
