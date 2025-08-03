import React, { useState } from "react";
import api from "../api/client";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import "../css/Signup.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptTerms) {
      setMessage({
        type: "error",
        text: "Please accept the terms and conditions.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match.",
      });
      return;
    }

    try {
      await api.post("/auth/signup", { username, email, password });
      // ✅ Redirect with message
      window.location.href = "/login?message=Signup successful! Please log in.";
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Signup failed. Please try again." 
      });
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      await api.post("/auth/google", { token: credentialResponse.credential });
      window.location.href = "/app";
    } catch {
      setMessage({ type: "error", text: "Google signup failed. Please try another method." });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Your Account</h2>
        <p style={{ color: '#666', marginBottom: '25px' }}>
          Join our community to get started
        </p>

        <div className="google-btn-container">
          <GoogleLogin
            onSuccess={handleGoogleSignup}
            onError={() =>
              setMessage({ type: "error", text: "Google sign in failed" })
            }
            useOneTap
            theme="filled_blue"
            size="large"
            text="signup_with"
            shape="rectangular"
            width="300"
          />
        </div>

        <div className="divider">or sign up with email</div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <span className="input-icon"><FiUser /></span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={20}
            />
          </div>
          
          <div className="input-group">
            <span className="input-icon"><FiMail /></span>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <span className="input-icon"><FiLock /></span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <span 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <div className="input-group">
            <span className="input-icon"><FiLock /></span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
            <span 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <label className="terms-label">
            
            <span>
              <input
              type="checkbox"
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}   
            />  I agree to the{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="terms-link"
              >
                terms and conditions
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="terms-link"
              >
                privacy policy
              </a>.
            </span>
          </label>

          <button type="submit" className="submit-btn">
            Create Account
          </button>
        </form>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <p style={{ marginTop: '25px', color: '#666' }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: '#03bd60', fontWeight: '600' }}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
