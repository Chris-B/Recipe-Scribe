import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { type Recipe, RecipeSchema } from "@recipe/shared";
import { z } from "zod";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: process.env.CORS_ORIGIN ?? true
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Schemas ---
const NormalizeRequestSchema = z.object({
  notes: z.string().min(1),
  measurementSystem: z.enum(["US", "METRIC"]).default("US"),
  style: z.enum(["concise", "friendly", "professional"]).default("friendly")
});
type NormalizeRequest = z.infer<typeof NormalizeRequestSchema>;

const UpdateRequestSchema = z.object({
  recipe: RecipeSchema,
  questionAnswers: z.array(
    z.object({
      index: z.number().int().nonnegative(),
      answer: z.string(),
    }),
  ),
});
type UpdateRequest = z.infer<typeof UpdateRequestSchema>;

// --- Basic health ---
app.get("/health", async () => ({ ok: true }));

/**
 * Non-streaming endpoint (useful for TanStack Query mutations).
 */
app.post("/api/normalize", async (req, reply) => {
  const body = NormalizeRequestSchema.safeParse(req.body);
  if (!body.success) {
    reply.code(400);
    return { error: body.error.flatten() };
  }

  return await gptNormalize({
    notes: body.data.notes,
    measurementSystem: body.data.measurementSystem,
  });
});

export async function gptNormalize(args: {
  notes: string;
  measurementSystem: "US" | "METRIC";
}): Promise<Recipe> {
  const response = await openai.responses.create({
    model: "gpt-5.2",
    input: [
      {
        role: "system",
        content: [
          "You are an assistant that converts messy recipe notes into a complete, structured recipe JSON.",
          "",
          `Measurement system to output: ${args.measurementSystem}.`,
          "",
          "Hard rules:",
          "- Output MUST be a single JSON object that matches the provided schema exactly (no markdown, no commentary).",
          "- Do NOT invent critical details. If the notes do not contain (or strongly imply) a value, add a question instead.",
          "- Critical details include: primary cooking method, oven/stovetop temperature, cook time, key quantities, and servings.",
          "",
          "Inference policy:",
          "- You MAY infer obvious standard steps (e.g., 'preheat oven' when baking temperature is given) and mark inferred=true.",
          "- You MUST ask questions when the missing info materially affects outcome or safety (time/temp/major quantities).",
          "",
          "Questions:",
          "- Put clarification questions in recipe.questions[] as short, direct questions.",
          "- If multiple missing items exist, ask the smallest set of questions needed to proceed.",
          "",
          "Source spans:",
          "- If you can confidently tie an ingredient or step to a substring of the notes, include sourceSpans with {start,end} character indices into sourceText.",
          "- If not confident, leave sourceSpans empty. Do not guess spans.",
          "",
          "Quality checklist (before you answer):",
          "- Ingredients list is concrete and usable.",
          "- Steps are ordered, imperative, and not redundant.",
          "- Times/temps are consistent with the chosen measurement system (F for US, C for METRIC).",
          "- If anything essential is unknown, it appears as a question instead of a made-up value.",
        ].join("\n"),
      },
      {
        role: "user",
        content: [
          { type: "input_text", text: "Recipe notes (raw):" },
          { type: "input_text", text: args.notes },
        ],
      },
    ],
    text: {
      format: zodTextFormat(RecipeSchema, "recipe_schema"),
    },
  });

  const jsonText = response.output_text;
  if (!jsonText) throw new Error("No output_text returned from model.");

  return RecipeSchema.parse(JSON.parse(jsonText));
}

app.post("/api/update", async (req, reply) => {
  const body = UpdateRequestSchema.safeParse(req.body);
  if (!body.success) {
    reply.code(400);
    return { error: body.error.flatten() };
  }

  return await gptUpdate({
    recipe: body.data.recipe,
    questionAnswers: body.data.questionAnswers,
  });
});

type QuestionAnswer = { index: number; answer: string };

async function gptUpdate(args: { recipe: Recipe; questionAnswers: QuestionAnswer[] }): Promise<Recipe> {

  const answers = args.questionAnswers
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((qa) => ({
      index: qa.index,
      question: args.recipe.questions?.[qa.index] ?? null,
      answer: qa.answer,
    }));

  const response = await openai.responses.create({
    model: "gpt-5.2",
    input: [
      {
        role: "system",
        content: [
          "You are an assistant that updates an existing structured recipe JSON.",
          "A previous step produced recipe JSON and a list of clarification questions in recipe.questions[].",
          "The user answered some of those questions. Update the recipe using ONLY those answers.",
          "",
          "Hard rules:",
          "- Output MUST be a single JSON object matching the schema exactly. No markdown, no extra text.",
          "- Preserve fields that are not affected by the answers.",
          "- Do not invent critical details. If an answer is ambiguous or insufficient, keep or add a question instead.",
          "- Remove questions that are fully answered from recipe.questions[]. Keep unanswered ones.",
          "",
          "Inference policy:",
          "- If an answer explicitly confirms something, set inferred=false for any fields/steps/ingredients that were previously inferred.",
          "- Only change sourceSpans if you are confident; otherwise keep existing sourceSpans as-is.",
        ].join("\n"),
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Current recipe JSON:\n${JSON.stringify(args.recipe)}`,
          },
          {
            type: "input_text",
            text:
              `User answers (index refers to recipe.questions[] in the current recipe):\n` +
              JSON.stringify(answers, null, 2),
          },
          {
            type: "input_text",
            text: `Return the updated recipe JSON only.`,
          },
        ],
      },
    ],
    text: {
      format: zodTextFormat(RecipeSchema, "recipe_schema"),
    },
  });

  const jsonText = response.output_text;
  if (!jsonText) throw new Error("No output_text returned from model.");

  return RecipeSchema.parse(JSON.parse(jsonText));
}

const port = Number(process.env.PORT ?? 8787);
app.listen({ port, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
