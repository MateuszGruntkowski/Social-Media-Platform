import React from "react";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";
import styles from "../styles/PostComments.module.css";

const PostComments = ({
                          comments,
                          commentsLoading,
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
                        <a href="/login">Sign in</a> to add a comment.
                    </p>
                </div>
            )}

            <CommentsList
                comments={comments}
                loading={commentsLoading}
                onCommentDeleted={onCommentDeleted}
            />
        </section>
    );
};

export default PostComments;
