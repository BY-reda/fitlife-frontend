import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../css/Nutrition.css";
import foodsData from "../data/foods.json";
import dayjs from "dayjs";
import api from "../api/client"; // <-- axios instance avec baseURL et token interceptor

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

export default function Food() {
  const location = useLocation();
  const editMeal = location.state?.editMeal || null;

  const [objective, setObjective] = useState("");
  const formatObjective = (obj) =>
    obj.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const [diaryDate, setDiaryDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  });

  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  });

  const [selectedFood, setSelectedFood] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
    snack: "",
  });

  const [quantityInput, setQuantityInput] = useState({
    breakfast: 100,
    lunch: 100,
    dinner: 100,
    snack: 100,
  });

  const [targetCalories, setTargetCalories] = useState(2200);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedMessage, setSavedMessage] = useState(false);
  const [showDropdown, setShowDropdown] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
    snack: false,
  });

  // States for editing quantities
  const [editingIndex, setEditingIndex] = useState({});
  const [newQuantities, setNewQuantities] = useState({});

  // Refs for meal sections to scroll into view
  const mealRefs = useRef({});

  // --- Fetch user target calories and objective ---
  useEffect(() => {
    const fetchUserTarget = async () => {
      try {
        const res = await api.get("/users/me");
        if (res.data.targetCalories) setTargetCalories(res.data.targetCalories);
        setObjective(res.data.goal);
      } catch (err) {
        console.error("Error fetching user target calories:", err);
      }
    };

    fetchUserTarget();
  }, []);

  // --- Fetch diary for the date ---
  useEffect(() => {
    const fetchDiary = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await api.get(`/diary?date=${diaryDate}`);

        const mealsFromApi = MEAL_TYPES.reduce((acc, type) => {
          acc[type] = [];
          return acc;
        }, {});

        if (res.data?.meals) {
          res.data.meals.forEach(({ mealType, foods }) => {
            if (MEAL_TYPES.includes(mealType)) {
              mealsFromApi[mealType] = foods.map((food) => ({
                ...food,
                quantity: food.quantity || 100,
              }));
            }
          });
        }

        setMeals(mealsFromApi);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch diary"
        );
        setMeals(
          MEAL_TYPES.reduce((acc, type) => {
            acc[type] = [];
            return acc;
          }, {})
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiary();
  }, [diaryDate]);

  // Scroll to meal section if editMeal state exists
  useEffect(() => {
    if (editMeal && mealRefs.current[editMeal]) {
      mealRefs.current[editMeal].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [editMeal, meals]);

  // --- Handlers for inputs ---
  const handleTargetChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setTargetCalories(isNaN(value) ? 0 : value);
  };

  const handleQuantityChange = (mealType, e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) value = 1;
    setQuantityInput((prev) => ({ ...prev, [mealType]: value }));
  };

  const handleSearchChange = (mealType, e) => {
    setSelectedFood((prev) => ({ ...prev, [mealType]: e.target.value }));
  };

  const addFoodToMeal = (mealType) => {
    const foodName = selectedFood[mealType].trim();
    if (!foodName) return;

    const food = foodsData.find(
      (f) => f.name.toLowerCase() === foodName.toLowerCase()
    );
    if (!food) {
      alert("Food not found. Please select a valid food from the list.");
      return;
    }

    const quantity = quantityInput[mealType] || 100;
    const factor = quantity / 100;

    const recalculatedFood = {
      ...food,
      calories: food.calories * factor,
      protein: food.protein * factor,
      carbs: food.carbs * factor,
      fat: food.fat * factor,
      quantity,
    };

    setMeals((prev) => ({
      ...prev,
      [mealType]: [...prev[mealType], recalculatedFood],
    }));

    setSelectedFood((prev) => ({ ...prev, [mealType]: "" }));
    setQuantityInput((prev) => ({ ...prev, [mealType]: 100 }));
  };

  const removeFoodFromMeal = (mealType, index) => {
    setMeals((prev) => {
      const updated = [...prev[mealType]];
      updated.splice(index, 1);
      return { ...prev, [mealType]: updated };
    });
  };

  const startEditing = (mealType, index) => {
    setEditingIndex({ [mealType]: index });
    setNewQuantities({
      [`${mealType}-${index}`]: meals[mealType][index].quantity,
    });
  };

  const handleEditQuantityChange = (mealType, index, e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) value = 1;
    setNewQuantities((prev) => ({ ...prev, [`${mealType}-${index}`]: value }));
  };

  const cancelEditing = () => {
    setEditingIndex({});
    setNewQuantities({});
  };

  // --- Update Food Quantity and sync with server ---
  const updateFoodQuantity = async (mealType, index) => {
    const newQty = newQuantities[`${mealType}-${index}`];
    if (!newQty || newQty < 1) {
      alert("Quantity must be at least 1");
      return;
    }

    const food = meals[mealType][index];
    const factor = newQty / food.quantity;

    const updatedFood = {
      ...food,
      calories: food.calories * factor,
      protein: food.protein * factor,
      carbs: food.carbs * factor,
      fat: food.fat * factor,
      quantity: newQty,
    };

    setMeals((prev) => {
      const updatedMealFoods = [...prev[mealType]];
      updatedMealFoods[index] = updatedFood;
      return { ...prev, [mealType]: updatedMealFoods };
    });

    const payload = {
      date: diaryDate,
      meals: MEAL_TYPES.map((mt) => ({
        mealType: mt,
        foods: mt === mealType
          ? meals[mt].map((f, i) => (i === index ? updatedFood : f))
          : meals[mt],
      })),
      water: 0,
    };

    setIsLoading(true);
    setError(null);

    try {
      await api.post("/diary", payload);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
      setEditingIndex({});
      setNewQuantities({});
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update diary");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Save whole diary ---
  const saveDiary = async () => {
    setIsLoading(true);
    setError(null);

    const payload = {
      date: diaryDate,
      meals: MEAL_TYPES.map((mealType) => ({
        mealType,
        foods: meals[mealType],
      })),
      water: 0,
    };

    try {
      await api.post("/diary", payload);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save diary");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Calculate totals ---
  const total = MEAL_TYPES.reduce(
    (acc, mealType) => {
      meals[mealType].forEach((food) => {
        acc.calories += food.calories || 0;
        acc.protein += food.protein || 0;
        acc.carbs += food.carbs || 0;
        acc.fats += food.fat || 0;
      });
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const remainingCalories = targetCalories - total.calories;
  const isOver = remainingCalories < 0;

  const getFilteredFoods = (query) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return foodsData
      .filter((food) => food.name.toLowerCase().includes(lowerQuery))
      .slice(0, 10);
  };

  if (isLoading) return <div className="diary-container">Loading...</div>;

  return (
    <div className="diary-container">
      <h2>Diary for {diaryDate}</h2>

      <label>
        Change date:
        <input
          type="date"
          value={diaryDate}
          onChange={(e) => {
            setDiaryDate(e.target.value);
          }}
        />
      </label>

      <label>
        Target Calories:
        <input
          type="number"
          value={targetCalories}
          onChange={handleTargetChange}
          min={0}
        />
      </label>

      <div className="nutrition-stats-container">
        <h2 className="nutrition-title">Today's Nutrition</h2>
        <div className="calories-section">
          <h3 className="section-title">Calories</h3>
          <div className="calories-remaining">
            {Math.abs(remainingCalories)} kcal {isOver ? "over" : "remaining"}
          </div>
          <div className="calories-consumed">
            {Math.round(total.calories)} / {targetCalories} kcal
          </div>
        </div>

        <div className="macros-grid">
          <div className="macro-item">
            <div className="macro-value">{Math.round(total.protein)}g</div>
            <div className="macro-label">Protein</div>
          </div>
          <div className="macro-item">
            <div className="macro-value">{Math.round(total.carbs)}g</div>
            <div className="macro-label">Carbs</div>
          </div>
          <div className="macro-item">
            <div className="macro-value">{Math.round(total.fats)}g</div>
            <div className="macro-label">Fats</div>
          </div>
          <div className="macro-item">
            <div className="macro-value">
              {Math.round(total.protein + total.carbs + total.fats)}g
            </div>
            <div className="macro-label">Total</div>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {savedMessage && <div className="success-message">Diary saved!</div>}

      {MEAL_TYPES.map((mealType) => (
        <div
          key={mealType}
          className="meal-section"
          ref={(el) => (mealRefs.current[mealType] = el)}
          id={`meal-${mealType}`}
          style={{ paddingTop: "40px" }}
        >
          <h3>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h3>

          <input
            type="text"
            placeholder={`Search food for ${mealType}`}
            value={selectedFood[mealType]}
            onChange={(e) => {
              handleSearchChange(mealType, e);
              setShowDropdown((prev) => ({ ...prev, [mealType]: true }));
            }}
            onBlur={() => {
              setTimeout(
                () => setShowDropdown((prev) => ({ ...prev, [mealType]: false })),
                200
              );
            }}
          />

          {showDropdown[mealType] && selectedFood[mealType] && (
            <ul className="food-dropdown">
              {getFilteredFoods(selectedFood[mealType]).map((food) => (
                <li
                  key={food.name}
                  onMouseDown={() => {
                    setSelectedFood((prev) => ({
                      ...prev,
                      [mealType]: food.name,
                    }));
                    setShowDropdown((prev) => ({ ...prev, [mealType]: false }));
                  }}
                >
                  {food.name}
                </li>
              ))}
            </ul>
          )}

          <input
            type="number"
            min="1"
            value={quantityInput[mealType]}
            onChange={(e) => handleQuantityChange(mealType, e)}
            style={{ width: "80px" }}
          />
          <button onClick={() => addFoodToMeal(mealType)}>Add</button>

          <ul className="meal-food-list">
            {meals[mealType].map((food, index) => (
              <li key={`${mealType}-${index}`} className="meal-food-item">
                <span>{food.name}</span>

                {editingIndex[mealType] === index ? (
                  <>
                    <input
                      type="number"
                      min="1"
                      value={newQuantities[`${mealType}-${index}`] || ""}
                      onChange={(e) =>
                        handleEditQuantityChange(mealType, index, e)
                      }
                      style={{ width: "80px" }}
                    />
                    <button onClick={() => updateFoodQuantity(mealType, index)}>
                      Save
                    </button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </>
                ) : (
                  <>
                    <span>Qty: {Math.round(food.quantity)} g</span>
                    <p>Protein: {food.protein.toFixed(1)} g</p>
                    <p>Carbs: {food.carbs.toFixed(1)} g</p>
                    <p>Fat: {food.fat.toFixed(1)} g</p>
                    <button onClick={() => startEditing(mealType, index)}>Edit</button>
                    <button onClick={() => removeFoodFromMeal(mealType, index)}>
                      Remove
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button onClick={saveDiary}>Save Diary</button>
    </div>
  );
}
