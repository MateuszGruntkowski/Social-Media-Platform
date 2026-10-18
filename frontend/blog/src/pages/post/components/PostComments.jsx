import React from "react";
import { Link } from "react-router-dom";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";
import styles from "../styles/PostComments.module.css";

const PostComments = ({
                          comments,
                          commentsLoading,
                          commentsError,
                          postId,
                          user,
                          onCommentAdded,
                          onCommentDeleted,
                      }) => {
    return (
        <section className={styles.commentsSection}>
            <h2 className={styles.commentsTitle}>
                Comments
                <span className={styles.count}>{comments.length}</span>
            </h2>

            {user ? (
                <CommentForm postId={postId} onCommentAdded={onCommentAdded} />
            ) : (
                <div className={styles.loginPrompt}>
                    <p>
                        <Link to="/auth">Sign in</Link> to add a comment.
                    </p>
                </div>
            )}

            <CommentsList
                comments={comments}
                loading={commentsLoading}
                loadFailed={commentsError}
                onCommentDeleted={onCommentDeleted}
            />
        </section>
    );
};

export default PostComments;
