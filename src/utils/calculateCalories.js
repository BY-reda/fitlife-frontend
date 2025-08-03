export function calculateCalories(weight, height, age, activityLevel, goal, gender = 'male') {
  weight = parseFloat(weight);
  height = parseFloat(height);
  age = parseInt(age);
  goal = goal.toLowerCase();

  let bmr;
  if (gender === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  }

  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    "very active": 1.9,
  };

  const multiplier = multipliers[activityLevel] || multipliers['moderate'];
  let calories = bmr * multiplier;

  if (goal === 'lose weight') calories -= 500;
  else if (goal === 'gain weight') calories += 500;

  return Math.round(calories);
}

