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
     Generate handler (unchanged)
  ------------------------------------- */
  const handleGenerate = async () => {
    if (!canGenerate) return;

    setLoading(true);

    const relaxedNutritionRange = {
      calories: {
        min: 0,
        max: nutritionRange.calories.max
      },
      proteins: {
        min: nutritionRange.proteins.min,
        max: 1000
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
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="px-6 py-12">
        <section className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-2xl font-semibold text-[#244030]">
            Generate Diet
          </h2>

          {/* Duration selection */}
          <div className="mb-8 rounded-xl bg-white p-6 border">
            <p className="mb-4 text-sm font-semibold text-[#244030]">
              Select duration
            </p>

            <div className="flex gap-4">
              {['day', 'week', 'month'].map(d => (
                <button
                  key={d}
                  disabled={!canSelectDuration}
                  onClick={() => setDuration(d)}
                  className={`
                    rounded-lg
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    transition
                    ${
                      duration === d
                        ? 'bg-[#244030] text-white'
                        : 'border border-[#244030] text-[#244030]'
                    }
                    ${!canSelectDuration && 'opacity-40 cursor-not-allowed'}
                  `}
                >
                  {d.toUpperCase()}
                </button>
              ))}
            </div>

            {!nutritionRange && (
              <p className="mt-4 text-sm text-red-600">
                Please calculate nutritional requirements first.
              </p>
            )}
          </div>

          {/* Validation errors */}
          {duration && validationErrors.length > 0 && (
            <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6">
              <p className="mb-2 text-sm font-semibold text-red-700">
                Cannot generate diet. Please add:
              </p>
              <ul className="list-disc pl-5 text-sm text-red-700">
                {validationErrors.map((e, idx) => (
                  <li key={idx}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="
              mb-12
              rounded-xl
              bg-[#E0A423]
              px-8
              py-4
              text-sm
              font-semibold
              text-white
              transition
              hover:scale-[1.02]
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading ? 'Generating…' : 'Generate Diet'}
          </button>

          {/* Result */}
          {dietResult && (
            <div>
              <h3 className="mb-6 text-xl font-semibold text-[#244030]">
                Generated Diet
              </h3>

              <div className="space-y-6">
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
                      className="rounded-xl bg-white p-6 border"
                    >
                      <h4 className="mb-4 text-lg font-semibold text-[#244030]">
                        Day {day.day}
                      </h4>

                      <div className="space-y-3">
                        {day.meals.map(meal => (
                          <div key={meal.meal_type}>
                            <p className="text-sm font-semibold text-[#244030]">
                              {meal.meal_type.toUpperCase()} — {meal.recipe_name}
                            </p>
                            <p className="text-xs text-[#4B7447]">
                              Calories: {meal.calories} | P: {meal.proteins}g | C:{' '}
                              {meal.carbs}g | F: {meal.fats}g | Fibres:{' '}
                              {meal.fibres}g
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 border-t pt-3 text-sm font-semibold text-[#244030]">
                        Day Total — Calories: {totals.calories}, Proteins:{' '}
                        {totals.proteins}g, Carbs: {totals.carbs}g, Fats:{' '}
                        {totals.fats}g, Fibres: {totals.fibres}g
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
