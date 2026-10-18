import React, { useId } from "react";
import ContentEditor from "./ContentEditor";
import ImageUpload from "./ImageUpload";
import TagCheckbox from "./TagCheckbox";
import styles from "../styles/PostForm.module.css";

/**
 * Form shared by New Post and Edit Post. It is fully controlled: the page
 * owns `formData`, loads the options and decides what submitting does.
 * `currentImage` is only passed when editing a post that already has an image.
 */
const PostForm = ({
                      formData,
                      onChange,
                      categories,
                      tags,
                      optionsFailed = false,
                      currentImage = null,
                      submitting,
                      submitLabel,
                      onSubmit,
                      onCancel,
                  }) => {
    const id = useId();

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        onChange({ [name]: value });
    };

    const handleTagToggle = (tagId) => {
        const tagIds = new Set(formData.tagIds);
        if (tagIds.has(tagId)) tagIds.delete(tagId);
        else tagIds.add(tagId);
        onChange({ tagIds });
    };

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.field}>
                <label className={styles.label} htmlFor={`${id}-title`}>
                    Title
                </label>
                <input
                    id={`${id}-title`}
                    className={`${styles.input} ${styles.titleInput}`}
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFieldChange}
                    required
                />
            </div>

            <ContentEditor
                content={formData.content}
                onContentChange={(content) => onChange({ content })}
            />

            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor={`${id}-category`}>
                        Category
                    </label>
                    <select
                        id={`${id}-category`}
                        className={styles.input}
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleFieldChange}
                    >
                        <option value="">No category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor={`${id}-status`}>
                        Status
                    </label>
                    <select
                        id={`${id}-status`}
                        className={styles.input}
                        name="status"
                        value={formData.status}
                        onChange={handleFieldChange}
                    >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                    </select>
                </div>
            </div>

            <fieldset className={styles.tags}>
                <legend className={styles.label}>Tags</legend>
                {optionsFailed && (
                    <p className={styles.note}>Couldn’t load categories and tags.</p>
                )}
                {!optionsFailed && tags.length === 0 && (
                    <p className={styles.note}>No tags yet.</p>
                )}
                <div className={styles.tagList}>
                    {tags.map((tag) => (
                        <TagCheckbox
                            key={tag.id}
                            tag={tag}
                            isChecked={formData.tagIds.has(tag.id)}
                            onChange={() => handleTagToggle(tag.id)}
                        />
                    ))}
                </div>
            </fieldset>

            <ImageUpload
                image={formData.image}
                onChange={(image) => onChange({ image })}
                currentImage={currentImage}
                removeCurrent={formData.removeImage}
                onRemoveCurrentChange={(removeImage) => onChange({ removeImage })}
            />

            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.cancel}
                    onClick={onCancel}
                    disabled={submitting}
                >
                    Cancel
                </button>
                <button type="submit" className={styles.submit} disabled={submitting}>
                    {submitting ? "Saving…" : submitLabel}
                </button>
            </div>
        </form>
    );
};

export default PostForm;
