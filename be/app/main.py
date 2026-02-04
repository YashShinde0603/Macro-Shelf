from pydantic import BaseModel
from typing import List, Dict
import uuid
import json
from pathlib import Path
import random
from collections import defaultdict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# In-memory stores
# -------------------------------------------------

PANTRIES: Dict[str, List[str]] = {}
RECIPES: List[Dict] = []

# -------------------------------------------------
# Load recipes
# -------------------------------------------------

def load_recipes():
    global RECIPES
    data_path = Path(__file__).parent / "data" / "recipes.json"
    with open(data_path, "r", encoding="utf-8") as f:
        RECIPES = json.load(f)

load_recipes()

# -------------------------------------------------
# Models
# -------------------------------------------------

class PantryRequest(BaseModel):
    ingredient_ids: List[str]

class CompatibleRecipeRequest(BaseModel):
    pantry_id: str

class MacroRange(BaseModel):
    min: float
    max: float

class NutritionRange(BaseModel):
    calories: MacroRange
    proteins: MacroRange
    carbs: MacroRange
    fats: MacroRange
    fibres: MacroRange

class GenerateDietRequest(BaseModel):
    pantry_id: str
    duration: str
    meals_per_day: int
    nutrition_range: NutritionRange

# -------------------------------------------------
# APIs
# -------------------------------------------------

@app.post("/pantry")
def save_pantry(req: PantryRequest):
    pantry_id = str(uuid.uuid4())
    PANTRIES[pantry_id] = req.ingredient_ids
    return {
        "pantry_id": pantry_id,
        "ingredient_count": len(req.ingredient_ids)
    }

@app.post("/recipes/compatible")
def get_compatible_recipes(req: CompatibleRecipeRequest):
    pantry = set(PANTRIES.get(req.pantry_id, []))

    compatible = [
        r for r in RECIPES
        if set(r["ingredient_ids"]).issubset(pantry)
    ]

    by_meal = {"breakfast": 0, "lunch": 0, "dinner": 0}
    for r in compatible:
        by_meal[r["meal_type"]] += 1

    return {
        "total_compatible_recipes": len(compatible),
        "by_meal_type": by_meal,
        "recipes": [
            {
                "recipe_id": r["recipe_id"],
                "recipe_name": r["recipe_name"],
                "meal_type": r["meal_type"]
            }
            for r in compatible
        ]
    }

# -------------------------------------------------
# DIET GENERATION (SAFE + RETRY + CLONE)
# -------------------------------------------------

@app.post("/diet/generate")
def generate_diet(req: GenerateDietRequest):
    pantry = set(PANTRIES.get(req.pantry_id, []))

    compatible = [
        r for r in RECIPES
        if set(r["ingredient_ids"]).issubset(pantry)
    ]

    breakfasts = [r for r in compatible if r["meal_type"] == "breakfast"]
    lunches = [r for r in compatible if r["meal_type"] == "lunch"]
    dinners = [r for r in compatible if r["meal_type"] == "dinner"]

    if not breakfasts or not lunches or not dinners:
        return {"days": 0, "diet": []}

    days_map = {"day": 1, "week": 7, "month": 30}
    total_days = days_map.get(req.duration, 1)

    final_diet = []
    clone_days = []
    usage_count = defaultdict(int)

    MAX_ATTEMPTS_PER_DAY = 100
    MAX_TOTAL_ATTEMPTS = total_days * MAX_ATTEMPTS_PER_DAY

    total_attempts = 0
    day = 1

    def pick(pool):
        pool_sorted = sorted(pool, key=lambda r: usage_count[r["recipe_id"]])
        return random.choice(pool_sorted[: max(1, len(pool_sorted)//2)])

    while day <= total_days and total_attempts < MAX_TOTAL_ATTEMPTS:
        attempts_today = 0
        found = False

        while attempts_today < MAX_ATTEMPTS_PER_DAY:
            attempts_today += 1
            total_attempts += 1

            breakfast = pick(breakfasts)
            lunch = pick(lunches)
            dinner = pick(dinners)

            meals = [breakfast, lunch, dinner]

            totals = {
                "calories": sum(m["calories"] for m in meals),
                "proteins": sum(m["proteins"] for m in meals),
                "carbs": sum(m["carbs"] for m in meals),
                "fats": sum(m["fats"] for m in meals),
                "fibres": sum(m["fibres"] for m in meals),
            }

            def in_range(key):
                r = getattr(req.nutrition_range, key)
                return r.min <= totals[key] <= r.max

            if all(in_range(k) for k in totals):
                for m in meals:
                    usage_count[m["recipe_id"]] += 1

                entry = {
                    "day": day,
                    "meals": [
                        {
                            "meal_type": mt,
                            "recipe_id": r["recipe_id"],
                            "recipe_name": r["recipe_name"],
                            "calories": r["calories"],
                            "proteins": r["proteins"],
                            "carbs": r["carbs"],
                            "fats": r["fats"],
                            "fibres": r["fibres"],
                            "ingredient_quantities": r["ingredient_quantities"],
                            "method": r["method"]
                        }
                        for mt, r in zip(["breakfast", "lunch", "dinner"], meals)
                    ],
                    "totals": totals
                }

                final_diet.append(entry)
                clone_days.append(entry)
                found = True
                break

        if not found:
            if clone_days:
                clone = clone_days[(day - 1) % len(clone_days)]
                final_diet.append({
                    "day": day,
                    "meals": clone["meals"],
                    "totals": clone["totals"]
                })
            else:
                break

        day += 1

    return {
        "days": len(final_diet),
        "diet": final_diet
    }
