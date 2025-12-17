"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Authentic Mushaf Frame Component - King Fahd Complex Style

import type React from "react"

interface MushafFrameProps {
  children: React.ReactNode
  pageNumber: number
  juzNumber: number
  surahName: string
  isLeftPage?: boolean
}

export default function MushafFrame({
  children,
  pageNumber,
  juzNumber,
  surahName,
  isLeftPage = false,
}: MushafFrameProps) {
  // Convert number to Arabic numerals
  const toArabicNumeral = (num: number): string => {
    const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]
    return num
      .toString()
      .split("")
      .map((d) => arabicNumerals[Number.parseInt(d)])
      .join("")
  }

  return (
    <div className="mushaf-frame-container relative bg-mushaf-cream">
      {/* Outer decorative border */}
      <div className="absolute inset-0 p-2">
        <div className="w-full h-full border-[3px] border-mushaf-green rounded-sm relative">
          {/* Corner decorations - ornate floral medallions */}
          <CornerDecoration position="top-right" />
          <CornerDecoration position="top-left" />
          <CornerDecoration position="bottom-right" />
          <CornerDecoration position="bottom-left" />

          {/* Side decorations */}
          <SideDecoration position="top" />
          <SideDecoration position="bottom" />
          <SideDecoration position="left" />
          <SideDecoration position="right" />

          {/* Inner border */}
          <div className="absolute inset-3 border border-mushaf-green/60" />

          {/* Header - Juz and Surah info */}
          <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-mushaf-green">
            <span className="text-sm font-amiri">الجزء {toArabicNumeral(juzNumber)}</span>
            <span className="text-lg font-bold font-amiri">{surahName}</span>
            <span className="text-sm font-amiri">الجزء {toArabicNumeral(juzNumber)}</span>
          </div>

          {/* Main content area */}
          <div className="absolute inset-0 top-12 bottom-10 mx-5 overflow-hidden">{children}</div>

          {/* Footer - Page number */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <span className="text-lg font-amiri text-mushaf-green">{toArabicNumeral(pageNumber)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CornerDecoration({ position }: { position: "top-right" | "top-left" | "bottom-right" | "bottom-left" }) {
  const positionClasses = {
    "top-right": "-top-1 -right-1",
    "top-left": "-top-1 -left-1",
    "bottom-right": "-bottom-1 -right-1",
    "bottom-left": "-bottom-1 -left-1",
  }

  const rotationClasses = {
    "top-right": "rotate-0",
    "top-left": "rotate-90",
    "bottom-right": "-rotate-90",
    "bottom-left": "rotate-180",
  }

  return (
    <div className={`absolute ${positionClasses[position]} w-12 h-12 ${rotationClasses[position]}`}>
      <svg viewBox="0 0 48 48" className="w-full h-full">
        {/* Ornate floral corner design */}
        <defs>
          <linearGradient id="cornerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a5f4a" />
            <stop offset="100%" stopColor="#2d7d5e" />
          </linearGradient>
        </defs>
        {/* Main corner shape */}
        <path d="M0 0 L48 0 L48 8 Q24 8 8 24 L8 48 L0 48 Z" fill="url(#cornerGrad)" />
        {/* Floral accent */}
        <circle cx="16" cy="16" r="6" fill="#c45c8a" opacity="0.9" />
        <circle cx="16" cy="16" r="3" fill="#e8a4c4" />
        {/* Small decorative dots */}
        <circle cx="8" cy="24" r="2" fill="#c45c8a" opacity="0.7" />
        <circle cx="24" cy="8" r="2" fill="#c45c8a" opacity="0.7" />
      </svg>
    </div>
  )
}

function SideDecoration({ position }: { position: "top" | "bottom" | "left" | "right" }) {
  const isHorizontal = position === "top" || position === "bottom"

  const positionClasses = {
    top: "top-0 left-1/2 -translate-x-1/2",
    bottom: "bottom-0 left-1/2 -translate-x-1/2",
    left: "left-0 top-1/2 -translate-y-1/2",
    right: "right-0 top-1/2 -translate-y-1/2",
  }

  return (
    <div className={`absolute ${positionClasses[position]}`}>
      {isHorizontal ? (
        <svg viewBox="0 0 60 12" className="w-16 h-3">
          <circle cx="10" cy="6" r="4" fill="#c45c8a" />
          <circle cx="30" cy="6" r="5" fill="#1a5f4a" />
          <circle cx="30" cy="6" r="2" fill="#c45c8a" />
          <circle cx="50" cy="6" r="4" fill="#c45c8a" />
        </svg>
      ) : (
        <svg viewBox="0 0 12 60" className="w-3 h-16">
          <circle cx="6" cy="10" r="4" fill="#c45c8a" />
          <circle cx="6" cy="30" r="5" fill="#1a5f4a" />
          <circle cx="6" cy="30" r="2" fill="#c45c8a" />
          <circle cx="6" cy="50" r="4" fill="#c45c8a" />
        </svg>
      )}
    </div>
  )
}
