import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Hello Admin 👋</h1>
      <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
        <div
          onClick={() => navigate("/admin/exercises")}
          style={{
            padding: "1.5rem",
            background: "#f0f0f0",
            borderRadius: "8px",
            cursor: "pointer",
            textAlign: "center",
            width: "200px",
            fontWeight: "bold",
          }}
        >
          ➕ Add Exercises
        </div>
        <div
          onClick={() => navigate("/admin/meals")}
          style={{
            padding: "1.5rem",
            background: "#f0f0f0",
            borderRadius: "8px",
            cursor: "pointer",
            textAlign: "center",
            width: "200px",
            fontWeight: "bold",
          }}
        >
          🍽️ Add Custom Meals
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
