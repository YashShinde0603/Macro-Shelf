'use client';

import { useState, useMemo } from 'react';
import { useDiet } from '../../context/DietContext';
import ingredients from '../../../data/ingredients.json';

export default function Diet() {
  const {
    pantry,
    nutritionRange,
    dietResult,
    generate
  } = useDiet();

  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ------------------------------------
     CONFIG (LOCKED RULES)
  ------------------------------------- */
  const RULES = {
    day: { total: 4, perCategory: 1 },
    week: { total: 10, perCategory: 2 },
    month: { total: 15, perCategory: 3 }
  };

  const categories = ['proteins', 'carbohydrates', 'fats', 'fibres'];

  /* ------------------------------------
     Pantry category counts
  ------------------------------------- */
  const pantryCategoryCount = useMemo(() => {
    const counts = {
      proteins: 0,
      carbohydrates: 0,
      fats: 0,
      fibres: 0
    };

    pantry.forEach((id) => {
      const ing = ingredients.find(i => i.id === id);
      if (ing && counts[ing.category] !== undefined) {
        counts[ing.category]++;
      }
    });

    return counts;
  }, [pantry]);

  /* ------------------------------------
     Validation logic
  ------------------------------------- */
  const validationErrors = useMemo(() => {
    if (!duration) return [];

    const rules = RULES[duration];
    const errors = [];

    if (pantry.length < rules.total) {
      errors.push(
        `Add ${rules.total - pantry.length} more ingredient(s) in total`
      );
    }

    categories.forEach(cat => {
      if (pantryCategoryCount[cat] < rules.perCategory) {
        errors.push(
          `Add ${rules.perCategory - pantryCategoryCount[cat]} more ${cat} item(s)`
        );
      }
    });

    return errors;
  }, [duration, pantry, pantryCategoryCount]);

  const canSelectDuration = Boolean(nutritionRange);
  const canGenerate =
    nutritionRange &&
    duration &&
    validationErrors.length === 0 &&
    !loading;

  /* ------------------------------------
     Generate handler (40% relaxed rules)
  ------------------------------------- */
  const handleGenerate = async () => {
    if (!canGenerate) return;

    setLoading(true);

    // 🔥 40% relaxed nutrition constraints
    const relaxedNutritionRange = {
      calories: {
        min: 0, // remove calorie minimum
        max: nutritionRange.calories.max
      },
      proteins: {
        min: nutritionRange.proteins.min,
        max: 1000 // remove protein upper cap
      },
      carbs: {
        min: 0,
        max: nutritionRange.carbs.max
      },
      fats: {
        min: nutritionRange.fats.min,
        max: nutritionRange.fats.max
      },
      fibres: {
        min: 0,
        max: 1000
      }
    };

    await generate(duration, relaxedNutritionRange);

    setLoading(false);
  };

  /* ------------------------------------
     UI
  ------------------------------------- */
  return (
    <section style={{ padding: 24 }}>
      <h2>Generate Diet</h2>

      <div style={{ marginBottom: 16 }}>
        <p><b>Select duration</b></p>

        {['day', 'week', 'month'].map(d => (
          <button
            key={d}
            disabled={!canSelectDuration}
            onClick={() => setDuration(d)}
            style={{
              marginRight: 8,
              opacity: !canSelectDuration ? 0.4 : 1,
              background: duration === d ? '#ddd' : undefined
            }}
          >
            {d.toUpperCase()}
          </button>
        ))}

        {!nutritionRange && (
          <p style={{ color: 'red', marginTop: 8 }}>
            Please calculate nutritional requirements first.
          </p>
        )}
      </div>

      {duration && validationErrors.length > 0 && (
        <div style={{ color: 'red', marginBottom: 16 }}>
          <p><b>Cannot generate diet. Please add:</b></p>
          <ul>
            {validationErrors.map((e, idx) => (
              <li key={idx}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        style={{
          opacity: canGenerate ? 1 : 0.5,
          cursor: canGenerate ? 'pointer' : 'not-allowed'
        }}
      >
        {loading ? 'Generating…' : 'Generate Diet'}
      </button>

      {dietResult && (
        <div style={{ marginTop: 32 }}>
          <h3>Generated Diet</h3>

          {dietResult.diet.map(day => {
            const totals = day.meals.reduce(
              (acc, m) => {
                acc.calories += m.calories;
                acc.proteins += m.proteins;
                acc.carbs += m.carbs;
                acc.fats += m.fats;
                acc.fibres += m.fibres;
                return acc;
              },
              { calories: 0, proteins: 0, carbs: 0, fats: 0, fibres: 0 }
            );

            return (
              <div
                key={day.day}
                style={{
                  border: '1px solid #ccc',
                  padding: 16,
                  marginBottom: 16
                }}
              >
                <h4>Day {day.day}</h4>

                {day.meals.map(meal => (
                  <div key={meal.meal_type} style={{ marginBottom: 8 }}>
                    <b>{meal.meal_type.toUpperCase()}</b>: {meal.recipe_name}
                    <div style={{ fontSize: 12 }}>
                      Calories: {meal.calories} | P: {meal.proteins}g | C: {meal.carbs}g | F: {meal.fats}g | Fibres: {meal.fibres}g
                    </div>
                  </div>
                ))}

                <hr />

                <div>
                  <b>Day Total</b> — Calories: {totals.calories},
                  Proteins: {totals.proteins}g,
                  Carbs: {totals.carbs}g,
                  Fats: {totals.fats}g,
                  Fibres: {totals.fibres}g
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
