import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import "../css/social.css";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import getImageUrl from "../utils/getImageUrl";

const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp&f=y";

// Return the full image URL or data URI


const getUserImageUrl = (profileImage) => {
  if (!profileImage) return defaultAvatar;
  if (profileImage.startsWith("http") || profileImage.startsWith("data")) {
    return profileImage;
  }
  return getImageUrl(profileImage);
};

const Social = () => {
  const navigate = useNavigate();

  const [currentUserId, setCurrentUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImageFile, setNewPostImageFile] = useState(null);
  const [newPostImageUrl, setNewPostImageUrl] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const token = localStorage.getItem("token");

  const [commentBoxes, setCommentBoxes] = useState({});
  const [commentTexts, setCommentTexts] = useState({});
  const [commentImageFiles, setCommentImageFiles] = useState({});
  const [commentImageUrls, setCommentImageUrls] = useState({});

  const [editingComment, setEditingComment] = useState({ postId: null, commentId: null });
  const [editCommentText, setEditCommentText] = useState("");

  // State for comment action menu (3-dot) open/close per comment
  const [commentMenuOpen, setCommentMenuOpen] = useState({}); // { [commentId]: true/false }

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) return;
      try {
        const currentUserRes = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(currentUserRes.data._id);
      } catch (err) {
        console.error("Error fetching current user:", err);
        setCurrentUserId(null);
      }
    };
    fetchCurrentUser();
  }, [token]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!newPostText.trim() && !newPostImageFile) {
      return setMessage({ text: "Text or image required", type: "error" });
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("text", newPostText);
      if (newPostImageFile) formData.append("image", newPostImageFile);

      await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewPostText("");
      setNewPostImageFile(null);
      setNewPostImageUrl("");
      setShowEmojiPicker(false);
      setMessage({ text: "Post created!", type: "success" });
      fetchPosts();
    } catch (err) {
      console.error("Post error:", err);
      setMessage({
        text: err.response?.data?.message || "Failed to post.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/posts/${postId}/like`);
      fetchPosts();
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const toggleCommentBox = (postId) => {
    setCommentBoxes((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentTextChange = (postId, text) => {
    setCommentTexts((prev) => ({ ...prev, [postId]: text }));
  };

  const handleCommentImageChange = (postId, file) => {
    if (!file) return;
    setCommentImageFiles((prev) => ({ ...prev, [postId]: file }));
    setCommentImageUrls((prev) => ({
      ...prev,
      [postId]: URL.createObjectURL(file),
    }));
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();

    const text = commentTexts[postId]?.trim() || "";
    const imageFile = commentImageFiles[postId] || null;

    if (!text && !imageFile) {
      alert("Please enter text or upload an image for the comment.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", text);
      if (imageFile) formData.append("image", imageFile);

      await api.post(`/posts/${postId}/comments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
      setCommentImageFiles((prev) => ({ ...prev, [postId]: null }));
      setCommentImageUrls((prev) => ({ ...prev, [postId]: "" }));
      setCommentBoxes((prev) => ({ ...prev, [postId]: false }));

      fetchPosts();
    } catch (err) {
      console.error("Comment error:", err);
      alert("Failed to post comment");
    }
  };

  // Ownership check for comments and posts
  const isOwner = (userId) => {
    if (!userId || !currentUserId) {
      return false;
    }
    return userId.toString() === currentUserId.toString();
  };

  // Navigation helper
  const goToUserPage = (userId) => {
    if (userId) navigate(`/app/user/${userId}`);
  };

  // Edit and Delete handlers for comments
  const handleEditComment = (postId, commentId) => {
    const post = posts.find((p) => p._id === postId);
    const comment = post?.comments.find((c) => c._id === commentId);
    if (comment && isOwner(comment.user?._id)) {
      setEditingComment({ postId, commentId });
      setEditCommentText(comment.text);
      // Close the 3-dot menu on open edit
      setCommentMenuOpen((prev) => ({ ...prev, [commentId]: false }));
    } else {
      alert("You can only edit your own comments.");
    }
  };

  const cancelEdit = () => {
    setEditingComment({ postId: null, commentId: null });
    setEditCommentText("");
  };

  const submitEditComment = async () => {
    if (!editCommentText.trim()) {
      alert("Comment text cannot be empty.");
      return;
    }

    try {
      const { postId, commentId } = editingComment;

      await api.put(`/posts/${postId}/comments/${commentId}`, {
        text: editCommentText.trim(),
      });
      setEditingComment({ postId: null, commentId: null });
      setEditCommentText("");
      fetchPosts();
    } catch (err) {
      console.error("Error updating comment:", err);
      alert("Failed to update comment");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await api.delete(`/posts/${postId}/comments/${commentId}`);
      fetchPosts(); // Refresh posts list
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment");
    }
  };

  // Toggle 3-dot menu open/close per comment
  const toggleCommentMenu = (commentId) => {
    setCommentMenuOpen((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Close menus when clicking outside (optional, you can add useEffect for that)

  return (
    <div className="social-container">
      {/* Post creation form */}
      <div className="post-creator">
        <form onSubmit={handlePostSubmit} className="post-form-modern">
          <div className="post-input-zone">
            <input
            type="text"
              className="post-textarea"
              placeholder="Share your fitness journey..."
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
            />
            {newPostImageUrl && (
              <img src={newPostImageUrl} alt="preview" className="preview-img" />
            )}
          </div>

          <div className="post-bottom">
            <div className="post-actions-left">
              <label className="action-btn">
                📷 Photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setNewPostImageFile(file);
                      setNewPostImageUrl(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>

              <div className="emoji-wrapper">
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                  😊 Feeling
                </button>
                {showEmojiPicker && (
                  <div className="emoji-dropdown">
                    <EmojiPicker
                      onEmojiClick={(emojiData) =>
                        setNewPostText((prev) => prev + emojiData.emoji)
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="post-submit-btn" disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </button>
          </div>

          {message && <p className={`message ${message.type}`}>{message.text}</p>}
        </form>
      </div>

      {/* Posts feed */}
      <div className="post-feed">
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => {
            const postOwnerId = post.user?._id || null;

            return (
              <div key={post._id} className="post-card">
                <div className="post-header">
                  <img
                    src={getUserImageUrl(post.user?.profileImage)}
                    alt={post.user?.username || "Anonymous"}
                    className="profile-image"
                    onClick={() => goToUserPage(post.user?._id)}
                    style={{ cursor: "pointer" }}
                  />
                  <strong
                    onClick={() => goToUserPage(post.user?._id)}
                    style={{ cursor: "pointer" }}
                  >
                    {post.user?.username || "Anonymous"}
                  </strong>

                  {/* Show Edit/Delete post buttons only if current user owns the post */}
                  {isOwner(postOwnerId) && (
                    <div className="post-actions">
                      {/* You can add edit post feature here if needed */}
                    </div>
                  )}
                </div>
                <div className="post-body">
                  <p>{post.text}</p>
                  {post.imageUrl && (
               <img
  src={getImageUrl(post.imageUrl)}
  alt="Post"
  className="post-image"
/>
                  )}
                </div>
                <div className="post-footer">
                  <div className="icon-group">
                    <span
                      onClick={() => handleLike(post._id)}
                      title="Like"
                      style={{ cursor: "pointer" }}
                    >
                      <FaRegHeart /> {post.likes?.length || 0}
                    </span>
                    <span
                      onClick={() => toggleCommentBox(post._id)}
                      title="Comment"
                      style={{ cursor: "pointer" }}
                    >
                      <FaRegComment /> {post.comments?.length || 0}
                    </span>
                  </div>

                  {/* Comment box */}
                  {commentBoxes[post._id] && (
                    <form
                      className="comment-form"
                      onSubmit={(e) => handleCommentSubmit(e, post._id)}
                    >
                      <input
                      type="text"
                        value={commentTexts[post._id] || ""}
                        onChange={(e) =>
                          handleCommentTextChange(post._id, e.target.value)
                        }
                        placeholder="Write a comment..."
                      />
                      {commentImageUrls[post._id] && (
                        <img
                          src={commentImageUrls[post._id]}
                          alt="comment preview"
                          className="comment-preview"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleCommentImageChange(post._id, file);
                          }
                        }}
                      />
                      <button type="submit">Post Comment</button>
                    </form>
                  )}

                  {/* Comments list */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="comments-list">
                      {post.comments.map((comment) => {
                        const commentOwnerId = comment.user?._id || null;

                        return (
                          <div key={comment._id} className="comment-item">
                            <div className="comment-user">
                              <img
                                src={getUserImageUrl(comment.user?.profileImage)}
                                alt={comment.user?.username || "Anonymous"}
                                className="comment-profile-image"
                                onClick={() => goToUserPage(comment.user?._id)}
                                style={{ cursor: "pointer" }}
                              />
                              <span
                                className="comment-username"
                                onClick={() => goToUserPage(comment.user?._id)}
                                style={{ cursor: "pointer" }}
                              >
                                {comment.user?.username || "Anonymous"}
                              </span>
                            </div>

                            {editingComment.postId === post._id &&
                            editingComment.commentId === comment._id ? (
                              <>
                                <textarea
                                  value={editCommentText}
                                  onChange={(e) => setEditCommentText(e.target.value)}
                                  className="comment-edit-textarea"
                                />
                                <button onClick={submitEditComment}>Save</button>
                                <button onClick={cancelEdit}>Cancel</button>
                              </>
                            ) : (
                              <>
                                <p className="comment-text">{comment.text}</p>
                                {comment.imageUrl && (
                                <img
  src={getImageUrl(comment.imageUrl)}
  alt="Comment"
  className="comment-image"
/>
                                )}
                              </>
                            )}

                            {/* Show 3-dot button and menu only if current user owns the comment */}
                            {isOwner(commentOwnerId) && (
                              <div className="comment-actions">
                                <button
                                  className="comment-menu-btn"
                                  onClick={() => toggleCommentMenu(comment._id)}
                                  aria-label="Open comment options"
                                >
                                  &#8942; {/* Vertical ellipsis */}
                                </button>

                                {commentMenuOpen[comment._id] && (
                                  <div className="comment-menu-dropdown">
                                    <button
                                    className="comment-menu-option edit-btn"
                                      onClick={() => handleEditComment(post._id, comment._id)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                    className="comment-menu-option delete-btn"
                                      onClick={() =>
                                        {
                                          toggleCommentMenu(comment._id);
                                          handleDeleteComment(post._id, comment._id);
                                        }
                                      }
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Social;
