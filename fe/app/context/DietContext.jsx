'use client';

import { createContext, useContext, useState } from 'react';
import { createPantry, getCompatibleRecipes, generateDiet } from '../../lib/api';

const DietContext = createContext(null);

export function DietProvider({ children }) {
  const [pantry, setPantry] = useState([]);
  const [pantryId, setPantryId] = useState(null);
  const [nutritionRange, setNutritionRange] = useState(null);
  const [compatibleReady, setCompatibleReady] = useState(false);
  const [dietResult, setDietResult] = useState(null);

  /* -------------------------------
     PANTRY
  -------------------------------- */
  const savePantry = async (ingredientIds) => {
    console.log('[Pantry] Saving pantry with ingredients:', ingredientIds);

    setPantry(ingredientIds);

    const res = await createPantry(ingredientIds);

    console.log('[Pantry] Pantry created successfully. Pantry ID:', res.pantry_id);

    setPantryId(res.pantry_id);

    await getCompatibleRecipes(res.pantry_id);
    console.log('[Pantry] Compatible recipes pre-warmed');

    setCompatibleReady(true);
  };

  /* -------------------------------
     NUTRITION CALCULATOR
  -------------------------------- */
  const calculateNutrition = (range) => {
    console.log('[Nutrition] Calculated range set:', range);
    setNutritionRange(range);
  };

  /* -------------------------------
     GENERATE DIET (OVERRIDE SAFE)
  -------------------------------- */
  const generate = async (duration, nutritionOverride = null) => {
    console.log('[Diet] Generate called');
    console.log('[Diet] Duration:', duration);
    console.log('[Diet] Pantry ID:', pantryId);

    if (!pantryId) {
      console.warn('[Diet] Missing pantryId');
      return;
    }

    const finalNutritionRange = nutritionOverride || nutritionRange;

    if (!finalNutritionRange) {
      console.warn('[Diet] Missing nutrition range');
      return;
    }

    const payload = {
      pantry_id: pantryId,
      duration,
      meals_per_day: 3,
      nutrition_range: finalNutritionRange
    };

  
    console.log(
      '[Diet] FINAL PAYLOAD SENT TO BACKEND:',
      JSON.stringify(payload, null, 2)
    );

    const res = await generateDiet(payload);

    console.log('[Diet] Backend response:', res);

    setDietResult(res);
    return res;
  };

  return (
    <DietContext.Provider
      value={{
        pantry,
        pantryId,
        nutritionRange,
        compatibleReady,
        dietResult,
        savePantry,
        calculateNutrition,
        generate
      }}
    >
      {children}
    </DietContext.Provider>
  );
}

export const useDiet = () => useContext(DietContext);
