import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import dayjs from "dayjs";
import "../css/Home.css";

const diaryDate = dayjs().format("YYYY-MM-DD");

const Home = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userExercises, setUserExercises] = useState([]);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [targetCalories, setTargetCalories] = useState(0);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [meals, setMeals] = useState([]);
  const [macrosConsumed, setMacrosConsumed] = useState({
    protein: 0,
    fat: 0,
    carbs: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const todayDate = dayjs().format("YYYY-MM-DD");
  const formattedDate = dayjs().format("dddd, MMMM D, YYYY");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch user info
        const userRes = await api.get("/users/me");
        const userData = userRes.data;
        setUser(userData);
        setTargetCalories(userData.targetCalories || 0);

        // Fetch user exercises
        const exercisesRes = await api.get("/exercises/my-exercises");
        const exercisesData = exercisesRes.data || [];
        setUserExercises(exercisesData);
        console.log("userExercises =", exercisesData);
        setWorkoutCount(exercisesData.length);

        // Fetch today's diary
        const diaryRes = await api.get(`/diary?date=${todayDate}`);
        const diary = diaryRes.data || {};
        const mealsData = diary.meals || [];
        setMeals(mealsData);

        // Calculate macros and calories consumed
        let protein = 0,
          fat = 0,
          carbs = 0,
          totalCalories = 0;

        mealsData.forEach((meal) => {
          meal.foods?.forEach((food) => {
            const qty = food.quantity || 100;
            protein += ((food.protein || 0) * qty) / 100;
            fat += ((food.fat || 0) * qty) / 100;
            carbs += ((food.carbs || 0) * qty) / 100;
            totalCalories += ((food.calories || 0) * qty) / 100;
          });
        });

        setCaloriesConsumed(Math.round(totalCalories));
        setMacrosConsumed({
          protein: Math.round(protein),
          fat: Math.round(fat),
          carbs: Math.round(carbs),
        });
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [todayDate]);

  //exercice code
  const todayExercises = userExercises.filter((ex) => ex.date === todayDate);

  console.log("todayExercises:", todayExercises);
  const handleDeleteExercise = async (id, date) => {
    try {
      // S'assurer que la date est bien au format 'YYYY-MM-DD'
      const formattedDate = new Date(date).toISOString().split("T")[0];

      await api.delete(`/exercises/${id}?date=${date}`);

      setUserExercises((prev) => prev.filter((ex) => ex._id !== id));
    } catch (error) {
      console.error("Failed to delete exercise:", error);
      alert("Impossible de supprimer l'exercice");
    }
  };

  //food code delete
  const handleDeleteFood = async (mealType, foodId) => {
    try {
      await api.delete(`/diary/${diaryDate}/${mealType}/${foodId}`);

      setMeals((prevMeals) =>
        prevMeals.map((meal) =>
          meal.mealType === mealType
            ? {
                ...meal,
                foods: meal.foods.filter((food) => food._id !== foodId),
              }
            : meal
        )
      );
    } catch (err) {
      console.error("Failed to delete food:", err);
    }
  };

  // New: Navigate to Nutrition with editMeal state
  const handleEditMeal = (mealType) => {
    navigate("/app/food", { state: { editMeal: mealType } });
  };

  const macroTargets = {
    protein: user?.weight ? user.weight * 2 : 0,
    fat: user?.weight ? user.weight * 1.5 : 0,
  };

  const proteinCals = macroTargets.protein * 4;
  const fatCals = macroTargets.fat * 9;
  const remainingCals = Math.max(targetCalories - proteinCals - fatCals, 0);
  const carbsTarget = remainingCals / 4;

  const macroGoal = {
    protein: Math.round(macroTargets.protein),
    fat: Math.round(macroTargets.fat),
    carbs: Math.round(carbsTarget),
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <h2>Welcome back, {user?.username || "User"}!</h2>
        <time className="dashboard-date">{formattedDate}</time>
      </header>

      <section className="dashboard-stats">
        <article className="stat-card">
          <h3>Macros (g)</h3>
          <div className="macro-bar">
            {["protein", "fat", "carbs"].map((macro) => {
              const consumed = macrosConsumed[macro] || 0;
              const goal = macroGoal[macro] || 1;
              const percent = Math.min(100, (consumed / goal) * 100).toFixed(1);

              const colors = {
                protein: "#4caf50",
                fat: "#ff9800",
                carbs: "#2196f3",
              };

              return (
                <div key={macro} className="macro-block">
                  <div className="progress-bar macro-progress">
                    <div
                      className="progress"
                      style={{ width: `${percent}%`, backgroundColor: colors[macro] }}
                    >
                      <span className="progress-label">
                        {macro.charAt(0).toUpperCase() + macro.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="macro-info">
                    {consumed} / {goal}g ({percent}%)
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="stat-card">
          <h3>Calories</h3>
          <p className="stat-value">
            {caloriesConsumed.toLocaleString()} / {targetCalories.toLocaleString()} kcal
          </p>
          <p className="stat-desc">
            Remaining: {Math.max(targetCalories - caloriesConsumed, 0).toLocaleString()} kcal
          </p>
        </article>

        <article className="stat-card">
          <h3>Current Weight</h3>
          <p className="stat-value">{user?.weight ? `${user.weight} kg` : "—"}</p>
          <p className="stat-desc green">Goal: {user?.goal || "—"}</p>
        </article>
      </section>

      <main className="dashboard-content">
        <section className="card">
          <div className="card-header">
            <h3>Current Training Program</h3>
            <button className="btn btn-primary small-btn" onClick={() => navigate("/app/workouts")}>
              + Add Exercise
            </button>
          </div>

          {todayExercises.length > 0 ? (
            <ul className="exdash-grid">
              {todayExercises.map((ex) => (
                <li key={ex._id} className="exdash-card">
                  <img src={ex.image} alt={ex.name} className="exdash-img" />
                  <div className="exdash-info">
                    <h4 className="exdash-title">{ex.name}</h4>
                    <p className="exdash-meta">
                      {ex.muscleGroup} · {ex.difficulty}
                    </p>
                    <button
                      className="btn btn-danger small-btn mt-2"
                      onClick={() => handleDeleteExercise(ex._id, ex.date)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No workouts for today</p>
          )}
        </section>

        <section className="card">
          <div className="card-header">
            <h3>Nutrition Plan</h3>
            <button
              className="btn btn-secondary small-btn"
              onClick={() => navigate("/app/food")}
            >
              + Add Food
            </button>
          </div>

          {/* Check if any meal has foods */}
          {meals.every((meal) => !meal.foods || meal.foods.length === 0) ? (
            <p>No meals added today.</p>
          ) : (
            meals.map((meal) =>
              meal.foods && meal.foods.length > 0 ? (
                <div key={meal.mealType} className="meal-block">
                  <h4>{meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}</h4>

                  <ul className="food-list">
                    {meal.foods.map((food, idx) => {
                      const qty = food.quantity || 100;
                      return (
                        <li key={idx} className="food-item">
                          <div className="food-name">{food.name}</div>
                          <div className="food-info">
                            <span>Qty: {qty}g</span>
                            <span>{food.calories.toFixed(0) || 0} kcal</span>
                            <span>Protein: {food.protein.toFixed(0) || 0}g</span>
                            <span>Carbs: {food.carbs.toFixed(0) || 0}g</span>
                            <span>Fat: {food.fat.toFixed(0) || 0}g</span>
                            <button
                              className="btn btn-info small-btn"
                              style={{ marginBottom: "8px" }}
                              onClick={() => handleEditMeal(meal.mealType)}
                            >
                              Edit Meal
                            </button>
                            <button
                              className="btn btn-danger small-btn"
                              onClick={() => handleDeleteFood(meal.mealType, food._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null
            )
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
