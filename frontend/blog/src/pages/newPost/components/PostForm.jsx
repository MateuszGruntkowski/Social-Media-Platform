import React from "react";
import BasicFields from "../../../common/PostForm/components/BasicFields";
import CategoryAndTags from "../../../common/PostForm/components/CategoryAndTags";
import ImageUpload from "./ImageUpload";
import ContentEditor from "../../../common/PostForm/components/ContentEditor";
import styles from "../styles/PostForm.module.css";

const PostForm = ({
  formData,
  onFormDataChange,
  categories,
  tags,
  submitting,
  onSubmit,
  onCancel,
  onError,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange({ ...formData, [name]: value });
  };

  const handleTagChange = (tagId) => {
    const newTagIds = new Set(formData.tagIds);
    if (newTagIds.has(tagId)) {
      newTagIds.delete(tagId);
    } else {
      newTagIds.add(tagId);
    }
    onFormDataChange({ ...formData, tagIds: newTagIds });
  };

  const handleImageChange = (image) => {
    onFormDataChange({ ...formData, image });
  };

  const handleContentChange = (content) => {
    onFormDataChange({ ...formData, content });
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <BasicFields formData={formData} onInputChange={handleInputChange} />

      <CategoryAndTags
        formData={formData}
        categories={categories}
        tags={tags}
        onInputChange={handleInputChange}
        onTagChange={handleTagChange}
      />

      <ImageUpload
        onImageChange={handleImageChange}
        onError={onError}
      />

      <ContentEditor
        content={formData.content}
        onContentChange={handleContentChange}
      />

      <div className={styles.actions}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : "Create post"}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
