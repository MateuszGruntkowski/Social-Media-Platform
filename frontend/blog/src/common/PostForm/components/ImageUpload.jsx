import React, { useEffect, useId, useState } from "react";
import { MAX_IMAGE_SIZE } from "../utils/postFormData";
import styles from "../styles/ImageUpload.module.css";

/**
 * Image picker for new and existing posts.
 *  - image / onChange: the newly selected File
 *  - currentImage ({ src, loading, error }): the image the post already has
 *  - removeCurrent / onRemoveCurrentChange: user chose to drop that image
 */
const ImageUpload = ({
                         image,
                         onChange,
                         currentImage = null,
                         removeCurrent = false,
                         onRemoveCurrentChange,
                     }) => {
    const inputId = useId();
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!image) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(image);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [image]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        // Reset so choosing the same file again still fires onChange.
        e.target.value = "";
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            return;
        }
        if (file.size > MAX_IMAGE_SIZE) {
            setError("File is too big. The maximum size is 5MB.");
            return;
        }

        setError("");
        onChange(file);
    };

    const showCurrent = !image && currentImage && !removeCurrent;
    const currentSrc = showCurrent ? currentImage.src : null;
    const hasImage = Boolean(image || showCurrent);

    const handleRemove = () => {
        if (image) onChange(null);
        else onRemoveCurrentChange(true);
    };

    return (
        <div className={styles.field}>
            <span className={styles.label}>Image</span>

            <div className={styles.controls}>
                <input
                    id={inputId}
                    className="sr-only"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <label htmlFor={inputId} className={styles.pick}>
                    {hasImage ? "Change image" : "Add image"}
                </label>
                <span className={styles.hint}>Up to 5MB</span>
            </div>

            {error && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}

            {showCurrent && currentImage.loading && (
                <p className={styles.note} role="status">
                    Loading current image…
                </p>
            )}
            {showCurrent && currentImage.error && (
                <p className={styles.note}>
                    The current image couldn’t be loaded. It will be kept unless you
                    remove or replace it.
                </p>
            )}

            {(previewUrl || currentSrc) && (
                <div className={styles.preview}>
                    <img src={previewUrl || currentSrc} alt="Selected post image" />
                </div>
            )}

            {hasImage && (
                <button type="button" className={styles.remove} onClick={handleRemove}>
                    Remove image
                </button>
            )}

            {removeCurrent && !image && (
                <p className={styles.note}>
                    The current image will be removed when you save.{" "}
                    <button
                        type="button"
                        className={styles.undo}
                        onClick={() => onRemoveCurrentChange(false)}
                    >
                        Undo
                    </button>
                </p>
            )}
        </div>
    );
};

export default ImageUpload;
