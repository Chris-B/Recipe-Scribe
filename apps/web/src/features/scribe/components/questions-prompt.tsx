import { MessageCircleQuestion, Send, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionsPromptProps {
  questions: string[];
  answers: { index: number; answer: string }[];
  onAnswer: (index: number, answer: string) => void;
  onSubmit: () => void;
}

export function QuestionsPrompt({ questions, answers, onAnswer, onSubmit }: QuestionsPromptProps) {

  const getAnswerForIndex = (index: number) => answers.find((qa) => qa.index === index)?.answer ?? "";

  const allAnswered = questions.every((_, i) => getAnswerForIndex(i).trim());

  return (
    <Card className="border-primary/30 bg-accent/50 shadow-sm animate-in slide-in-from-top-2 duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <MessageCircleQuestion className="h-4 w-4 text-primary-foreground" />
          </span>
          A few quick questions
        </CardTitle>
        <p className="text-sm text-muted-foreground">Help me perfect your recipe with a bit more detail</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.map((question, index) => (
          <div key={index} className="space-y-2">
            <label className="flex items-start gap-2 text-sm font-medium text-foreground">
              <ChevronRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              {question}
            </label>
            <Input
              value={getAnswerForIndex(index)}
              onChange={(e) => onAnswer(index, e.target.value)}
              placeholder="Type your answer..."
              className="bg-card"
            />
          </div>
        ))}

        <div className="flex justify-end pt-2">
          <Button onClick={onSubmit} disabled={!allAnswered} size="sm" className="gap-2 cursor-pointer">
            <Send className="h-3.5 w-3.5" />
            Update Recipe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
