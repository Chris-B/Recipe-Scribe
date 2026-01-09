import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, Loader2 } from "lucide-react";
import { usePreferences, useUpdatePreferences } from "@/features/user/preferences/api/preferences-api";
import type { CookingPreferences } from "@recipe/shared";

const DEFAULT_COOKING: CookingPreferences = {
    keepScreenAwake: true,
    largeTextMode: false,
    oneStepAtTime: false,
    readAloud: false,
    handsFreeNext: false,
    autoCreateTimers: true,
    timerAlerts: "sound",
};

export function PreferencesCooking() {

    const { data: preferences, isLoading: isLoadingPrefs } = usePreferences();
    const updatePreferences = useUpdatePreferences();

    const [localPrefs, setLocalPrefs] = useState<CookingPreferences>(DEFAULT_COOKING);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (preferences?.cooking) {
            setLocalPrefs({ ...DEFAULT_COOKING, ...preferences.cooking });
        }
    }, [preferences?.cooking]);

    const updateLocal = <K extends keyof CookingPreferences>(key: K, value: CookingPreferences[K]) => {
        setLocalPrefs((prev) => ({ ...prev, [key]: value }));
        setIsDirty(true);
    };

    const handleSave = () => {
        updatePreferences.mutate(
            { cooking: localPrefs },
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
                    <CardTitle className="font-serif">Cooking Mode Behavior</CardTitle>
                    <CardDescription>Settings for when you are cooking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="keepAwake">Keep screen awake</Label>
                            <p className="text-sm text-muted-foreground">Prevent screen from sleeping</p>
                        </div>
                        <Switch id="keepAwake" checked={localPrefs.keepScreenAwake} onCheckedChange={(v) => updateLocal("keepScreenAwake", v)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="largeText">Large text mode</Label>
                            <p className="text-sm text-muted-foreground">Bigger text for easier reading</p>
                        </div>
                        <Switch id="largeText" checked={localPrefs.largeTextMode} onCheckedChange={(v) => updateLocal("largeTextMode", v)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="oneStep">One step at a time</Label>
                            <p className="text-sm text-muted-foreground">Show only current step</p>
                        </div>
                        <Switch id="oneStep" checked={localPrefs.oneStepAtTime} onCheckedChange={(v) => updateLocal("oneStepAtTime", v)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif">Voice Assistance</CardTitle>
                    <CardDescription>Hands-free cooking options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="readAloud">Read next step aloud</Label>
                            <p className="text-sm text-muted-foreground">Voice reads each step</p>
                        </div>
                        <Switch id="readAloud" checked={localPrefs.readAloud} onCheckedChange={(v) => updateLocal("readAloud", v)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="handsFree">{'Hands-free "next step" command'}</Label>
                            <p className="text-sm text-muted-foreground">{'Say "next" to advance'}</p>
                        </div>
                        <Switch id="handsFree" checked={localPrefs.handsFreeNext} onCheckedChange={(v) => updateLocal("handsFreeNext", v)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif">Timer Behavior</CardTitle>
                    <CardDescription>How timers work during cooking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="autoTimers">Auto-create timers from steps</Label>
                            <p className="text-sm text-muted-foreground">Detect times and create timers</p>
                        </div>
                        <Switch id="autoTimers" checked={localPrefs.autoCreateTimers} onCheckedChange={(v) => updateLocal("autoCreateTimers", v)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Timer Alerts</Label>
                        <RadioGroup value={localPrefs.timerAlerts} onValueChange={(v) => updateLocal("timerAlerts", v as CookingPreferences["timerAlerts"])} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="sound" id="sound" />
                                <Label htmlFor="sound" className="font-normal">
                                    Sound
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="vibration" id="vibration" />
                                <Label htmlFor="vibration" className="font-normal">
                                    Vibration
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="both" id="both" />
                                <Label htmlFor="both" className="font-normal">
                                    Both
                                </Label>
                            </div>
                        </RadioGroup>
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
