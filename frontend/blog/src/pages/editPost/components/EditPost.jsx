import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiService from "../../../services/apiService";
import PostForm from "../../../common/PostForm/components/PostForm";
import { useCategoriesAndTags } from "../../../common/PostForm/hooks/useCategoryAndTags.js";
import {
  buildPostRequest,
  formFromPost,
  validatePostForm,
} from "../../../common/PostForm/utils/postFormData";
import { usePostImage } from "../../../hooks/usePostImage.js";
import styles from "../../../common/PostForm/styles/PostEditorPage.module.css";

// Mounted once the post and the form options are loaded, so the form state
// starts from the saved post and is never overwritten by a later response.
const PostEditor = ({ id, post, options, onSaveStart, onSaved }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => formFromPost(post));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const currentImage = usePostImage(post.image);
  const hadImage = Boolean(post.image?.id);

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
    onSaveStart();

    try {
      await apiService.updatePost(
          id,
          buildPostRequest(formData, { id, hadImage })
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      onSaved();
    } catch (err) {
      console.error("Error updating post:", err);
      setError(
          err.response?.data?.message ||
          "An error occurred while updating the post."
      );
      setSubmitting(false);
    }
  };

  return (
      <>
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
            currentImage={hadImage ? currentImage : null}
            submitting={submitting}
            submitLabel="Update post"
            onSubmit={handleSubmit}
            onCancel={() => navigate("/")}
        />
      </>
  );
};

const EditPost = () => {
  const { id } = useParams();
  const options = useCategoriesAndTags();
  const [loaded, setLoaded] = useState({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    // Keep showing the saved post while it is re-fetched after a save,
    // but never show a post that belongs to a different id.
    setLoaded((prev) =>
        prev.status === "ready" && prev.id === id ? prev : { status: "loading" }
    );

    apiService
        .getPost(id)
        .then((post) => {
          if (!cancelled) {
            setLoaded({ status: "ready", id, post, version: reloadKey });
          }
        })
        .catch((err) => {
          console.error("Error fetching post:", err);
          if (!cancelled) setLoaded({ status: "error" });
        });

    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  // A post that is still a draft goes back to the drafts list, others to the post.
  let backTarget = null;
  if (loaded.status === "ready") {
    backTarget =
        loaded.post.status === "DRAFT"
            ? { to: "/posts/drafts", label: "← Back to drafts" }
            : { to: `/posts/${id}`, label: "← Back to post" };
  } else if (loaded.status === "error") {
    backTarget = { to: "/", label: "← Back to home" };
  }

  const renderBody = () => {
    if (loaded.status === "error") {
      return (
          <p className={styles.error} role="alert">
            Failed to load post data.
          </p>
      );
    }
    if (loaded.status === "loading" || options.loading) {
      return (
          <p className={styles.state} role="status">
            Loading…
          </p>
      );
    }
    return (
        <PostEditor
            key={`${loaded.id}:${loaded.version}`}
            id={id}
            post={loaded.post}
            options={options}
            onSaveStart={() => setNotice("")}
            onSaved={() => {
              setNotice("The post has been successfully updated!");
              setReloadKey((key) => key + 1);
            }}
        />
    );
  };

  return (
      <main className="page">
        <header className={styles.header}>
          {backTarget && (
              <Link className={styles.back} to={backTarget.to}>
                {backTarget.label}
              </Link>
          )}
          <h1 className={styles.title}>Edit Post</h1>
          <p className={styles.description}>
            Update your post and save your changes.
          </p>
        </header>

        {notice && (
            <p className={styles.notice} role="status">
              {notice}
            </p>
        )}

        {renderBody()}
      </main>
  );
};

export default EditPost;
