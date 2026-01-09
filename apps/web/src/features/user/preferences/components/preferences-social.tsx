import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, Loader2 } from "lucide-react";
import { usePreferences, useUpdatePreferences } from "@/features/user/preferences/api/preferences-api";
import type { SocialPreferences } from "@recipe/shared";

const DEFAULT_SOCIAL: SocialPreferences = {
    recipeVisibility: "private",
    allowSave: true,
    allowRemix: true,
    allowComments: true,
    requireCredit: false,
    featuredOptIn: false,
};

export function PreferencesSocial() {

    const { data: preferences, isLoading: isLoadingPrefs } = usePreferences();
    const updatePreferences = useUpdatePreferences();

    const [localPrefs, setLocalPrefs] = useState<SocialPreferences>(DEFAULT_SOCIAL);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (preferences?.social) {
            setLocalPrefs({ ...DEFAULT_SOCIAL, ...preferences.social });
        }
    }, [preferences?.social]);

    const updateLocal = <K extends keyof SocialPreferences>(key: K, value: SocialPreferences[K]) => {
        setLocalPrefs((prev) => ({ ...prev, [key]: value }));
        setIsDirty(true);
    };

    const handleSave = () => {
        updatePreferences.mutate(
            { social: localPrefs },
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
                    <CardTitle className="font-serif">Recipe Visibility</CardTitle>
                    <CardDescription>Control who can see your recipes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <RadioGroup value={localPrefs.recipeVisibility} onValueChange={(value) => updateLocal('recipeVisibility', value as SocialPreferences['recipeVisibility'])} className="flex flex-col gap-3">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="private" id="private" />
                            <Label htmlFor="private" className="font-normal">
                                Private - Only you
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="link" id="link" />
                            <Label htmlFor="link" className="font-normal">
                                Shared with link - Anyone with the link
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="public" id="public" />
                            <Label htmlFor="public" className="font-normal">
                                Public - Visible to everyone
                            </Label>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif">Allow Others To</CardTitle>
                    <CardDescription>Control how others can interact with your recipes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="allowSave">Save my recipes</Label>
                        <Switch id="allowSave" checked={localPrefs.allowSave} onCheckedChange={(checked) => updateLocal('allowSave', checked)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="allowRemix">Remix my recipes</Label>
                        <Switch id="allowRemix" checked={localPrefs.allowRemix} onCheckedChange={(checked) => updateLocal('allowRemix', checked)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="allowComments">Comment on my recipes</Label>
                        <Switch id="allowComments" checked={localPrefs.allowComments} onCheckedChange={(checked) => updateLocal('allowComments', checked)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif">Attribution & Featuring</CardTitle>
                    <CardDescription>Control credit and featuring options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="requireCredit">Require credit when remixed</Label>
                            <p className="text-sm text-muted-foreground">Others must credit you when remixing</p>
                        </div>
                        <Switch id="requireCredit" checked={localPrefs.requireCredit} onCheckedChange={(checked) => updateLocal('requireCredit', checked)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="featuredOptIn">Featured recipe eligibility</Label>
                            <p className="text-sm text-muted-foreground">Allow your recipes to be featured</p>
                        </div>
                        <Switch id="featuredOptIn" checked={localPrefs.featuredOptIn} onCheckedChange={(checked) => updateLocal('featuredOptIn', checked)} />
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