"use client"

import type React from "react"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Two-Page Mushaf Spread - Authentic Physical Book Experience with RTL

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useQuran } from "@/contexts/quran-context"
import { useI18n } from "@/lib/i18n"
import MushafFrame from "./mushaf-frame"
import MushafPageContent from "./mushaf-page-content"
import { cn } from "@/lib/utils"

export default function MushafPageSpread() {
  const { currentPage, goToPage, currentJuz, surahInfo } = useQuran()
  const { isRTL } = useI18n()
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationDirection, setAnimationDirection] = useState<"next" | "prev" | null>(null)

  // When you open an Arabic book, page 1 is on the right side
  const rightPageNum = currentPage % 2 === 1 ? currentPage : currentPage - 1
  const leftPageNum = rightPageNum + 1

  const handlePageChange = (direction: "next" | "prev") => {
    if (isAnimating) return

    setIsAnimating(true)
    setAnimationDirection(direction)

    setTimeout(() => {
      if (direction === "next" && leftPageNum < 604) {
        goToPage(leftPageNum + 1)
      } else if (direction === "prev" && rightPageNum > 1) {
        goToPage(rightPageNum - 2)
      }
      setIsAnimating(false)
      setAnimationDirection(null)
    }, 400)
  }

  // Keyboard navigation - RTL aware
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePageChange("next")
      } else if (e.key === "ArrowRight") {
        handlePageChange("prev")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentPage, isAnimating])

  // Touch/swipe navigation
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handlePageChange("next")
      } else {
        handlePageChange("prev")
      }
    }
    setTouchStart(null)
  }

  return (
    <div
      className="mushaf-spread-container relative w-full max-w-7xl mx-auto select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handlePageChange("next")}
        disabled={leftPageNum >= 604 || isAnimating}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-16 w-10 rounded-l-none bg-background/80 hover:bg-background shadow-lg"
        aria-label="الصفحة التالية"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handlePageChange("prev")}
        disabled={rightPageNum <= 1 || isAnimating}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-16 w-10 rounded-r-none bg-background/80 hover:bg-background shadow-lg"
        aria-label="الصفحة السابقة"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Book spine shadow in center */}
      <div className="absolute left-1/2 top-0 bottom-0 w-6 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/15 to-transparent z-10 pointer-events-none" />

      <div className="flex flex-row-reverse gap-0 px-12" dir="rtl">
        {/* RIGHT Page (Odd number - Page 1, 3, 5, etc.) - This is the FIRST page in RTL */}
        <div
          className={cn(
            "w-1/2 transition-transform duration-400 origin-left",
            isAnimating && animationDirection === "next" && "animate-page-flip-left",
            isAnimating && animationDirection === "prev" && "animate-page-flip-right",
          )}
        >
          <MushafFrame
            pageNumber={rightPageNum}
            juzNumber={currentJuz}
            surahName={surahInfo?.nameArabic ? `سورة ${surahInfo.nameArabic}` : ""}
            isLeftPage={false}
          >
            <MushafPageContent pageNumber={rightPageNum} />
          </MushafFrame>
        </div>

        {/* LEFT Page (Even number - Page 2, 4, 6, etc.) - This is the SECOND page in RTL */}
        <div
          className={cn(
            "w-1/2 transition-transform duration-400 origin-right",
            isAnimating && animationDirection === "next" && "animate-page-flip-right",
            isAnimating && animationDirection === "prev" && "animate-page-flip-left",
          )}
        >
          <MushafFrame
            pageNumber={leftPageNum}
            juzNumber={currentJuz}
            surahName={surahInfo?.nameArabic ? `سورة ${surahInfo.nameArabic}` : ""}
            isLeftPage={true}
          >
            <MushafPageContent pageNumber={leftPageNum} />
          </MushafFrame>
        </div>
      </div>

      {/* Page indicator - RTL order */}
      <div className="text-center mt-4 text-sm text-muted-foreground font-amiri" dir="rtl">
        <span>
          صفحة {rightPageNum} - {leftPageNum}
        </span>
        <span className="mx-3">|</span>
        <span>الجزء {currentJuz}</span>
      </div>
    </div>
  )
}
