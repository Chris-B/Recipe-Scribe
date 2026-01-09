import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, Loader2 } from "lucide-react";
import { usePreferences, useUpdatePreferences } from "@/features/user/preferences/api/preferences-api";
import type { LibraryPreferences } from "@recipe/shared";

const DEFAULT_LIBRARY: LibraryPreferences = {
    defaultView: "card",
    sortOrder: "recent",
    autoTagCuisine: true,
    autoTagDietary: true,
    autoTagMealType: true,
    autoAddFavorites: false,
    allowDuplicates: false,
};

export function PreferencesLibrary() {

    const { data: preferences, isLoading: isLoadingPrefs } = usePreferences();
    const updatePreferences = useUpdatePreferences();

    const [localPrefs, setLocalPrefs] = useState<LibraryPreferences>(DEFAULT_LIBRARY);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (preferences?.library) {
            setLocalPrefs({ ...DEFAULT_LIBRARY, ...preferences.library });
        }
    }, [preferences?.library]);

    const updateLocal = <K extends keyof LibraryPreferences>(key: K, value: LibraryPreferences[K]) => {
        setLocalPrefs((prev) => ({ ...prev, [key]: value }));
        setIsDirty(true);
    };

    const handleSave = () => {
        updatePreferences.mutate(
            { library: localPrefs },
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
                    <CardTitle className="font-serif">Default View</CardTitle>
                    <CardDescription>How your recipe collection is displayed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <Label>Recipe View</Label>
                        <RadioGroup value={localPrefs.defaultView} onValueChange={(value) => updateLocal('defaultView', value as LibraryPreferences['defaultView'])} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="card" id="card" />
                                <Label htmlFor="card" className="font-normal">
                                    Card view
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="list" id="list" />
                                <Label htmlFor="list" className="font-normal">
                                    List view
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="compact" id="compact" />
                                <Label htmlFor="compact" className="font-normal">
                                    Compact
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-3">
                        <Label>Sort Order</Label>
                        <RadioGroup value={localPrefs.sortOrder} onValueChange={(value) => updateLocal('sortOrder', value as LibraryPreferences['sortOrder'])} className="flex flex-col gap-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="recent" id="recent" />
                                <Label htmlFor="recent" className="font-normal">
                                    Recently added
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cooked" id="cooked" />
                                <Label htmlFor="cooked" className="font-normal">
                                    Most cooked
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="alpha" id="alpha" />
                                <Label htmlFor="alpha" className="font-normal">
                                    Alphabetical
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif">Auto-Tagging</CardTitle>
                    <CardDescription>Automatically tag recipes when saved</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="tagCuisine">Tag by cuisine</Label>
                        <Switch id="tagCuisine" checked={localPrefs.autoTagCuisine} onCheckedChange={(checked) => updateLocal('autoTagCuisine', checked)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="tagDietary">Tag by dietary type</Label>
                        <Switch id="tagDietary" checked={localPrefs.autoTagDietary} onCheckedChange={(checked) => updateLocal('autoTagDietary', checked)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="tagMeal">Tag by meal type</Label>
                        <Switch id="tagMeal" checked={localPrefs.autoTagMealType} onCheckedChange={(checked) => updateLocal('autoTagMealType', checked)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif">Collection Behavior</CardTitle>
                    <CardDescription>How collections and folders work</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="autoFavorites">Auto-add to Favorites</Label>
                            <p className="text-sm text-muted-foreground">Add saved recipes to Favorites automatically</p>
                        </div>
                        <Switch id="autoFavorites" checked={localPrefs.autoAddFavorites} onCheckedChange={(checked) => updateLocal('autoAddFavorites', checked)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="allowDuplicates">Allow duplicates</Label>
                            <p className="text-sm text-muted-foreground">Allow the same recipe in multiple collections</p>
                        </div>
                        <Switch id="allowDuplicates" checked={localPrefs.allowDuplicates} onCheckedChange={(checked) => updateLocal('allowDuplicates', checked)} />
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