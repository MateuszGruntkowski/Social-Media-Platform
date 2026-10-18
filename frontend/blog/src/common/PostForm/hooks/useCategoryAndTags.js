import { useState, useEffect } from "react";
import apiService from "../../../services/apiService";

/** Loads the category and tag options for the post form once. */
export const useCategoriesAndTags = () => {
    const [state, setState] = useState({
        categories: [],
        tags: [],
        loading: true,
        failed: false,
    });

    useEffect(() => {
        let cancelled = false;

        Promise.all([apiService.getCategories(), apiService.getTags()])
            .then(([categories, tags]) => {
                if (!cancelled) {
                    setState({ categories, tags, loading: false, failed: false });
                }
            })
            .catch((err) => {
                console.error("Error loading categories and tags:", err);
                if (!cancelled) {
                    setState((prev) => ({ ...prev, loading: false, failed: true }));
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return state;
};
