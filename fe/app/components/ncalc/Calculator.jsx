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

    let bmr;
    if (gender === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const tdee = bmr * activityMultipliers[activity];

    const protein = 1.8 * w;
    const fatCalories = 0.25 * tdee;
    const fat = fatCalories / 9;

    const carbCalories = tdee - protein * 4 - fat * 9;
    const carbs = carbCalories / 4;

    const fibres = (tdee / 1000) * 14;

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

    calculateNutrition(nutritionRange);

    setResult({
      calories: Math.round(tdee),
      proteins: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fat),
      fibres: Math.round(fibres)
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="px-6 py-12">
        <section className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-2xl font-semibold text-[#244030]">
            Nutrition Requirement Calculator
          </h2>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            
            {/* LEFT: Input */}
            <div className="rounded-xl bg-white p-6 border">
              <div className="grid gap-4">
                <Input
                  type="number"
                  placeholder="Age (years)"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />

                <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>

                <Input
                  type="number"
                  placeholder="Height (cm)"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />

                <Input
                  type="number"
                  placeholder="Weight (kg)"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />

                <Select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very Active</option>
                </Select>

                <button
                  onClick={handleCalculate}
                  className="
                    mt-4
                    rounded-xl
                    bg-[#E0A423]
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition-transform
                    hover:scale-[1.02]
                  "
                >
                  Calculate Nutrition
                </button>
              </div>
            </div>

            {/* RIGHT: Result */}
            <div className="rounded-xl bg-white p-6 border">
              {result ? (
                <>
                  <h3 className="mb-4 text-lg font-semibold text-[#244030]">
                    Ideal Daily Intake
                  </h3>

                  <ul className="space-y-2 text-sm text-[#4B7447]">
                    <li>Calories: {result.calories} kcal</li>
                    <li>Proteins: {result.proteins} g</li>
                    <li>Carbs: {result.carbs} g</li>
                    <li>Fats: {result.fats} g</li>
                    <li>Fibres: {result.fibres} g</li>
                  </ul>

                  <p className="mt-4 text-xs text-gray-500">
                    Values are internally ranged ±20% for diet generation.
                  </p>
                </>
              ) : (
                <p className="text-sm text-[#4B7447]">
                  Fill in your details and calculate to see your ideal
                  nutrition targets.
                </p>
              )}
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}

/* -----------------------------
   UI helpers (unchanged logic)
------------------------------ */

function Input(props) {
  return (
    <input
      {...props}
      className="
        w-full
        rounded-lg
        border
        px-4
        py-2
        text-sm
        text-gray-900
        placeholder:text-gray-400
        focus:outline-none
        focus:border-[#244030]
      "
    />
  );
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="
        w-full
        rounded-lg
        border
        bg-white
        px-4
        py-2
        text-sm
        text-gray-900
        focus:outline-none
        focus:border-[#244030]
      "
    >
      {children}
    </select>
  );
}
