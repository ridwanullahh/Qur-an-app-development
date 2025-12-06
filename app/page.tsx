// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Main Quran App Page

import { Suspense } from "react"
import QuranReader from "@/components/quran/quran-reader"
import AppHeader from "@/components/layout/app-header"
import AppSidebar from "@/components/layout/app-sidebar"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Suspense fallback={<LoadingSpinner />}>
            <QuranReader />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
