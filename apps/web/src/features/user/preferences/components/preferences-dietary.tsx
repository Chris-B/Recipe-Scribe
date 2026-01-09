import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2 } from "lucide-react";
import { usePreferences, useUpdatePreferences } from "@/features/user/preferences/api/preferences-api";
import type { DietaryPreferences } from "@recipe/shared";
import { Checkbox } from "@/components/ui/checkbox";

const DEFAULT_DIETARY: DietaryPreferences = {
  patterns: [],
  allergies: [],
  nutritionGoals: [],
  defaultServings: 4,
  constraintType: "soft",
};

export function PreferencesDietary() {

  const { data: preferences, isLoading: isLoadingPrefs } = usePreferences();
  const updatePreferences = useUpdatePreferences();

  const [localPrefs, setLocalPrefs] = useState<DietaryPreferences>(DEFAULT_DIETARY);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (preferences?.dietary) {
      setLocalPrefs({ ...DEFAULT_DIETARY, ...preferences.dietary });
    }
  }, [preferences?.dietary]);

  const updateLocal = <K extends keyof DietaryPreferences>(key: K, value: DietaryPreferences[K]) => {
    setLocalPrefs((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const toggleArrayItem = (array: string[], setArray: (val: string[]) => void, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter((i) => i !== item))
    } else {
      setArray([...array, item])
    }
  }

  const handleSave = () => {
    updatePreferences.mutate(
      { dietary: localPrefs },
      {
        onSuccess: () => setIsDirty(false),
      }
    );
  };

  if (isLoadingPrefs) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Dietary Patterns</CardTitle>
          <CardDescription>Select your dietary preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {["Vegetarian", "Vegan", "Pescatarian", "Keto", "Paleo", "Whole30"].map((diet) => (
              <div key={diet} className="flex items-center space-x-2">
                <Checkbox
                  id={diet}
                  checked={localPrefs.patterns.includes(diet)}
                  onCheckedChange={() => toggleArrayItem(localPrefs.patterns, (patterns) => updateLocal("patterns", patterns as DietaryPreferences["patterns"]), diet)}
                />
                <Label htmlFor={diet} className="font-normal cursor-pointer">
                  {diet}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Allergies & Intolerances</CardTitle>
          <CardDescription>Select ingredients to avoid</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {["Nuts", "Gluten", "Dairy", "Shellfish", "Soy", "Eggs"].map((allergy) => (
              <div key={allergy} className="flex items-center space-x-2">
                <Checkbox
                  id={allergy}
                  checked={localPrefs.allergies.includes(allergy)}
                  onCheckedChange={() => toggleArrayItem(localPrefs.allergies, (allergies) => updateLocal("allergies", allergies as DietaryPreferences["allergies"]), allergy)}
                />
                <Label htmlFor={allergy} className="font-normal">
                  {allergy}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Nutrition Goals</CardTitle>
          <CardDescription>Set your nutrition preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {["High protein", "Low carb", "Low sodium", "Calorie-aware"].map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={goal}
                  checked={localPrefs.nutritionGoals.includes(goal)}
                  onCheckedChange={() => toggleArrayItem(localPrefs.nutritionGoals, (goals) => updateLocal("nutritionGoals", goals as DietaryPreferences["nutritionGoals"]), goal)}
                />
                <Label htmlFor={goal} className="font-normal">
                  {goal}
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4">
            <Label htmlFor="servings">Default Serving Size</Label>
            <Select value={localPrefs.defaultServings.toString()} onValueChange={(v) => updateLocal("defaultServings", parseInt(v) as DietaryPreferences["defaultServings"])}>
              <SelectTrigger id="servings" className="w-32">
                <SelectValue placeholder="Servings" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 4, 6, 8].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n} {n === 1 ? "serving" : "servings"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 pt-4">
            <Label>Constraint Type</Label>
            <RadioGroup value={localPrefs.constraintType} onValueChange={(v) => updateLocal("constraintType", v as "hard" | "soft")} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hard" id="hard" />
                <Label htmlFor="hard" className="font-normal">
                  Hard constraints
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="soft" id="soft" />
                <Label htmlFor="soft" className="font-normal">
                  Soft preferences
                </Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-muted-foreground">
              Hard constraints will strictly exclude items. Soft preferences will try to avoid but may include if
              necessary.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          size="lg"
          className="gap-2"
          onClick={handleSave}
          disabled={!isDirty || updatePreferences.isPending}
        >
          {updatePreferences.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Preferences
        </Button>
      </div>
    </div>
  );
}