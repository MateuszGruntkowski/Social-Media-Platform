import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/EditImageUpload.module.css";

const EditImageUpload = ({
  currentImageUrl,
  loadingImage,
  onImageChange,
  onCurrentImageRemove,
  onError,
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Cleanup function for image preview
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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
      onError(""); // Clear any previous errors
    }
  };

  const handleImageRemove = () => {
    onImageChange(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCurrentImageRemove = () => {
    if (currentImageUrl && currentImageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(currentImageUrl);
    }
    onCurrentImageRemove();
  };

  return (
    <div className="form-group">
      <label className="form-label">Image</label>
      <div className={styles.imageContainer}>
        {/* Loading indicator for image */}
        {loadingImage && (
          <div className={styles.imageLoading}>Loading image...</div>
        )}

        {/* New image upload */}
        <div className={styles.uploadSection}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.imageInput}
            id="image-upload"
          />
          <label htmlFor="image-upload" className={styles.uploadButton}>
            <span>
              {currentImageUrl || imagePreview ? "Change image" : "Add image"}
            </span>
          </label>

          {/* Unified image preview */}
          {(imagePreview || currentImageUrl) && (
            <div className={styles.imagePreview}>
              <img src={imagePreview || currentImageUrl} alt="Image preview" />
              <button
                type="button"
                onClick={
                  imagePreview ? handleImageRemove : handleCurrentImageRemove
                }
                className={styles.imageRemoveButton}
                title="Remove image"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditImageUpload;
