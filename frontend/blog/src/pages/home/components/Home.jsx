import React, { useState, useEffect } from "react";
import apiService from "../../../services/apiService";
import { useAuth } from "../../../context/AuthContext";
import PostFilters from "./PostFilters";
import PostList from "./PostList";
import NoPostsMessage from "./NoPostsMessage";
import styles from "../styles/Home.module.css";

const FeedSkeleton = () => (
    <div className={styles.skeletonList} aria-hidden="true">
      {[0, 1, 2].map((i) => (
          <div key={i} className={styles.skeleton}>
            <div className={styles.skeletonAvatar} />
            <div className={styles.skeletonBody}>
              <div className={`${styles.skeletonLine} ${styles.w40}`} />
              <div className={`${styles.skeletonLine} ${styles.w80}`} />
              <div className={`${styles.skeletonLine} ${styles.w100}`} />
              <div className={`${styles.skeletonLine} ${styles.w60}`} />
            </div>
          </div>
      ))}
    </div>
);

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [likingPost, setLikingPost] = useState(null);

  const { user } = useAuth();

  const handleLikeToggle = async (postId) => {
    if (!user) {
      return;
    }

    try {
      setLikingPost(postId);
      const updatedPost = await apiService.togglePostLike(postId);
      setPosts((prevPosts) =>
          prevPosts.map((post) =>
              post.id === updatedPost.id ? updatedPost : post
          )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    } finally {
      setLikingPost(null);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedTag]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(false);
      const [postsData, categoriesData, tagsData] = await Promise.all([
        apiService.getPosts({
          ...(selectedCategory && { categoryId: selectedCategory }),
          ...(selectedTag && { tagId: selectedTag }),
        }),
        apiService.getCategories(),
        apiService.getTags(),
      ]);

      setPosts(postsData.filter((post) => post.status === "PUBLISHED"));
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError(true);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleTagChange = (tagId) => {
    setSelectedTag(tagId);
  };

  const renderFeed = () => {
    if (loading) {
      return (
          <>
          <span className={styles.srOnly} role="status">
            Loading posts…
          </span>
            <FeedSkeleton />
          </>
      );
    }

    if (error) {
      return (
          <div className={styles.state} role="alert">
            <p className={styles.stateTitle}>Couldn't load posts</p>
            <p className={styles.stateText}>Check your connection and try again.</p>
            <button type="button" className={styles.retry} onClick={loadData}>
              Try again
            </button>
          </div>
      );
    }

    if (posts.length === 0) {
      return <NoPostsMessage />;
    }

    return (
        <PostList
            posts={posts}
            onLikeToggle={handleLikeToggle}
            likingPost={likingPost}
            user={user}
        />
    );
  };

  return (
      <div className={styles.page}>
        <main className={styles.home}>
          <h1 className={styles.srOnly}>Home feed</h1>

          {hasLoaded && (
              <PostFilters
                  categories={categories}
                  tags={tags}
                  selectedCategory={selectedCategory}
                  selectedTag={selectedTag}
                  onCategoryChange={handleCategoryChange}
                  onTagChange={handleTagChange}
              />
          )}

          <div className={styles.feed} aria-busy={loading}>
            {renderFeed()}
          </div>
        </main>
      </div>
  );
};

export default Home;
