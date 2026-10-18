import React from "react";
import styles from "../styles/EditorToolbar.module.css";

// `line` formats apply to the start of the current line, the others wrap the selection.
const ACTIONS = [
    { label: "B", title: "Bold", before: "**", after: "**" },
    { label: "I", title: "Italic", before: "*", after: "*" },
    { label: "H1", title: "Heading 1", before: "# ", line: true },
    { label: "H2", title: "Heading 2", before: "## ", line: true },
];

const EditorToolbar = ({ onFormat }) => (
    <div className={styles.toolbar} role="toolbar" aria-label="Text formatting">
        {ACTIONS.map((action) => (
            <button
                key={action.label}
                type="button"
                className={styles.button}
                title={action.title}
                aria-label={action.title}
                onClick={() => onFormat(action)}
            >
                {action.label}
            </button>
        ))}
    </div>
);

export default EditorToolbar;
