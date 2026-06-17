"use client"

import type React from "react"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Mushaf Page Spread - Responsive: Single Page (Mobile) / Two-Page (Desktop)

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useQuran } from "@/contexts/quran-context"
import MushafFrame from "./mushaf-frame"
import QulMushafPage from "./qul-mushaf-page"
import { cn } from "@/lib/utils"

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [breakpoint])
  return isMobile
}

export default function MushafPageSpread() {
  const { currentPage, goToPage, currentJuz, getSurahForPage, settings } = useQuran()
  const isMobile = useIsMobile()
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationDirection, setAnimationDirection] = useState<"next" | "prev" | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const rightPageNum = currentPage % 2 === 1 ? currentPage : currentPage - 1
  const leftPageNum = rightPageNum + 1
  const mobilePageNum = currentPage

  const rightSurah = getSurahForPage(rightPageNum)
  const leftSurah = getSurahForPage(leftPageNum)
  const mobileSurah = getSurahForPage(mobilePageNum)

  const handlePageChange = useCallback((direction: "next" | "prev") => {
    if (isAnimating) return
    setIsAnimating(true)
    setAnimationDirection(direction)

    setTimeout(() => {
      if (isMobile) {
        if (direction === "next" && mobilePageNum < 604) goToPage(mobilePageNum + 1)
        else if (direction === "prev" && mobilePageNum > 1) goToPage(mobilePageNum - 1)
      } else {
        if (direction === "next" && leftPageNum < 604) goToPage(leftPageNum + 1)
        else if (direction === "prev" && rightPageNum > 1) goToPage(rightPageNum - 2)
      }
      setIsAnimating(false)
      setAnimationDirection(null)
    }, 350)
  }, [isAnimating, isMobile, mobilePageNum, leftPageNum, rightPageNum, goToPage])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePageChange("next")
      else if (e.key === "ArrowRight") handlePageChange("prev")
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handlePageChange])

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) handlePageChange(diff > 0 ? "next" : "prev")
    setTouchStart(null)
  }

  const bgColor = settings.mushafBgColor || "#FAF8F0"

  if (isMobile) {
    return (
      <div
        className="mushaf-spread-container relative w-full mx-auto select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handlePageChange("next")}
          disabled={mobilePageNum >= 604 || isAnimating}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-12 w-8 rounded-l-none bg-background/80 hover:bg-background shadow-lg"
          aria-label="الصفحة التالية"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handlePageChange("prev")}
          disabled={mobilePageNum <= 1 || isAnimating}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-12 w-8 rounded-r-none bg-background/80 hover:bg-background shadow-lg"
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        <div className="px-10" dir="rtl">
          <div className={cn(
            "mushaf-page-single transition-transform duration-350",
            isAnimating && animationDirection === "next" && "animate-page-flip-left",
            isAnimating && animationDirection === "prev" && "animate-page-flip-right",
          )}>
            <MushafFrame
              pageNumber={mobilePageNum}
              juzNumber={currentJuz}
              surahName={mobileSurah ? `سورة ${mobileSurah.nameArabic}` : ""}
              isLeftPage={false}
              bgColor={bgColor}
            >
              <QulMushafPage pageNumber={mobilePageNum} />
            </MushafFrame>
          </div>
        </div>

        <div className="text-center mt-3 text-xs text-muted-foreground font-amiri" dir="rtl">
          <span>صفحة {mobilePageNum}</span>
          <span className="mx-2">|</span>
          <span>الجزء {currentJuz}</span>
          {mobileSurah && (
            <>
              <span className="mx-2">|</span>
              <span>سورة {mobileSurah.nameArabic}</span>
            </>
          )}
        </div>
      </div>
    )
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

      <div className="absolute left-1/2 top-0 bottom-0 w-6 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/15 to-transparent z-10 pointer-events-none" />

      <div className="flex gap-0 px-12" dir="rtl">
        <div className={cn(
          "w-1/2 transition-transform duration-350 origin-left",
          isAnimating && animationDirection === "next" && "animate-page-flip-left",
          isAnimating && animationDirection === "prev" && "animate-page-flip-right",
        )}>
          <MushafFrame
            pageNumber={rightPageNum}
            juzNumber={currentJuz}
            surahName={rightSurah ? `سورة ${rightSurah.nameArabic}` : ""}
            isLeftPage={false}
            bgColor={bgColor}
          >
            <QulMushafPage pageNumber={rightPageNum} />
          </MushafFrame>
        </div>

        <div className={cn(
          "w-1/2 transition-transform duration-350 origin-right",
          isAnimating && animationDirection === "next" && "animate-page-flip-right",
          isAnimating && animationDirection === "prev" && "animate-page-flip-left",
        )}>
          <MushafFrame
            pageNumber={leftPageNum}
            juzNumber={currentJuz}
            surahName={leftSurah ? `سورة ${leftSurah.nameArabic}` : ""}
            isLeftPage={true}
            bgColor={bgColor}
          >
            <QulMushafPage pageNumber={leftPageNum} />
          </MushafFrame>
        </div>
      </div>

      <div className="text-center mt-4 text-sm text-muted-foreground font-amiri" dir="rtl">
        <span>صفحة {rightPageNum} - {leftPageNum}</span>
        <span className="mx-3">|</span>
        <span>الجزء {currentJuz}</span>
      </div>
    </div>
  )
}
