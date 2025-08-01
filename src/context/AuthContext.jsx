// context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { getProfile } from "../api/auth"; // crée cette fonction si nécessaire

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⬅️ add this

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const data = await getProfile();
          setUser(data);
        } catch (err) {
          console.error("Erreur de profil:", err);
          localStorage.removeItem("token");
        }
      }
      setLoading(false); // ✅ done loading
    };

    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

