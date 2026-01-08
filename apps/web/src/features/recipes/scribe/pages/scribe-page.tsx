import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { MeasurementSystem, Recipe } from "@recipe/shared";
import { SiteHeader } from "@/components/header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MeasurementSystemSchema } from "@recipe/shared";
import { SiteFooter } from "@/components/footer";
import { normalizeRecipe, updateRecipe } from "@/features/recipes/scribe/api/scribe-api";
import { RecipeNotesInput } from "@/features/recipes/scribe/components/scribe-notes-input";
import { QuestionsPrompt } from "@/features/recipes/scribe/components/questions-prompt";
import { RecipeCard } from "@/features/recipes/components/recipe-card";

export function ScribePage() {
  const [notes, setNotes] = useState("");
  const [system, setSystem] = useState<MeasurementSystem>("US");
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState<{ index: number, answer: string }[]>([]);

  const normalize = useMutation({
    mutationFn: async () => normalizeRecipe(notes, system),
    onSuccess: (r) => {
      setRecipe(r);
      setIsLoading(false);
    },
  });

  const update = useMutation({
    mutationFn: async () => updateRecipe(recipe, questionAnswers),
    onSuccess: (r) => {
      setRecipe(r);
      setIsLoading(false);
    },
  });

  const handleNormalize = async () => {
    if (!notes.trim()) return;
    setQuestionAnswers([]);
    setIsLoading(true);
    normalize.mutate();
  };

  const handleAnswerQuestion = (index: number, answer: string) => {
    setQuestionAnswers((prev) => {
      const existing = prev.find((qa) => qa.index === index);
      if (existing) {
        return prev.map((qa) => (qa.index === index ? { ...qa, answer } : qa));
      }
      return [...prev, { index, answer }];
    });
  };

  const handleSubmitAnswers = () => {
    if (!recipe) return;
    setIsLoading(true);
    setQuestionAnswers([]);
    update.mutate();
  };

  const hasUnansweredQuestions = recipe?.questions && recipe.questions.length > 0 && !isLoading;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1 mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl tracking-tight text-foreground sm:text-5xl">Recipe Scribe</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Transform your scribbled notes into beautifully structured recipes. Just paste your ideas, and let the magic
            happen.
          </p>
        </div>

        {/* Unit Selector */}
        <div className="flex items-center justify-end gap-3 mb-6">
          <span className="text-sm text-muted-foreground">Units</span>
          <Select value={system as unknown as string} onValueChange={(v) => setSystem(MeasurementSystemSchema.parse(v))}>
            <SelectTrigger className="w-[100px] cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US" className="cursor-pointer">US</SelectItem>
              <SelectItem value="METRIC" className="cursor-pointer">Metric</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-8">
          {/* Notes Input - full width but compact */}
          <RecipeNotesInput
            notes={notes}
            onNotesChange={setNotes}
            onNormalize={handleNormalize}
            isLoading={isLoading}
          />

          {/* Questions Prompt - appears between input and recipe when needed */}
          {hasUnansweredQuestions && (
            <QuestionsPrompt
              questions={recipe.questions!}
              answers={questionAnswers}
              onAnswer={handleAnswerQuestion}
              onSubmit={handleSubmitAnswers}
            />
          )}

          {/* Recipe Card - full width, flows naturally */}
          <RecipeCard recipe={recipe} isLoading={isLoading} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}