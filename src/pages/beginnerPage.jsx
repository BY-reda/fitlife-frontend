import React, { useState, useEffect } from "react";
import MealPlanPage from "./MealPlanPage"; // import your MealPlanPage component
import '../css/beginnerPage.css';
export default function ProgramCard() {
  const [objective, setObjective] = useState("");
  const [targetCalories, setTargetCalories] = useState(2200);
  const [showMealPlan, setShowMealPlan] = useState(false);

  const formatObjective = (obj) =>
    obj.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchUserTarget = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        if (data.targetCalories) setTargetCalories(data.targetCalories);
        setObjective(data.goal || "");
      } catch (err) {
        console.error("Error fetching user target calories:", err);
      }
    };

    fetchUserTarget();
  }, [token]);

  const handleStartProgram = () => {
    setShowMealPlan(true);
  };

  return (
    <>
      <div className="program-card-enhanced">
        <div className="program-header">
          <div className="program-title">
            <span className="program-icon">📈</span>
            <div>
              <h2> suggested Nutrition Program</h2>
              <p className="program-subtitle">Start your personalized nutrition journey</p>
            </div>
          </div>
          <span className="program-tag">Beginner</span>
        </div>

        <div className="program-content">
          <h3>{objective ? `${formatObjective(objective)} Starter` : "Personalized Plan"}</h3>
          <p className="program-description">
            A well-balanced <strong>{targetCalories} cal</strong> plan designed for gradual and sustainable{" "}
            {objective ? formatObjective(objective).toLowerCase() : "health improvement"}.
          </p>

          <div className="program-details">
            <div>
              <span className="detail-icon">⏱️</span>
              <span>4 weeks</span>
            </div>
            <div>
              <span className="detail-icon">🍽️</span>
              <span>4 meals/day</span>
            </div>
            <div>
              <span className="detail-icon">🔥</span>
              <span>{targetCalories} cal</span>
            </div>
          </div>

          <ul className="program-benefits">
            <li>✔️ Pre-planned meals</li>
            <li>✔️ Shopping lists</li>
          </ul>

          <button className="program-button" onClick={handleStartProgram}>
            Start Program
          </button>
        </div>
      </div>

      {/* Show meal plan on the same page after clicking */}
      {showMealPlan && <MealPlanPage />}
    </>
  );
}
