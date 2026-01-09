import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2 } from "lucide-react";
import { usePreferences, useUpdatePreferences } from "@/features/user/preferences/api/preferences-api";
import type { ScribePreferences } from "@recipe/shared";

const DEFAULT_SCRIBE: ScribePreferences = {
  verbosity: "standard",
  tone: "instructional",
  creativity: 50,
  cuisineBias: "none",
  useOnlyListed: false,
  allowPantryStaples: true,
  units: "us",
  weightVsVolume: "volume",
  stepFormat: "numbered",
  includePrepTimes: true,
};

export function PreferencesScribe() {

  const { data: preferences, isLoading: isLoadingPrefs } = usePreferences();
  const updatePreferences = useUpdatePreferences();

  const [localPrefs, setLocalPrefs] = useState<ScribePreferences>(DEFAULT_SCRIBE);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (preferences?.scribe) {
      setLocalPrefs({ ...DEFAULT_SCRIBE, ...preferences.scribe });
    }
  }, [preferences?.scribe]);

  const updateLocal = <K extends keyof ScribePreferences>(key: K, value: ScribePreferences[K]) => {
    setLocalPrefs((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    updatePreferences.mutate(
      { scribe: localPrefs },
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
          <CardTitle className="font-serif">Generation Style</CardTitle>
          <CardDescription>Control how the recipe scribe generates recipes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Recipe Verbosity</Label>
            <RadioGroup
              value={localPrefs.verbosity}
              onValueChange={(v) => updateLocal("verbosity", v as ScribePreferences["verbosity"])}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="concise" id="scribe-concise" />
                <Label htmlFor="scribe-concise" className="font-normal">
                  Concise
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="scribe-standard" />
                <Label htmlFor="scribe-standard" className="font-normal">
                  Standard
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="detailed" id="scribe-detailed" />
                <Label htmlFor="scribe-detailed" className="font-normal">
                  Detailed
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Tone</Label>
            <RadioGroup
              value={localPrefs.tone}
              onValueChange={(v) => updateLocal("tone", v as ScribePreferences["tone"])}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="casual" id="scribe-casual" />
                <Label htmlFor="scribe-casual" className="font-normal">
                  Casual
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professional" id="scribe-professional" />
                <Label htmlFor="scribe-professional" className="font-normal">
                  Professional
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="instructional" id="scribe-instructional" />
                <Label htmlFor="scribe-instructional" className="font-normal">
                  Instructional
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Creativity Level</Label>
              <span className="text-sm text-muted-foreground">
                {localPrefs.creativity < 33 ? "Faithful" : localPrefs.creativity < 66 ? "Balanced" : "Inventive"}
              </span>
            </div>
            <Slider
              value={[localPrefs.creativity]}
              onValueChange={([v]) => updateLocal("creativity", v ?? 50)}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Faithful to notes</span>
              <span>Inventive</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scribe-cuisineBias">Default Cuisine Bias</Label>
            <Select value={localPrefs.cuisineBias} onValueChange={(v) => updateLocal("cuisineBias", v)}>
              <SelectTrigger id="scribe-cuisineBias">
                <SelectValue placeholder="Select cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="italian">Italian</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="mexican">Mexican</SelectItem>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="american">American</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Ingredient Handling</CardTitle>
          <CardDescription>Control how ingredients are processed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="scribe-useOnlyListed">Use only listed ingredients</Label>
              <p className="text-sm text-muted-foreground">{"Don't add extra ingredients"}</p>
            </div>
            <Switch
              id="scribe-useOnlyListed"
              checked={localPrefs.useOnlyListed}
              onCheckedChange={(v) => updateLocal("useOnlyListed", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="scribe-allowPantry">Allow pantry staples by default</Label>
              <p className="text-sm text-muted-foreground">Salt, oil, water, etc.</p>
            </div>
            <Switch
              id="scribe-allowPantry"
              checked={localPrefs.allowPantryStaples}
              onCheckedChange={(v) => updateLocal("allowPantryStaples", v)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Measurements & Format</CardTitle>
          <CardDescription>Set your preferred units and formatting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Units</Label>
            <RadioGroup
              value={localPrefs.units}
              onValueChange={(v) => updateLocal("units", v as ScribePreferences["units"])}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="us" id="scribe-us" />
                <Label htmlFor="scribe-us" className="font-normal">
                  US
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="metric" id="scribe-metric" />
                <Label htmlFor="scribe-metric" className="font-normal">
                  Metric
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Weight vs Volume Preference</Label>
            <RadioGroup
              value={localPrefs.weightVsVolume}
              onValueChange={(v) => updateLocal("weightVsVolume", v as ScribePreferences["weightVsVolume"])}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weight" id="scribe-weight" />
                <Label htmlFor="scribe-weight" className="font-normal">
                  Weight
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="volume" id="scribe-volume" />
                <Label htmlFor="scribe-volume" className="font-normal">
                  Volume
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Step Format</Label>
            <RadioGroup
              value={localPrefs.stepFormat}
              onValueChange={(v) => updateLocal("stepFormat", v as ScribePreferences["stepFormat"])}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="numbered" id="scribe-numbered" />
                <Label htmlFor="scribe-numbered" className="font-normal">
                  Numbered
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paragraph" id="scribe-paragraph" />
                <Label htmlFor="scribe-paragraph" className="font-normal">
                  Paragraph
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="scribe-prepTimes">Include prep times by default</Label>
            </div>
            <Switch
              id="scribe-prepTimes"
              checked={localPrefs.includePrepTimes}
              onCheckedChange={(v) => updateLocal("includePrepTimes", v)}
            />
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
