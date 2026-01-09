import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, Loader2 } from "lucide-react";
import { usePreferences, useUpdatePreferences } from "@/features/user/preferences/api/preferences-api";
import type { PrivacyPreferences } from "@recipe/shared";

const DEFAULT_PRIVACY: PrivacyPreferences = {
    profileVisibility: "public",
    searchDiscoverable: true,
    improveScribe: false,
};

export function PreferencesPrivacy() {

    const { data: preferences, isLoading: isLoadingPrefs } = usePreferences();
    const updatePreferences = useUpdatePreferences();

    const [localPrefs, setLocalPrefs] = useState<PrivacyPreferences>(DEFAULT_PRIVACY);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (preferences?.privacy) {
            setLocalPrefs({ ...DEFAULT_PRIVACY, ...preferences.privacy });
        }
    }, [preferences?.privacy]);

    const updateLocal = <K extends keyof PrivacyPreferences>(key: K, value: PrivacyPreferences[K]) => {
        setLocalPrefs((prev) => ({ ...prev, [key]: value }));
        setIsDirty(true);
    };

    const handleSave = () => {
        updatePreferences.mutate(
            { privacy: localPrefs },
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
                    <CardTitle className="font-serif">Profile Visibility</CardTitle>
                    <CardDescription>Control who can see your profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <RadioGroup
                            value={localPrefs.profileVisibility}
                            onValueChange={(value) => updateLocal('profileVisibility', value as PrivacyPreferences['profileVisibility'])}
                            className="flex flex-col gap-3"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="private" id="profile-private" />
                                <Label htmlFor="profile-private" className="font-normal">
                                    Private - Only you
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="public" id="profile-public" />
                                <Label htmlFor="profile-public" className="font-normal">
                                    Public - Visible to everyone
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <div>
                            <Label htmlFor="searchDiscoverable">Search discoverability</Label>
                            <p className="text-sm text-muted-foreground">Allow others to find you in search</p>
                        </div>
                        <Switch id="searchDiscoverable" checked={localPrefs.searchDiscoverable} onCheckedChange={(checked) => updateLocal('searchDiscoverable', checked)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif">Data Usage</CardTitle>
                    <CardDescription>How your data is used</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="improveScribe">Allow my recipes to improve the scribe</Label>
                            <p className="text-sm text-muted-foreground">Help make Recipe Scribe better for everyone</p>
                        </div>
                        <Switch id="improveScribe" checked={localPrefs.improveScribe} onCheckedChange={(checked) => updateLocal('improveScribe', checked)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif">Export & Account</CardTitle>
                    <CardDescription>Export your data or manage your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <Label>Export Recipes</Label>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm">
                                Export as PDF
                            </Button>
                            <Button variant="outline" size="sm">
                                Export as JSON
                            </Button>
                            <Button variant="outline" size="sm">
                                Export as Markdown
                            </Button>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-border">
                        <Button variant="destructive" size="sm">
                            Delete Account
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2">
                            This will permanently delete your account and all your data.
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