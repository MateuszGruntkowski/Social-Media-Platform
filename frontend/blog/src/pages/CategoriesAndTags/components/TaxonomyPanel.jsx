import React, { useState, useEffect } from "react";
import TaxonomyForm from "./TaxonomyForm";
import TaxonomyList from "./TaxonomyList";
import styles from "../styles/TaxonomyPanel.module.css";

const TaxonomyPanel = ({ config }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadFailed, setLoadFailed] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            setLoading(true);
            setLoadFailed(false);
            setError("");
            const data = await config.load();
            setItems(data);
        } catch (err) {
            setError(config.messages.load);
            setLoadFailed(true);
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (names) => {
        try {
            const created = await config.create(names);
            setItems((prev) => [...prev, ...created]);
            setError("");
            return true;
        } catch (err) {
            setError(config.messages.add);
            console.error("Error:", err);
            return false;
        }
    };

    const handleDelete = async (id) => {
        try {
            await config.remove(id);
            setItems((prev) => prev.filter((item) => item.id !== id));
            setError("");
        } catch (err) {
            setError(config.messages.remove);
            console.error("Error:", err);
        }
    };

    return (
        <>
            <header className={styles.header}>
                <h1 className={styles.title}>{config.label}</h1>
                <p className={styles.description}>{config.description}</p>
            </header>

            <TaxonomyForm config={config} onAdd={handleAdd} />

            {error && !loadFailed && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}

            <TaxonomyList
                items={items}
                config={config}
                loading={loading}
                loadFailed={loadFailed}
                onDelete={handleDelete}
                onRetry={loadItems}
            />
        </>
    );
};

export default TaxonomyPanel;
