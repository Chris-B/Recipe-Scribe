import { Sparkles, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface RecipeNotesInputProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  onNormalize: () => void;
  isLoading: boolean;
}

export function RecipeNotesInput({ notes, onNotesChange, onNormalize, isLoading }: RecipeNotesInputProps) {
  const canNormalize = notes.trim().length > 0;

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4 mb-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
            <Lightbulb className="h-5 w-5 text-accent-foreground" />
          </span>
          <div>
            <h2 className="text-lg font-medium text-foreground">Your Recipe Notes</h2>
            <p className="text-sm text-muted-foreground">
              Jot down ingredients, cooking times, temperatures—anything goes!
            </p>
          </div>
        </div>

        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="chicken thighs
soy sauce
honey
garlic
350 for ~25 min
serve over rice..."
          className="min-h-[180px] resize-none bg-muted/50 text-base leading-relaxed placeholder:text-muted-foreground/60 focus-visible:ring-primary"
        />

        <div className="flex items-center justify-between gap-4 mt-4">
          <p className="text-xs text-muted-foreground">
            Tip: Include temps like "350°" or times like "25 min" for better results
          </p>
          <Button
            onClick={onNormalize}
            disabled={!canNormalize || isLoading}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Sparkles className="h-4 w-4" />
            {isLoading ? "Creating..." : "Create Recipe"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
