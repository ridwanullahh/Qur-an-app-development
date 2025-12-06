// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Memorization Page - Spaced Repetition System

import { Suspense } from "react"
import AppHeader from "@/components/layout/app-header"
import MemorizationDashboard from "@/components/memorization/memorization-dashboard"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function MemorizePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Suspense fallback={<LoadingSpinner />}>
          <MemorizationDashboard />
        </Suspense>
      </main>
    </div>
  )
}
