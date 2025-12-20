import { Clock, Users, ChefHat, Flame, BookOpen, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Recipe } from "@recipe/shared";

interface RecipeCardProps {
  recipe: Recipe | null;
  isLoading: boolean;
}

export function RecipeCard({ recipe, isLoading }: RecipeCardProps) {
  if (isLoading) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="flex min-h-[200px] items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Crafting your recipe...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recipe) {
    return (
      <Card className="border-dashed border-2 border-border bg-muted/30">
        <CardContent className="flex min-h-[160px] items-center justify-center py-10">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
              <BookOpen className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Your recipe will appear here</p>
              <p className="text-sm text-muted-foreground">
                Add your notes and click "Create Recipe" to get started
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card shadow-sm overflow-hidden">
      {/* Header with title and meta */}
      <div className="bg-accent/50 px-6 py-6 sm:px-8">
        <h3 className="font-serif text-2xl sm:text-3xl font-medium text-foreground text-balance">
          {recipe.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed mt-2">{recipe.description}</p>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          {recipe.totalTimeMinutes && (
            <Badge variant="secondary" className="gap-1.5 font-normal">
              <Clock className="h-3 w-3" />
              {recipe.totalTimeMinutes} min
            </Badge>
          )}
          {recipe.servings && (
            <Badge variant="secondary" className="gap-1.5 font-normal">
              <Users className="h-3 w-3" />
              {recipe.servings} servings
            </Badge>
          )}
          <Badge variant="outline" className="gap-1.5 font-normal">
            {recipe.measurementSystem === "US" ? "US" : "Metric"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Ingredients - narrower column */}
          <div className="lg:col-span-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              <ChefHat className="h-4 w-4" />
              Ingredients
            </h4>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {ing.inferred && <Sparkles className="h-3 w-3 text-primary shrink-0" />}
                    <span className="text-foreground">
                      <span className="font-medium">
                        {ing.quantity ?? ""} {ing.unit ?? ""}
                      </span>{" "}
                      {ing.name}
                      {ing.preparation && <span className="text-muted-foreground">, {ing.preparation}</span>}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps - wider column */}
          <div className="lg:col-span-3">
            <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              <Flame className="h-4 w-4" />
              Instructions
            </h4>
            <ol className="space-y-4">
              {recipe.steps
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((step) => (
                  <li key={step.order} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      {step.order}
                    </span>
                    <div className="pt-0.5 space-y-1 flex-1">
                      <p className="text-foreground leading-relaxed">{step.text}</p>
                      {(step.durationMinutes || step.temperatureC) && (
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          {step.durationMinutes && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {step.durationMinutes} min
                            </span>
                          )}
                          {step.temperatureC && (
                            <span className="flex items-center gap-1">
                              <Flame className="h-3 w-3" />
                              {step.temperatureC}°C
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
            </ol>
          </div>
        </div>

        {/* Notes and Tags */}
        {(recipe.notes.length > 0 || recipe.tags.length > 0) && (
          <>
            <Separator className="my-6" />
            <div className="grid gap-6 sm:grid-cols-2">
              {recipe.notes.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                    Chef's Notes
                  </h4>
                  <ul className="space-y-2">
                    {recipe.notes.map((note, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">•</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {recipe.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs font-normal">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
