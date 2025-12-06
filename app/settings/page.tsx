// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Settings Page

import { Suspense } from "react"
import AppHeader from "@/components/layout/app-header"
import SettingsPanel from "@/components/settings/settings-panel"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Suspense fallback={<LoadingSpinner />}>
          <SettingsPanel />
        </Suspense>
      </main>
    </div>
  )
}
