const BASE_URL = 'http://localhost:8000';

export async function createPantry(ingredientIds) {
  const res = await fetch(`${BASE_URL}/pantry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ingredient_ids: ingredientIds
    })
  });

  if (!res.ok) {
    throw new Error('Failed to create pantry');
  }

  return res.json();
}

export async function getCompatibleRecipes(pantryId) {
  const res = await fetch(`${BASE_URL}/recipes/compatible`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      pantry_id: pantryId
    })
  });

  if (!res.ok) {
    throw new Error('Failed to get compatible recipes');
  }

  return res.json();
}

export async function generateDiet(payload) {
  const res = await fetch(`${BASE_URL}/diet/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error('Failed to generate diet');
  }

  return res.json();
}
