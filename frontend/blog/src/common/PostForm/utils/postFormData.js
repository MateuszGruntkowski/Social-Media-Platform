export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const createEmptyForm = () => ({
    title: "",
    content: "",
    status: "DRAFT",
    categoryId: "",
    tagIds: new Set(),
    image: null, // newly selected File
    removeImage: false, // edit only: drop the image the post already has
});

// The detail endpoint may return ids directly or as nested objects.
export const formFromPost = (post) => ({
    ...createEmptyForm(),
    title: post.title || "",
    content: post.content || "",
    status: post.status || "DRAFT",
    categoryId: post.categoryId ?? post.category?.id ?? "",
    tagIds: new Set(post.tagIds ?? post.tags?.map((tag) => tag.id) ?? []),
});

export const validatePostForm = ({ title, content }) => {
    if (!title.trim()) return "Title is required.";
    if (!content.trim()) return "Content is required.";
    return "";
};

/**
 * Builds the multipart body shared by createPost and updatePost.
 * Pass `id` and `hadImage` when editing an existing post.
 */
export const buildPostRequest = (formData, { id, hadImage = false } = {}) => {
    const post = {
        ...(id ? { id } : {}),
        title: formData.title.trim(),
        content: formData.content,
        status: formData.status,
        categoryId: formData.categoryId || null,
        tagIds: Array.from(formData.tagIds),
    };

    const body = new FormData();
    body.append(
        "post",
        new Blob([JSON.stringify(post)], { type: "application/json" })
    );

    if (formData.image) {
        body.append("image", formData.image);
    }
    // Only ask the backend to drop the stored image when the user removed or
    // replaced it. A failed image preview must never delete it.
    if (hadImage && (formData.removeImage || formData.image)) {
        body.append("removeCurrentImage", "true");
    }

    return body;
};
