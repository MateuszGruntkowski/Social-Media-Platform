import apiService from "../../services/apiService.jsx";

// Order of the tabs on the page
export const TABS = ["categories", "tags"];

// Everything that differs between categories and tags lives here, so one
// panel / form / list can serve both. API calls, validation and messages
// are the same ones the separate pages used.
export const TAXONOMY = {
    categories: {
        label: "Categories",
        description: "Create and manage categories for your posts.",
        plural: "categories",
        inputLabel: "Category name",
        placeholder: "Enter a category name",
        helpText: null,
        prefix: "",
        confirmDelete: "Are you sure you want to delete this category?",
        messages: {
            load: "Error loading categories",
            add: "Error adding category",
            remove: "Error deleting category",
        },
        load: () => apiService.getCategories(),
        parseNames: (input) => {
            const name = input.trim();
            return name ? [name] : [];
        },
        create: async (names) => [
            await apiService.createCategory({ name: names[0] }),
        ],
        remove: (id) => apiService.deleteCategory(id),
    },
    tags: {
        label: "Tags",
        description: "Create and manage tags for your posts.",
        plural: "tags",
        inputLabel: "Tag names",
        placeholder: "Enter tag names separated by commas",
        helpText: 'Examples: "Sport, Animals, Cars"',
        prefix: "#",
        confirmDelete: "Are you sure you want to remove this tag?",
        messages: {
            load: "Error loading tags",
            add: "Error while adding tags",
            remove: "Error while deleting tag",
        },
        load: () => apiService.getTags(),
        parseNames: (input) =>
            input
                .split(",")
                .map((name) => name.trim())
                .filter((name) => name.length > 0),
        create: (names) => apiService.createTags({ names }),
        remove: (id) => apiService.deleteTag(id),
    },
};
