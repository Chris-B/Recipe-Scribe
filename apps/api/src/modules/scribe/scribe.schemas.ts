import { RecipeSchema } from "@recipe/shared";

import { z } from "zod";

export const NormalizeRequestSchema = z.object({
  notes: z.string().min(1),
  measurementSystem: z.enum(["US", "METRIC"]).default("US"),
});

export const UpdateRequestSchema = z.object({
  recipe: RecipeSchema,
  questionAnswers: z.array(
    z.object({
      index: z.number().int().nonnegative(),
      answer: z.string(),
    }),
  ),
});

export type RecipeUpdate = z.infer<typeof UpdateRequestSchema>;
export type RecipeRaw = z.infer<typeof NormalizeRequestSchema>;