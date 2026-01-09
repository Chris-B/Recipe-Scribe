import { SiteHeader } from "@/components/header"
import { SiteFooter } from "@/components/footer"
import { PreferencesTabs } from "@/features/user/preferences/components/preferences-tabs"

export function PreferencesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <PreferencesTabs />
      </main>
      <SiteFooter />
    </div>
  )
}