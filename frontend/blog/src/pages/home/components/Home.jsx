import React, { useState, useEffect } from "react";
import apiService from "../../../services/apiService";
import { useAuth } from "../../../context/AuthContext";
import PostFilters from "./PostFilters";
import PostList from "./PostList";
import NoPostsMessage from "./NoPostsMessage";
import styles from "../styles/Home.module.css";

const FeedSkeleton = () => (
    <div aria-hidden="true">
      {[0, 1, 2].map((i) => (
          <div key={i} className={styles.skeletonRow}>
            <div className={`skeleton ${styles.skeletonAvatar}`} />
            <div className={styles.skeletonBody}>
              <div className={`skeleton ${styles.skeletonLine} ${styles.w40}`} />
              <div className={`skeleton ${styles.skeletonLine} ${styles.w80}`} />
              <div className={`skeleton ${styles.skeletonLine} ${styles.w100}`} />
              <div className={`skeleton ${styles.skeletonLine} ${styles.w60}`} />
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
  const [filtersLoaded, setFiltersLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [likingPost, setLikingPost] = useState(null);
  // Bumped by "Try again" to re-run both loading effects
  const [reloadKey, setReloadKey] = useState(0);

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

  // Categories and tags don't change when a filter is clicked, so they are
  // loaded once (and again only on retry).
  useEffect(() => {
    let cancelled = false;

    const loadFilters = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          apiService.getCategories(),
          apiService.getTags(),
        ]);
        if (cancelled) return;
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (err) {
        console.error("Error loading filters:", err);
      } finally {
        if (!cancelled) setFiltersLoaded(true);
      }
    };

    loadFilters();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // The cleanup flag drops responses to superseded requests, so a slow
  // earlier filter can't overwrite the result of a later one.
  useEffect(() => {
    let cancelled = false;

    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(false);
        const postsData = await apiService.getPosts({
          ...(selectedCategory && { categoryId: selectedCategory }),
          ...(selectedTag && { tagId: selectedTag }),
        });
        if (cancelled) return;
        setPosts(postsData.filter((post) => post.status === "PUBLISHED"));
      } catch (err) {
        console.error("Error loading posts:", err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, [selectedCategory, selectedTag, reloadKey]);

  const renderFeed = () => {
    if (loading) {
      return (
          <>
          <span className="sr-only" role="status">
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
            <button
                type="button"
                className={styles.retry}
                onClick={() => setReloadKey((key) => key + 1)}
            >
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
      <main className="page">
        <h1 className="sr-only">Home feed</h1>

        {filtersLoaded && (
            <PostFilters
                categories={categories}
                tags={tags}
                selectedCategory={selectedCategory}
                selectedTag={selectedTag}
                onCategoryChange={setSelectedCategory}
                onTagChange={setSelectedTag}
            />
        )}

        <div aria-busy={loading}>{renderFeed()}</div>
      </main>
  );
};

export default Home;
