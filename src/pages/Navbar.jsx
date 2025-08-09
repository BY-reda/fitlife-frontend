import React, { useState, useContext } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../css/Navbar.css";

const Navbar = ({ onJoinClick }) => {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log("USER OBJECT:", user);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    setOpen(false);
  };

  const goToUserPage = () => {
    const userId = user?._id || user?.id;
    if (userId) {
      navigate(`/app/user/${userId}`);
      setOpen(false);
    } else {
      console.warn("User ID is missing");
    }
  };

  const handleJoinClick = () => {
    if (onJoinClick) {
      onJoinClick();
    } else {
      navigate("/signup");
    }
    setOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
            <img src="/media/logo.png" alt="Logo" />
          </Link>
        </div>

        <nav className="navbar-links">
          <Link to="/app" onClick={() => setOpen(false)}>Dashboard</Link>
          <Link to="/app/workouts" onClick={() => setOpen(false)}>Training</Link>
          <Link to="/app/food" onClick={() => setOpen(false)}>Nutrition</Link>
          <Link to="/app/social" onClick={() => setOpen(false)}>Community</Link>
          <Link to="/beginner" onClick={() => setOpen(false)}>AI</Link>
        </nav>

        <div className="navbar-actions">
          {user ? (
            <>
              <button
                className="profile-icon-btn"
                onClick={goToUserPage}
                title="Profile"
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="user-avatar"
                  />
                ) : (
                  <User className="profile-icon" />
                )}
              </button>

              <button
                className="logout-btn"
                onClick={handleLogout}
                title="Log Out"
              >
                <LogOut className="logout-icon" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline" onClick={() => setOpen(false)}>
                Log In
              </Link>
              <button onClick={handleJoinClick} className="btn-filled">
                Join Now
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle mobile menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {open && <div className="mobile-menu-overlay" onClick={() => setOpen(false)} />}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${open ? 'mobile-menu-open' : ''}`}>
        <nav className="mobile-menu-content">
          <Link to="/app" onClick={() => setOpen(false)}>Dashboard</Link>
          <Link to="/app/workouts" onClick={() => setOpen(false)}>Training</Link>
          <Link to="/app/food" onClick={() => setOpen(false)}>Nutrition</Link>
          <Link to="/app/social" onClick={() => setOpen(false)}>Community</Link>
          <Link to="/beginner" onClick={() => setOpen(false)}>AI</Link>

          <div className="mobile-menu-divider"></div>

          {user ? (
            <>
              <button
                onClick={goToUserPage}
                className="mobile-menu-button"
              >
                <User className="mobile-menu-icon" /> Profile
              </button>
              <button
                onClick={handleLogout}
                className="mobile-menu-button logout-button"
              >
                <LogOut className="mobile-menu-icon" /> Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="mobile-menu-auth">
                Log In
              </Link>
              <button onClick={handleJoinClick} className="mobile-menu-join">
                Join Now
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;