import { RecipeSchema, type Recipe } from "@recipe/shared";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8787";

export async function normalizeRecipe(notes: string, measurementSystem: "US" | "METRIC"): Promise<Recipe> {
  const res = await fetch(`${API_BASE}/api/normalize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes, measurementSystem }),
  });
  if (!res.ok) throw new Error(`Normalize failed: ${res.status}`);
  const json = await res.json();
  return RecipeSchema.parse(json);
}

type QuestionAnswer = { index: number; answer: string };

export async function updateRecipe(recipe: Recipe | null, questionAnswers: QuestionAnswer[]): Promise<Recipe> {
  const res = await fetch(`${API_BASE}/api/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipe, questionAnswers }),
  });
  if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  const json = await res.json();
  return RecipeSchema.parse(json);
}