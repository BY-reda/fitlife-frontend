import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit } from "react-feather"; // Pen icon
import api from "../api/client";
import "../css/User.css";

const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp&f=y";

const getUserImageUrl = (profileImage) => {
  if (!profileImage) return defaultAvatar;
  if (profileImage.startsWith("http") || profileImage.startsWith("data")) {
    return profileImage;
  }
  return `http://localhost:5000/${profileImage.replace(/^\/+/g, "")}`;
};

export default function User() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUserData = async () => {
      let userRes;

      try {
        userRes = await api.get(`/users/${userId}`);
        setUser(userRes.data);
      } catch (err) {
        console.error("Error fetching user:", err.response?.data || err.message);
        setError("Failed to load user profile.");
        return;
      }

      try {
        const postsRes = await api.get(`/posts/user/${userId}`);
        console.log("Posts from backend:", postsRes.data);

        // Normalize post.user to string user ID
        const normalizedPosts = postsRes.data.map(post => ({
          ...post,
          user: typeof post.user === "object" && post.user !== null ? post.user._id : post.user,
          comments: post.comments?.map(comment => ({
            ...comment,
            user: typeof comment.user === "object" && comment.user !== null ? comment.user._id : comment.user,
          })) || [],
        }));
        setPosts(normalizedPosts);

        const initialCommentInputs = {};
        const initialShowComments = {};
        normalizedPosts.forEach(post => {
          initialCommentInputs[post._id] = "";
          initialShowComments[post._id] = false;
        });
        setCommentInputs(initialCommentInputs);
        setShowComments(initialShowComments);
      } catch (err) {
        console.error("Error fetching posts:", err.response?.data || err.message);
      }

      try {
        if (token) {
          const currentUserRes = await api.get("/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Current user ID:", currentUserRes.data._id);
          setCurrentUserId(currentUserRes.data._id);

          // Compare as strings
          setIsFollowing(
            userRes.data.followers.some(
              (followerId) => followerId.toString() === currentUserRes.data._id.toString()
            )
          );
        }
      } catch (err) {
        console.error("Error fetching current user:", err.response?.data || err.message);
      }
    };

    fetchUserData();
  }, [userId]);

  // DELETE POST
  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err.response?.data || err.message);
    }
  };

  // FOLLOW / UNFOLLOW
  const handleFollow = async () => {
    const token = localStorage.getItem("token");
    try {
      await api.post(`/users/follow/${user._id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(true);
      setUser((prev) => ({
        ...prev,
        followers: [...prev.followers, currentUserId],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfollow = async () => {
    const token = localStorage.getItem("token");
    try {
      await api.post(`/users/unfollow/${user._id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(false);
      setUser((prev) => ({
        ...prev,
        followers: prev.followers.filter((id) => id.toString() !== currentUserId.toString()),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // LIKE POST
  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.post(`/posts/like/${postId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(posts.map(post => {
        if (post._id === postId) {
          // likes array from backend
          const likesArray = response.data.likes || [];
          return {
            ...post,
            likes: likesArray,
            isLiked: likesArray.some(id => id.toString() === currentUserId.toString()),
          };
        }
        return post;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // COMMENT INPUT CHANGE
  const handleCommentChange = (postId, value) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: value,
    }));
  };

  // ADD COMMENT
  const handleAddComment = async (postId) => {
    const token = localStorage.getItem("token");
    if (!commentInputs[postId]?.trim()) return;

    try {
      const response = await api.post(
        `/posts/comment/${postId}`,
        { text: commentInputs[postId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: response.data.comments,
          };
        }
        return post;
      }));

      setCommentInputs(prev => ({
        ...prev,
        [postId]: "",
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // TOGGLE COMMENTS VISIBILITY
  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  if (error) return <p>{error}</p>;
  if (!user || currentUserId === null) return <p>Loading user profile...</p>;

  return (
    <div className="user-profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img
            src={getUserImageUrl(user.profileImage)}
            alt={user.username}
            className="profile-avatar"
          />
        </div>

        <div className="profile-info">
          <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
            <h1 className="profile-username">{user.username}</h1>

            {/* Edit Profile Button - only current user */}
            {currentUserId.toString() === user._id.toString() && (
              <button
                onClick={() => navigate("/app/profile")}
                className="edit-profile-button"
                title="Edit Profile"
              >
                <Edit size={18} />
              </button>
            )}

            {/* Follow Button - only other users */}
            {currentUserId.toString() !== user._id.toString() && (
              <button
                onClick={isFollowing ? handleUnfollow : handleFollow}
                className={`follow-button ${isFollowing ? "following" : ""}`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <span><strong>{posts.length}</strong> posts</span>
            </div>
            <div className="profile-stat">
              <span><strong>{user.followers?.length || 0}</strong> followers</span>
            </div>
            <div className="profile-stat">
              <span><strong>{user.following?.length || 0}</strong> following</span>
            </div>
          </div>

          <div>
            <p className="profile-bio">
              <span className="profile-bio-username">{user.username}</span>
              <br />
              {user.bio || "No bio available"}
            </p>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="posts-grid">
        {posts.length === 0 ? (
          <div className="empty-profile">
            <div className="empty-icon">
              <svg aria-label="Camera" fill="#262626" height="24" viewBox="0 0 48 48" width="24">
                <path d="M24 32.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zm0-14a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm12.5-9h-25A2.5 2.5 0 0 0 9 12v24a2.5 2.5 0 0 0 2.5 2.5h25a2.5 2.5 0 0 0 2.5-2.5V12a2.5 2.5 0 0 0-2.5-2.5zm-17 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm19 24.5a.5.5 0 0 1-.5.5h-25a.5.5 0 0 1-.5-.5V19h26v13.5zm0-16h-26V12a.5.5 0 0 1 .5-.5h25a.5.5 0 0 1 .5.5v3.5z"></path>
              </svg>
            </div>
            <h2 className="empty-title">No Posts Yet</h2>
            <p className="empty-message">
              When {user.username} shares photos and videos, you'll see them here.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-item">
              {post.imageUrl ? (
                <img
                  src={`http://localhost:5000/${post.imageUrl.replace(/^\/+/g, "")}`}
                  alt="Post"
                  className="post-image"
                />
              ) : (
                <div className="post-text">
                  <p>{post.text}</p>
                </div>
              )}

              {/* Debug log to check user IDs */}
              {console.log("currentUserId, post.user:", currentUserId, post.user)}

              {/* Delete button only for user's own posts */}
              {currentUserId.toString() === user._id.toString() &&
               post.user.toString() === currentUserId.toString() && (
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="delete-post-button"
                >
                  🗑 Delete
                </button>
              )}

              {post.images?.length > 1 && (
                <div className="post-indicator">
                  <svg aria-label="Carousel" fill="currentColor" height="22" viewBox="0 0 48 48" width="22">
                    <path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"></path>
                  </svg>
                </div>
              )}

              {post.isVideo && (
                <div className={`post-indicator ${post.images?.length > 1 ? "video" : ""}`}>
                  <svg aria-label="Video" fill="currentColor" height="22" viewBox="0 0 48 48" width="22">
                    <path d="M16 10c-3.3 0-6 2.7-6 6v16c0 3.3 2.7 6 6 6h16c3.3 0 6-2.7 6-6V16c0-3.3-2.7-6-6-6H16zm19.1 16.5L27 31.9c-.7.4-1.6 0-1.6-.8V16.9c0-.8.8-1.2 1.6-.8l8.1 5.4c.7.5.7 1.4 0 2z"></path>
                  </svg>
                </div>
              )}

              <div className="post-overlay">
                <div
                  className="overlay-stat"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(post._id);
                  }}
                >
                  <svg
                    aria-label="Like"
                    fill={post.isLiked ? "#ed4956" : "currentColor"}
                    height="24"
                    viewBox="0 0 48 48"
                    width="24"
                  >
                    <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                  </svg>
                  <span>{post.likes?.length || 0}</span>
                </div>

                <div
                  className="overlay-stat"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComments(post._id);
                  }}
                >
                  <svg aria-label="Comment" fill="currentColor" height="24" viewBox="0 0 48 48" width="24">
                    <path d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z"></path>
                  </svg>
                  <span>{post.comments?.length || 0}</span>
                </div>
              </div>

              {showComments[post._id] && (
                <div className="comments-container">
                  <div className="comments-list">
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((comment) => (
                        <div key={comment._id} className="comment-item">
                          <strong>{comment.user?.username || "Unknown"}:</strong> {comment.text}
                        </div>
                      ))
                    ) : (
                      <p>No comments yet.</p>
                    )}
                  </div>

                  <div className="add-comment-container">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[post._id] || ""}
                      onChange={(e) => handleCommentChange(post._id, e.target.value)}
                      className="comment-input"
                    />
                    <button
                      onClick={() => handleAddComment(post._id)}
                      className="comment-submit-button"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
