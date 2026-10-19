import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FileText, LogOut, PenLine } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Navbar.module.css";

const linkClass = ({ isActive }) =>
    `${styles.link} ${isActive ? styles.active : ""}`;

const actionClass = ({ isActive }) =>
    `${styles.action} ${isActive ? styles.actionActive : ""}`;

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const admin = isAdmin();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
      <nav className={styles.navbar} aria-label="Main">
        <div className={styles.inner}>
          <div className={styles.left}>
            <Link to="/" className={styles.brand}>
              Social Platform
            </Link>
            {user && admin && <span className={styles.admin}>Admin</span>}
          </div>

          {admin && (
              <ul className={styles.links}>
                <li>
                  <NavLink to="/categories-tags" className={linkClass}>
                    Categories &amp; Tags
                  </NavLink>
                </li>
              </ul>
          )}

          <div className={styles.actions}>
            {user ? (
                <>
                  <NavLink
                      to="/posts/drafts"
                      className={actionClass}
                      title="Draft Posts"
                  >
                    <FileText size={16} className={styles.icon} aria-hidden="true" />
                    <span className={styles.actionLabel}>Draft Posts</span>
                  </NavLink>
                  <Link to="/posts/new" className={styles.primary} title="New Post">
                    <PenLine size={16} className={styles.icon} aria-hidden="true" />
                    <span className={styles.actionLabel}>New Post</span>
                  </Link>
                  <button
                      type="button"
                      className={styles.action}
                      onClick={handleLogout}
                      title="Logout"
                  >
                    <LogOut size={16} className={styles.icon} aria-hidden="true" />
                    <span className={styles.actionLabel}>Logout</span>
                  </button>
                </>
            ) : (
                <Link to="/auth" className={styles.primary}>
                  Login / Register
                </Link>
            )}
          </div>
        </div>
      </nav>
  );
};

export default Navbar;
