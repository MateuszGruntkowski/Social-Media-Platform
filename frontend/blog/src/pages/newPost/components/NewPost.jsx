import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../../services/apiService";
import PostForm from "./PostForm";
import styles from "../styles/NewPost.module.css";

const NewPost = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "DRAFT",
    categoryId: "",
    tagIds: new Set(),
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          apiService.getCategories(),
          apiService.getTags(),
        ]);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error("Error loading data", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const submitData = new FormData();

      const postData = {
        title: formData.title,
        content: formData.content,
        status: formData.status,
        categoryId: formData.categoryId || null,
        tagIds: Array.from(formData.tagIds),
      };

      submitData.append(
        "post",
        new Blob([JSON.stringify(postData)], {
          type: "application/json",
        })
      );

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      await apiService.createPost(submitData);
      navigate("/");
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.response?.data?.message || "Error saving the post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => navigate("/");

  const handleFormDataChange = (newData) => {
    setFormData(newData);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="container">
      <div className={styles.container}>
        <h1 className={styles.title}>New post</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <PostForm
          formData={formData}
          onFormDataChange={handleFormDataChange}
          categories={categories}
          tags={tags}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onError={handleError}
        />
      </div>
    </div>
  );
};

export default NewPost;
