import React, { useId, useLayoutEffect, useRef } from "react";
import EditorToolbar from "./EditorToolbar";
import styles from "../styles/ContentEditor.module.css";

const ContentEditor = ({ content, onContentChange }) => {
  const textareaRef = useRef(null);
  const pendingSelection = useRef(null);
  const id = useId();

  // The controlled textarea resets the caret when its value changes, so the
  // selection is applied after React has committed the new content.
  useLayoutEffect(() => {
    if (pendingSelection.current && textareaRef.current) {
      const [start, end] = pendingSelection.current;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(start, end);
      pendingSelection.current = null;
    }
  }, [content]);

  const handleFormat = ({ before, after = "", line }) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;

    if (line) {
      const lineStart = content.lastIndexOf("\n", selectionStart - 1) + 1;
      pendingSelection.current = [
        selectionStart + before.length,
        selectionEnd + before.length,
      ];
      onContentChange(
          content.slice(0, lineStart) + before + content.slice(lineStart)
      );
      return;
    }

    const selected = content.slice(selectionStart, selectionEnd);
    pendingSelection.current = [
      selectionStart + before.length,
      selectionStart + before.length + selected.length,
    ];
    onContentChange(
        content.slice(0, selectionStart) +
        before +
        selected +
        after +
        content.slice(selectionEnd)
    );
  };

  return (
      <div className={styles.field}>
        <label className={styles.label} htmlFor={id}>
          Content
        </label>
        <div className={styles.editor}>
          <EditorToolbar onFormat={handleFormat} />
          <textarea
              id={id}
              ref={textareaRef}
              className={styles.textarea}
              name="content"
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Write your post here. Markdown is supported."
              required
          />
        </div>
      </div>
  );
};

export default ContentEditor;
