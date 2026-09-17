import React, { useState, useRef } from "react";
import styles from "../styles/ImageUpload.module.css";

const ImageUpload = ({ onImageChange, onError }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        onError("Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        onError("File is too big. The maximum size is 5MB.");
        return;
      }

      onImageChange(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      onError("");
    }
  };

  const handleImageRemove = () => {
    onImageChange(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">Image</label>
      <div className={styles.imageUploadContainer}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.imageInput}
          id="image-upload"
        />
        <label htmlFor="image-upload" className={styles.imageUploadButton}>
          <span>Add image</span>
        </label>

        {imagePreview && (
          <div className={styles.imagePreview}>
            <img src={imagePreview} alt="Image preview" />
            <button
              type="button"
              onClick={handleImageRemove}
              className={styles.imageRemoveButton}
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
