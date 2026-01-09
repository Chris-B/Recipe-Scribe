import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2 } from "lucide-react";
import { usePreferences, useUpdatePreferences } from "@/features/user/preferences/api/preferences-api";
import type { NotificationPreferences } from "@recipe/shared";

const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
    recipeSaved: true,
    commented: true,
    featured: true,
    emailWeekly: true,
    emailFeatured: false,
    emailTips: false,
};

export function PreferencesNotifications() {

    const { data: preferences, isLoading: isLoadingPrefs } = usePreferences();
    const updatePreferences = useUpdatePreferences();

    const [localPrefs, setLocalPrefs] = useState<NotificationPreferences>(DEFAULT_NOTIFICATIONS);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (preferences?.notifications) {
            setLocalPrefs({ ...DEFAULT_NOTIFICATIONS, ...preferences.notifications });
        }
    }, [preferences?.notifications]);

    const updateLocal = <K extends keyof NotificationPreferences>(key: K, value: NotificationPreferences[K]) => {
        setLocalPrefs((prev) => ({ ...prev, [key]: value }));
        setIsDirty(true);
    };

    const handleSave = () => {
        updatePreferences.mutate(
            { notifications: localPrefs },
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
                    <CardTitle className="font-serif">In-App Notifications</CardTitle>
                    <CardDescription>Notifications within Recipe Scribe</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="notifSaved">Recipe saved by others</Label>
                        <Switch id="notifSaved" checked={localPrefs.recipeSaved} onCheckedChange={(value) => updateLocal('recipeSaved', value)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="notifCommented">Recipe commented on</Label>
                        <Switch id="notifCommented" checked={localPrefs.commented} onCheckedChange={(value) => updateLocal('commented', value)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="notifFeatured">Recipe featured</Label>
                        <Switch id="notifFeatured" checked={localPrefs.featured} onCheckedChange={(value) => updateLocal('featured', value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif">Email Notifications</CardTitle>
                    <CardDescription>Emails from Recipe Scribe</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="emailWeekly">Weekly recipe recommendations</Label>
                            <p className="text-sm text-muted-foreground">Personalized recipes every week</p>
                        </div>
                        <Switch id="emailWeekly" checked={localPrefs.emailWeekly} onCheckedChange={(value) => updateLocal('emailWeekly', value)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="emailFeatured">New featured recipes</Label>
                            <p className="text-sm text-muted-foreground">When new recipes are featured</p>
                        </div>
                        <Switch id="emailFeatured" checked={localPrefs.emailFeatured} onCheckedChange={(value) => updateLocal('emailFeatured', value)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="emailTips">Tips & cooking inspiration</Label>
                            <p className="text-sm text-muted-foreground">Cooking tips and ideas</p>
                        </div>
                        <Switch id="emailTips" checked={localPrefs.emailTips} onCheckedChange={(value) => updateLocal('emailTips', value)} />
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