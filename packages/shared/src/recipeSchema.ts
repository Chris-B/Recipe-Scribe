import { z } from "zod";

/**
 * A validated, standardized recipe representation.
 * Shared between frontend + backend so:
 * - The backend can enforce strict JSON output from the model
 * - The frontend can trust what it renders
 */

export const MeasurementSystemSchema = z.enum(["US", "METRIC"]).describe("Which measurement system this recipe references.");
export type MeasurementSystem = z.infer<typeof MeasurementSystemSchema>;

export const IngredientSchema = z.object({
  name: z.string().min(1).describe("The name for the ingredient."),
  quantity: z.number().nullable().optional().describe("The quantity for this ingredient."),
  unit: z.string().nullable().optional().describe("Unit of measurement for this ingredient."), // This will be normalized with the <units.ts> helper
  preparation: z.string().nullable().optional().describe("Any preparation this ingredient needs."),
  optional: z.boolean().default(false).describe("Whether or not this ingredient is optional."),
  inferred: z.boolean().default(false).describe("Whether or not this ingredient was inferred/implied."),
  sourceSpans: z
    .array(z.object({ start: z.number().int().nonnegative(), end: z.number().int().nonnegative() }))
    .default([]).describe("An array containing the character ranges in the original notes that this ingredient references.")
});

export type RecipeIngredient = z.infer<typeof IngredientSchema>;

export const StepSchema = z.object({
  order: z.number().int().positive().describe("The order number for this step in the recipe."),
  text: z.string().min(1).describe("The text for this step."),
  durationMinutes: z.number().nullable().optional().describe("The duration in minutes for this step. Optional."),
  temperatureC: z.number().nullable().optional().describe("The temperature in celsius for this step. Optional."),
  inferred: z.boolean().default(false).describe("Whether or not this step was inferred/implied."),
  sourceSpans: z
    .array(z.object({ start: z.number().int().nonnegative(), end: z.number().int().nonnegative() }))
    .default([]).describe("An array containing the character ranges in the original notes that this step references.")
});

export type RecipeStep = z.infer<typeof StepSchema>;

export const RecipeSchema = z.object({
  title: z.string().min(1).describe("The title of the recipe."),
  description: z.string().min(1).describe("The description of the recipe."),
  servings: z.number().int().positive().nullable().optional().describe("The number of servings the recipe creates."),
  measurementSystem: MeasurementSystemSchema,
  prepTimeMinutes: z.number().int().nonnegative().nullable().optional().describe("The number of minutes to prepare the dish."),
  cookTimeMinutes: z.number().int().nonnegative().nullable().optional().describe("The number of minutes to cook the dish."),
  totalTimeMinutes: z.number().int().nonnegative().nullable().optional().describe("The total number of minutes to complete the recipe."),
  ingredients: z.array(IngredientSchema).min(1).describe("The array of ingredients used in the recipe."),
  steps: z.array(StepSchema).min(1).describe("The array of steps to make the recipe."),
  notes: z.array(z.string()).default([]).describe("An array of additional notes about the dish or psa type statements."),
  tags: z.array(z.string()).default([]).describe("An array of tags relevant to the recipe."),
  questions: z.array(z.string()).default([]).describe("An array of questions to ask the user when more information is needed to complete the recipe."),
  sourceText: z.string().min(1).describe("The original recipe notes/text submitted by the user.")
});

export type Recipe = z.infer<typeof RecipeSchema>;
