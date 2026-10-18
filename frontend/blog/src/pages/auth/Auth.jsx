import React, { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import apiService from "../../services/apiService";
import styles from "./Auth.module.css";

const getErrorMessage = (err) => {
  const { response } = err;
  if (!response) return "Network error or server is unreachable";
  if (response.data?.message) return response.data.message;
  if (response.status === 401) return "Invalid email or password";
  if (response.status === 400) return "Invalid data provided";
  return `Server error (${response.status})`;
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const idPrefix = useId();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    const email = formData.email.trim();
    try {
      const response = isLogin
          ? await apiService.login({ email, password: formData.password })
          : await apiService.register({
            email,
            password: formData.password,
            name: formData.name.trim(),
          });

      login(response);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const switchMode = () => {
    setIsLogin((prev) => !prev);
    setError("");
  };

  const title = isLogin ? "Sign in" : "Sign up";

  return (
      <main className="page">
        <div className={styles.wrapper}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>
            {isLogin
                ? "Welcome back. Sign in to like, comment and write posts."
                : "Create an account to join the conversation."}
          </p>

          {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            {!isLogin && (
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${idPrefix}-name`}>
                    Username
                  </label>
                  <input
                      id={`${idPrefix}-name`}
                      className={styles.input}
                      type="text"
                      name="name"
                      autoComplete="username"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                  />
                </div>
            )}

            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${idPrefix}-email`}>
                Email
              </label>
              <input
                  id={`${idPrefix}-email`}
                  className={styles.input}
                  type="email"
                  name="email"
                  autoComplete={isLogin ? "username" : "email"}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${idPrefix}-password`}>
                Password
              </label>
              <input
                  id={`${idPrefix}-password`}
                  className={styles.input}
                  type="password"
                  name="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
              />
            </div>

            <button className={styles.submit} type="submit" disabled={loading}>
              {loading ? "Please wait…" : title}
            </button>
          </form>

          <p className={styles.switch}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
                className={styles.switchButton}
                type="button"
                onClick={switchMode}
                disabled={loading}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </main>
  );
};

export default Auth;
