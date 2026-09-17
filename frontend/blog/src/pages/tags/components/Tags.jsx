import React, { useState, useEffect } from "react";
import apiService from "../../../services/apiService";
import TagForm from "./TagForm";
import TagTable from "./TagTable";
import styles from "../styles/Tags.module.css";

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTags();
      setTags(data);
    } catch (error) {
      setError("Error loading tags");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTags = async (tagNamesArray) => {
    try {
      const newTags = await apiService.createTags({ names: tagNamesArray });
      setTags([...tags, ...newTags]);
      setError("");
      return true;
    } catch (error) {
      setError("Error while adding tags");
      console.error("Error:", error);
      return false;
    }
  };

  const handleDeleteTag = async (id) => {
    try {
      await apiService.deleteTag(id);
      setTags(tags.filter((tag) => tag.id !== id));
      setError("");
    } catch (error) {
      setError("Error while deleting tag");
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Tags</h1>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <TagForm onAddTags={handleAddTags}/>

        <TagTable tags={tags} onDeleteTag={handleDeleteTag} />
      </div>
    </div>
  );
};

export default Tags;
