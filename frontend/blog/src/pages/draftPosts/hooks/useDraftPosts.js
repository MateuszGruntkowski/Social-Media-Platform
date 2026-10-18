import { useState, useEffect, useRef, useCallback } from "react";
import apiService from "../../../services/apiService";

const NOTICE_DURATION_MS = 3000;

export const useDraftPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadFailed, setLoadFailed] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const noticeTimer = useRef(null);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setLoadFailed(false);
            setError("");
            const data = await apiService.getDraftPosts();
            setPosts(data);
        } catch (err) {
            setLoadFailed(true);
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
        return () => clearTimeout(noticeTimer.current);
    }, [load]);

    const showNotice = (message) => {
        clearTimeout(noticeTimer.current);
        setNotice(message);
        noticeTimer.current = setTimeout(() => setNotice(""), NOTICE_DURATION_MS);
    };

    const deleteDraft = async (postId) => {
        try {
            setDeletingId(postId);
            setError("");
            await apiService.deletePost(postId);
            setPosts((prev) => prev.filter((post) => post.id !== postId));
            showNotice("Draft deleted successfully");
        } catch (err) {
            console.error("Error deleting draft", err);
            setError("Failed to delete draft");
        } finally {
            setDeletingId(null);
        }
    };

    return {
        posts,
        loading,
        loadFailed,
        error,
        notice,
        deletingId,
        reload: load,
        deleteDraft,
    };
};
