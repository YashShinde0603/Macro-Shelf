'use client';

import { useState } from 'react';
import ingredients from '../../../data/ingredients.json';
import { useDiet } from '../../context/DietContext';

const DEFAULT_VISIBLE = 8;

export default function Pantry() {
  const { savePantry } = useDiet();

  const [query, setQuery] = useState('');
  const [local, setLocal] = useState([]);

  const visibleIngredients = query
    ? ingredients.filter(i =>
        i.name.toLowerCase().includes(query.toLowerCase())
      )
    : ingredients.slice(0, DEFAULT_VISIBLE);

  const toggleIngredient = (id) => {
    setLocal(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allIds = ingredients.map(i => i.id);
    setLocal(allIds);
    console.log('[Pantry] All ingredients selected:', allIds.length);
  };

  const handleClearAll = () => {
    setLocal([]);
  };

  const handleSave = async () => {
    console.log('[Pantry] Saving pantry with', local.length, 'items');
    await savePantry(local);
  };

  return (
    <section style={{ padding: 24 }}>
      <h2>Pantry</h2>

      {/* Search */}
      <input
        placeholder="Search ingredients"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: 12, width: '100%' }}
      />

      {/* Bulk actions */}
      <div style={{ marginBottom: 12 }}>
        <button onClick={handleSelectAll} style={{ marginRight: 8 }}>
          Select All Ingredients
        </button>
        <button onClick={handleClearAll}>
          Clear Selection
        </button>
      </div>

      {/* Ingredient list */}
      <ul>
        {visibleIngredients.map(ing => (
          <li key={ing.id}>
            <label>
              <input
                type="checkbox"
                checked={local.includes(ing.id)}
                onChange={() => toggleIngredient(ing.id)}
              />
              {' '}
              {ing.name} ({ing.category})
            </label>
          </li>
        ))}
      </ul>

      {/* Save */}
      <button onClick={handleSave} style={{ marginTop: 16 }}>
        Save Pantry
      </button>

      <p style={{ fontSize: 12, marginTop: 8 }}>
        Selected: {local.length} ingredients
      </p>
    </section>
  );
}
