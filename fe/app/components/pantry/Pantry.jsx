'use client';

import { useState } from 'react';
import ingredients from '../../../data/ingredients.json';
import { useDiet } from '../../context/DietContext';

const DEFAULT_VISIBLE = 8;
const CATEGORIES = ['carbohydrates', 'proteins', 'fats', 'fibres'];

export default function Pantry() {
  const { savePantry } = useDiet();

  const [query, setQuery] = useState('');
  const [local, setLocal] = useState([]);
  const [filters, setFilters] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  /* -----------------------------
     Pantry selection logic
  ----------------------------- */
  const toggleIngredient = (id) => {
    setLocal(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setLocal(ingredients.map(i => i.id));
  };

  const handleClearAll = () => {
    setLocal([]);
  };

  const handleSave = async () => {
    await savePantry(local);
  };

  /* -----------------------------
     Filter logic (additive)
  ----------------------------- */
  const toggleFilter = (category) => {
    setFilters(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredIngredients = ingredients.filter(i => {
    const matchesQuery = query
      ? i.name.toLowerCase().includes(query.toLowerCase())
      : true;

    const matchesFilter =
      filters.length === 0 || filters.includes(i.category);

    return matchesQuery && matchesFilter;
  });

  const visibleIngredients = query
    ? filteredIngredients
    : filteredIngredients.slice(0, DEFAULT_VISIBLE);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="px-6 py-10">
        <section className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-2xl font-semibold text-[#244030]">
            Pantry
          </h2>

          {/* Search + Filter */}
          <div className="mb-6 flex items-center gap-4">
            <input
              placeholder="Search ingredients"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="
                w-full
                rounded-lg
                border
                border-[#244030]/30
                bg-white
                px-4
                py-2
                text-sm
                text-gray-900
                placeholder:text-gray-400
                focus:outline-none
                focus:border-[#244030]
              "
            />

            {/* Filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(o => !o)}
                className="
                  rounded-lg
                  border
                  border-[#244030]
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-[#244030]
                  hover:border-[#E0A423]
                  hover:text-[#E0A423]
                "
              >
                Filter
              </button>

              {filterOpen && (
                <div
                  className="
                    absolute
                    right-0
                    mt-2
                    w-52
                    rounded-lg
                    border
                    bg-white
                    p-4
                    shadow-md
                  "
                >
                  {CATEGORIES.map(cat => (
                    <label
                      key={cat}
                      className="mb-2 flex items-center gap-2 text-sm text-[#4B7447]"
                    >
                      <input
                        type="checkbox"
                        checked={filters.includes(cat)}
                        onChange={() => toggleFilter(cat)}
                        className="accent-[#244030]"
                      />
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bulk actions */}
          <div className="mb-6 flex gap-6">
            <button
              onClick={handleSelectAll}
              className="text-sm font-semibold text-[#244030] hover:text-[#E0A423]"
            >
              Select All Ingredients
            </button>

            <button
              onClick={handleClearAll}
              className="text-sm font-semibold text-[#244030] hover:text-[#E0A423]"
            >
              Clear Selection
            </button>
          </div>

          {/* Ingredient list */}
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {visibleIngredients.map(ing => (
              <li
                key={ing.id}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  border
                  bg-white
                  px-4
                  py-3
                "
              >
                <input
                  type="checkbox"
                  checked={local.includes(ing.id)}
                  onChange={() => toggleIngredient(ing.id)}
                  className="accent-[#244030]"
                />

                <span className="text-sm font-medium text-[#244030]">
                  {ing.name}
                </span>

                <span className="ml-auto text-xs text-[#4B7447]">
                  {ing.category}
                </span>
              </li>
            ))}
          </ul>

          {/* Save */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={handleSave}
              className="
                rounded-xl
                bg-[#E0A423]
                px-6
                py-3
                text-sm
                font-semibold
                text-white
              "
            >
              Save Pantry
            </button>

            <p className="text-sm text-[#4B7447]">
              Selected: {local.length} ingredients
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
