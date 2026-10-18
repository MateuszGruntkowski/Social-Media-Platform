import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../../services/apiService";
import PostForm from "../../../common/PostForm/components/PostForm";
import { useCategoriesAndTags } from "../../../common/PostForm/hooks/useCategoryAndTags.js";
import {
  buildPostRequest,
  createEmptyForm,
  validatePostForm,
} from "../../../common/PostForm/utils/postFormData";
import styles from "../../../common/PostForm/styles/PostEditorPage.module.css";

const NewPost = () => {
  const navigate = useNavigate();
  const options = useCategoriesAndTags();
  const [formData, setFormData] = useState(createEmptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (patch) =>
      setFormData((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const validationError = validatePostForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await apiService.createPost(buildPostRequest(formData));
      navigate("/");
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.response?.data?.message || "Error saving the post");
      setSubmitting(false);
    }
  };

  return (
      <main className="page">
        <header className={styles.header}>
          <h1 className={styles.title}>New Post</h1>
          <p className={styles.description}>Create a new post for your audience.</p>
        </header>

        {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
        )}

        <PostForm
            formData={formData}
            onChange={handleChange}
            categories={options.categories}
            tags={options.tags}
            optionsFailed={options.failed}
            submitting={submitting}
            submitLabel="Create post"
            onSubmit={handleSubmit}
            onCancel={() => navigate("/")}
        />
      </main>
  );
};

export default NewPost;
