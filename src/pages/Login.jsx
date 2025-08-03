import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import api from "../api/client";
import "../css/Login.css";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const msg = params.get("message");
    if (msg) {
      setMessage(msg);
      setTimeout(() => setMessage(""), 5000);
    }
  }, [location]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("/auth/login", { email, password });
    console.log('User reçu:', res.data.user);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user)); // <-- ajouté ici
    setUser(res.data.user);

    if (res.data.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/app");
    }
  } catch {
    setMessage("Login failed. Please check your credentials.");
  }
};





const handleGoogleLogin = async (credentialResponse) => {
  try {
    const res = await api.post("/auth/google", {
      token: credentialResponse.credential,
    });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);

    if (res.data.user.role === "admin") {
      console.log("Navigating to admin")
      navigate("/admin");
    } else {
      navigate("/app");
    }
  } catch {
    setMessage("Google Login failed.");
  }
};


  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Please login to your account</p>

        {message && <div className="login-message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        <div className="login-divider">or</div>

        <div className="google-container">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setMessage("Google login failed")}
          />
        </div>

        <p className="login-footer">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
