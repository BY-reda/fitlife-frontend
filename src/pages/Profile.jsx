import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/client";
import "../css/Profile.css";
import { calculateCalories } from "../utils/calculateCalories";

const Profile = () => {
  const { user, setUser, loading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("info");

  // Initialize with empty values - don't use user data here
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [profileImage, setProfileImage] = useState("");
  const [message, setMessage] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [credMessage, setCredMessage] = useState("");

  // Populate form fields when user data becomes available
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setAge(user.age || "");
      setWeight(user.weight || "");
      setHeight(user.height || "");
      setGoal(user.goal || "");
      setBio(user.bio || "");
      setGender(user.gender || "male");
      setActivityLevel(user.activityLevel || "moderate");
      setProfileImage(user.profileImage || "");
      setNewEmail(user.email || "");
      setConfirmEmail(user.email || "");
    }
  }, [user]);

  // Show loading while fetching user data
  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  // Handle case where user is not logged in
  if (!user) {
    return (
      <div className="profile-container">
        <div className="error">Please log in to view your profile.</div>
      </div>
    );
  }

  const targetCalories = calculateCalories(weight, height, age, activityLevel, goal, gender);
  const bmi = weight && height ? (weight / ((height / 100) ** 2)).toFixed(1) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/users/me", {
        username,
        age: parseInt(age) || undefined,
        weight: parseFloat(weight) || undefined,
        height: parseFloat(height) || undefined,
        goal,
        bio,
        profileImage,
        gender,
        activityLevel,
        targetCalories,
      });
      setUser(response.data);
      setMessage("✅ Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error updating profile.");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    if (newEmail !== confirmEmail) {
      setCredMessage("❌ Emails do not match.");
      setTimeout(() => setCredMessage(""), 3000);
      return;
    }
    try {
      const res = await api.put("/users/me/credentials", { newEmail });
      setUser(prev => ({ ...prev, email: res.data.email }));
      setCredMessage("✅ Email updated successfully.");
      setTimeout(() => setCredMessage(""), 3000);
    } catch (err) {
      setCredMessage("❌ Failed to update email.");
      setTimeout(() => setCredMessage(""), 5000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put("/users/me/credentials", {
        oldPassword: currentPassword,
        newPassword,
      });
      setCredMessage("✅ Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setCredMessage(""), 3000);
    } catch (err) {
      setCredMessage("❌ Failed to update password. Please verify your current password.");
      setTimeout(() => setCredMessage(""), 5000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <ul>
          <li className={activeTab === "info" ? "active" : ""} onClick={() => setActiveTab("info")}>Personal Info</li>
          <li className={activeTab === "credentials" ? "active" : ""} onClick={() => setActiveTab("credentials")}>Email & Password</li>
        </ul>
      </div>

      <div className="profile-content">
        <h1>My Profile</h1>

        {activeTab === "info" && (
          <>
            <div className="profile-photo">
              {profileImage ? (
                <img src={profileImage} alt="Profile" />
              ) : (
                <div className="placeholder">No Image</div>
              )}
              <label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid">
                <label>
                  Username
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>

                <label>
                  Age
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                </label>

                <label>
                  Weight (kg)
                  <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </label>

                <label>
                  Height (cm)
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                </label>

                <label>
                  Fitness Goal
                  <select value={goal} onChange={(e) => setGoal(e.target.value)}>
                    <option value="">Select goal</option>
                    <option value="lose weight">Lose Weight</option>
                    <option value="gain weight">Gain Weight</option>
                    <option value="maintain weight">Maintain Weight</option>
                  </select>
                </label>

                <label>
                  Bio
                  <input
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                  />
                </label>

                <label>
                  Gender
                  <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </label>

                <label>
                  Activity Level
                  <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                    <option value="very active">Very Active</option>
                  </select>
                </label>
              </div>

              <button type="submit">💾 Save changes</button>
              {message && <p className="msg">{message}</p>}
            </form>
          </>
        )}

        {activeTab === "credentials" && (
          <>
            <form onSubmit={handleChangeEmail} className="credentials-form">
              <label>
                New Email
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
              </label>

              <label>
                Confirm Email
                <input type="email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} required />
              </label>

              <button type="submit">📧 Update Email</button>
            </form>

            <form onSubmit={handleChangePassword} className="credentials-form">
              <label>
                Current Password
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              </label>

              <label>
                New Password
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </label>

              <button type="submit">🔐 Update Password</button>
            </form>

            {credMessage && <p className="msg">{credMessage}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;