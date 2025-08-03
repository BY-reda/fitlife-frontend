import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/client";
import "../css/Profile.css";
import { calculateCalories } from "../utils/calculateCalories";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("info");

  const [username, setUsername] = useState(user?.username || "");
  const [age, setAge] = useState(user?.age || "");
  const [weight, setWeight] = useState(user?.weight || "");
  const [height, setHeight] = useState(user?.height || "");
  const [goal, setGoal] = useState(user?.goal || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [gender, setGender] = useState(user?.gender || "male");
  const [activityLevel, setActivityLevel] = useState(user?.activityLevel || "moderate");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [message, setMessage] = useState("");

  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [confirmEmail, setConfirmEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [credMessage, setCredMessage] = useState("");

  const targetCalories = calculateCalories(weight, height, age, activityLevel, goal, gender);
  const bmi = weight && height ? (weight / ((height / 100) ** 2)).toFixed(1) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/users/me", {
        username,
        age,
        weight,
        height,
        goal,
        bio,
        profileImage,
        gender,
        activityLevel,
        targetCalories,
      });
      setUser(response.data);
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error updating profile.");
    }
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    if (newEmail !== confirmEmail) {
      setCredMessage("❌ Emails do not match.");
      return;
    }
    try {
      const res = await api.put("/users/me/credentials", { newEmail });
      setUser(prev => ({ ...prev, email: res.data.email }));
      setCredMessage("✅ Email updated successfully.");
    } catch (err) {
      setCredMessage("❌ Failed to update email.");
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
    } catch (err) {
      setCredMessage("❌ Failed to update password. Please verify your current password.");
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
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
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
