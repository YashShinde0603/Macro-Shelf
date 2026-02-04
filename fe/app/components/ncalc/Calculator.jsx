'use client';

import { useState } from 'react';
import { useDiet } from '../../context/DietContext';

export default function Calculator() {
  const { calculateNutrition } = useDiet();

  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('moderate');
  const [result, setResult] = useState(null);

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  const handleCalculate = () => {
    const a = Number(age);
    const h = Number(height);
    const w = Number(weight);

    if (!a || !h || !w) {
      alert('Please fill all fields');
      return;
    }

    /* -----------------------------
       1. BMR — Mifflin–St Jeor
    ------------------------------ */
    let bmr;
    if (gender === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    /* -----------------------------
       2. TDEE
    ------------------------------ */
    const tdee = bmr * activityMultipliers[activity];

    /* -----------------------------
       3. Macros (industry standard)
    ------------------------------ */
    const protein = 1.8 * w; // g/day
    const fatCalories = 0.25 * tdee;
    const fat = fatCalories / 9;

    const carbCalories =
      tdee - protein * 4 - fat * 9;
    const carbs = carbCalories / 4;

    const fibres = (tdee / 1000) * 14;

    /* -----------------------------
       4. Apply ±20% range
    ------------------------------ */
    const range = (value) => ({
      min: Math.round(value * 0.8),
      max: Math.round(value * 1.2)
    });

    const nutritionRange = {
      calories: range(tdee),
      proteins: range(protein),
      carbs: range(carbs),
      fats: range(fat),
      fibres: range(fibres)
    };

    /* -----------------------------
       5. Store in Context
    ------------------------------ */
    calculateNutrition(nutritionRange);

    setResult({
      calories: Math.round(tdee),
      proteins: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fat),
      fibres: Math.round(fibres)
    });

    console.log('[Calculator] Nutrition range calculated:', nutritionRange);
  };

  return (
    <section style={{ padding: 24 }}>
      <h2>Nutrition Requirement Calculator</h2>

      <div style={{ display: 'grid', maxWidth: 400, gap: 12 }}>
        <input
          type="number"
          placeholder="Age (years)"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input
          type="number"
          placeholder="Height (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />

        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        >
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="very_active">Very Active</option>
        </select>

        <button onClick={handleCalculate}>
          Calculate Nutrition
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 24 }}>
          <h3>Ideal Daily Intake</h3>
          <ul>
            <li>Calories: {result.calories} kcal</li>
            <li>Proteins: {result.proteins} g</li>
            <li>Carbs: {result.carbs} g</li>
            <li>Fats: {result.fats} g</li>
            <li>Fibres: {result.fibres} g</li>
          </ul>

          <p style={{ fontSize: 12, color: '#555' }}>
            Values are ranged ±20% internally for diet generation.
          </p>
        </div>
      )}
    </section>
  );
}
