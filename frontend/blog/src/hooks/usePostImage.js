import { useState, useEffect } from "react";
import apiService from "../services/apiService.jsx";

export const usePostImage = (image) => {
    const [src, setSrc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const imageId = image?.id;
    const contentType = image?.contentType;

    useEffect(() => {
        setSrc(null);
        if (!imageId) return;

        let cancelled = false;
        let objectUrl = null;

        const load = async () => {
            try {
                setLoading(true);
                setError(false);
                const blob = await apiService.getPostImage(imageId);
                if (cancelled) return;
                objectUrl = URL.createObjectURL(
                    new Blob([blob], { type: contentType })
                );
                setSrc(objectUrl);
            } catch (err) {
                console.error("Error loading image:", err);
                if (!cancelled) setError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [imageId, contentType]);

    return { src, loading, error };
};
