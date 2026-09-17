import React, { useState, useEffect } from "react";
import apiService from "../../../services/apiService";
import CategoryForm from "./CategoryForm";
import CategoryTable from "./CategoryTable";
import styles from "../styles/Categories.module.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (error) {
      setError("Error loading categories");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (categoryName) => {
    try {
      const newCategory = await apiService.createCategory({
        name: categoryName,
      });
      setCategories([...categories, newCategory]);
      setError("");
      return true;
    } catch (error) {
      setError("Error adding category");
      console.error("Error:", error);
      return false;
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await apiService.deleteCategory(id);
      setCategories(categories.filter((cat) => cat.id !== id));
      setError("");
    } catch (error) {
      setError("Error deleting category");
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
          <h1 className={styles.title}>Categories</h1>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <CategoryForm onAddCategory={handleAddCategory}/>

        <CategoryTable
          categories={categories}
          onDeleteCategory={handleDeleteCategory}
        />
      </div>
    </div>
  );
};

export default Categories;
