import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PenLine, Salad, Search, FolderOpen, Users, ChefHat, Bell, Shield } from "lucide-react"
import { PreferencesScribe } from "@/features/user/preferences/components/preferences-scribe"
import { PreferencesCooking } from "@/features/user/preferences/components/preferences-cooking"
import { PreferencesDietary } from "@/features/user/preferences/components/preferences-dietary"
import { PreferencesDiscovery } from "@/features/user/preferences/components/preferences-discovery"
import { PreferencesLibrary } from "@/features/user/preferences/components/preferences-library"
import { PreferencesNotifications } from "@/features/user/preferences/components/preferences-notifications"
import { PreferencesPrivacy } from "@/features/user/preferences/components/preferences-privacy"
import { PreferencesSocial } from "@/features/user/preferences/components/preferences-social"

const VALID_TABS = ["scribe", "dietary", "discovery", "library", "social", "cooking", "notifications", "privacy"] as const
type TabValue = typeof VALID_TABS[number]

export function PreferencesTabs() {
  const [activeTab, setActiveTab] = useState<TabValue>("scribe")

  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (VALID_TABS.includes(hash as TabValue)) {
      setActiveTab(hash as TabValue)
      window.history.replaceState(null, "", window.location.pathname + window.location.search)
    }
  }, [])

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabValue)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-medium text-foreground">Preferences</h1>
        <p className="text-muted-foreground mt-1">Customize your Recipe Scribe experience</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
          <TabsTrigger
            value="scribe"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <PenLine className="h-4 w-4" />
            <span className="hidden sm:inline">Scribe</span>
          </TabsTrigger>
          <TabsTrigger
            value="dietary"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Salad className="h-4 w-4" />
            <span className="hidden sm:inline">Dietary</span>
          </TabsTrigger>
          <TabsTrigger
            value="discovery"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Discovery</span>
          </TabsTrigger>
          <TabsTrigger
            value="library"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Library</span>
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Social</span>
          </TabsTrigger>
          <TabsTrigger
            value="cooking"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <ChefHat className="h-4 w-4" />
            <span className="hidden sm:inline">Cooking</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
        </TabsList>

        {/* Recipe Creation & Scribe Preferences */}
        <TabsContent value="scribe" className="space-y-6">
          <PreferencesScribe />
        </TabsContent>

        {/* Dietary & Lifestyle Preferences */}
        <TabsContent value="dietary" className="space-y-6">
          <PreferencesDietary />
        </TabsContent>

        {/* Discovery & Feed Preferences */}
        <TabsContent value="discovery" className="space-y-6">
          <PreferencesDiscovery />
        </TabsContent>

        {/* Library & Organization Preferences */}
        <TabsContent value="library" className="space-y-6">
          <PreferencesLibrary />
        </TabsContent>

        {/* Social & Sharing Preferences */}
        <TabsContent value="social" className="space-y-6">
          <PreferencesSocial />
        </TabsContent>

        {/* Cooking Mode Preferences */}
        <TabsContent value="cooking" className="space-y-6">
          <PreferencesCooking />
        </TabsContent>

        {/* Notifications & Emails */}
        <TabsContent value="notifications" className="space-y-6">
          <PreferencesNotifications />
        </TabsContent>

        {/* Account & Privacy */}
        <TabsContent value="privacy" className="space-y-6">
          <PreferencesPrivacy />
        </TabsContent>

      </Tabs>
    </div>
  )
}