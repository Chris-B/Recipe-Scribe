import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, Loader2 } from "lucide-react";
import { usePreferences, useUpdatePreferences } from "@/features/user/preferences/api/preferences-api";
import type { DiscoveryPreferences } from "@recipe/shared";
import { Checkbox } from "@/components/ui/checkbox";

const DEFAULT_DISCOVERY: DiscoveryPreferences = {
    preferredCuisines: [],
    cookingTime: "weeknight",
    skillLevel: "intermediate",
    showTrending: true,
    showNewCreations: true,
    showHighlyRated: true,
};

export function PreferencesDiscovery() {

    const { data: preferences, isLoading: isLoadingPrefs } = usePreferences();
    const updatePreferences = useUpdatePreferences();

    const [localPrefs, setLocalPrefs] = useState<DiscoveryPreferences>(DEFAULT_DISCOVERY);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (preferences?.discovery) {
            setLocalPrefs({ ...DEFAULT_DISCOVERY, ...preferences.discovery });
        }
    }, [preferences?.discovery]);

    const updateLocal = <K extends keyof DiscoveryPreferences>(key: K, value: DiscoveryPreferences[K]) => {
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
            { discovery: localPrefs },
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
                    <CardTitle className="font-serif">Preferred Cuisines</CardTitle>
                    <CardDescription>Select cuisines to feature in your feed</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                            "Italian",
                            "Mexican",
                            "Chinese",
                            "Japanese",
                            "Indian",
                            "Thai",
                            "Mediterranean",
                            "French",
                            "American",
                        ].map((cuisine) => (
                            <div key={cuisine} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`cuisine-${cuisine}`}
                                    checked={localPrefs.preferredCuisines.includes(cuisine)}
                                    onCheckedChange={() => toggleArrayItem(localPrefs.preferredCuisines, (val) => updateLocal('preferredCuisines', val as DiscoveryPreferences['preferredCuisines']), cuisine)}
                                />
                                <Label htmlFor={`cuisine-${cuisine}`} className="font-normal">
                                    {cuisine}
                                </Label>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif">Cooking Preferences</CardTitle>
                    <CardDescription>Set your preferred cooking time and skill level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <Label>Preferred Cooking Time</Label>
                        <RadioGroup value={localPrefs.cookingTime} onValueChange={(value) => updateLocal('cookingTime', value as DiscoveryPreferences['cookingTime'])} className="flex flex-col gap-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="quick" id="quick" />
                                <Label htmlFor="quick" className="font-normal">
                                    {"Quick (<30 min)"}
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="weeknight" id="weeknight" />
                                <Label htmlFor="weeknight" className="font-normal">
                                    Weeknight (30-60 min)
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="weekend" id="weekend" />
                                <Label htmlFor="weekend" className="font-normal">
                                    Weekend / Long cook
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-3">
                        <Label>Skill Level</Label>
                        <RadioGroup value={localPrefs.skillLevel} onValueChange={(value) => updateLocal('skillLevel', value as DiscoveryPreferences['skillLevel'])} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="beginner" id="beginner" />
                                <Label htmlFor="beginner" className="font-normal">
                                    Beginner
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="intermediate" id="intermediate" />
                                <Label htmlFor="intermediate" className="font-normal">
                                    Intermediate
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="advanced" id="advanced" />
                                <Label htmlFor="advanced" className="font-normal">
                                    Advanced
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif">Show Me</CardTitle>
                    <CardDescription>Control what appears in your feed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="showTrending">Trending recipes</Label>
                        <Switch id="showTrending" checked={localPrefs.showTrending} onCheckedChange={(checked) => updateLocal('showTrending', checked)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="showNew">New user creations</Label>
                        <Switch id="showNew" checked={localPrefs.showNewCreations} onCheckedChange={(checked) => updateLocal('showNewCreations', checked)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="showRated">Highly rated recipes</Label>
                        <Switch id="showRated" checked={localPrefs.showHighlyRated} onCheckedChange={(checked) => updateLocal('showHighlyRated', checked)} />
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