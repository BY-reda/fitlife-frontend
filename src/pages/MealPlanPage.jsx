import React, { useEffect, useState, useContext } from "react";
import api from "../api/client";
import { AuthContext } from "../context/AuthContext";
import "../css/MealPlan.css";

const MealPlanPage = () => {
  const { user } = useContext(AuthContext);
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchMealPlan = async () => {
  try {
    const res = await api.get(`/mealplan/${user._id}`);
    setMealPlan(res.data);
  } catch (err) {
    console.error("Error fetching meal plan", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (user?._id) fetchMealPlan();
}, [user]);


  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const res = await api.get(`/mealplan/${user._id}`);
        setMealPlan(res.data);
      } catch (err) {
        console.error("Error fetching meal plan", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchMealPlan();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!mealPlan) return <p>No meal plan found</p>;
function cleanFoodName(name) {
  return name.replace(/\s*#\d+$/, '');
}
  return (
    <div className="meal-plan-page">
      <h2 className="meal-plan-title">🍽️ Your Personalized Meal Plan</h2>
      <button onClick={fetchMealPlan} className="regenerate-button">
  🔄 Regenerate Meal Plan
</button>

      <div className="target-summary">
        <p>🎯 <strong>Daily Target:</strong> {mealPlan.targets.calories} kcal</p>
        <ul className="macros-summary">
          <li>Protein: {Math.round(mealPlan.targets.protein)}g</li>
          <li>Fat: {Math.round(mealPlan.targets.fat)}g</li>
          <li>Carbs: {Math.round(mealPlan.targets.carbs)}g</li>
        </ul>
      </div>

      {Object.entries(mealPlan.meals).map(([mealType, foods]) => (
        <div key={mealType} className="meal-section">
          <h3 className="meal-title">{mealType.toUpperCase()}</h3>
          <ul className="meal-food-list">
            {foods.map((food, i) => (
              <li key={i} className="meal-food-item">
                <div className="food-header">
              <strong>{cleanFoodName(food.name)}</strong>
                  <span className="food-calories">{Math.round(food.calories)} kcal</span>
                </div>
<p>
  {food.quantity || "N/A"} &nbsp;|&nbsp;
  Protein: {food.protein}g &nbsp;|&nbsp;
  Carbs: {food.carbs}g &nbsp;|&nbsp;
  Fat: {food.fat}g
</p>

              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MealPlanPage;
