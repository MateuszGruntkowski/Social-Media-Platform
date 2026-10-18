import React, { useState } from "react";
import styles from "../styles/TaxonomyForm.module.css";

const TaxonomyForm = ({ config, onAdd }) => {
    const [value, setValue] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!value.trim()) return;

        const names = config.parseNames(value);
        if (names.length === 0) return;

        setSubmitting(true);
        const success = await onAdd(names);
        setSubmitting(false);
        if (success) {
            setValue("");
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label} htmlFor="taxonomy-name">
                {config.inputLabel}
            </label>
            <div className={styles.row}>
                <input
                    id="taxonomy-name"
                    type="text"
                    className={styles.input}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={config.placeholder}
                    disabled={submitting}
                    required
                />
                <button
                    type="submit"
                    className={styles.submit}
                    disabled={submitting || !value.trim()}
                >
                    Add
                </button>
            </div>
            {config.helpText && <p className={styles.help}>{config.helpText}</p>}
        </form>
    );
};

export default TaxonomyForm;
