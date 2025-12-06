// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Surah Header with Bismillah - Ornate Design with Compact Mode

import type { Surah } from "@/lib/quran-data"
import { hasBismillah, BISMILLAH } from "@/lib/quran-data"

interface SurahBismillahHeaderProps {
  surah: Surah
  compact?: boolean // Added compact prop for Mushaf view
}

export default function SurahBismillahHeader({ surah, compact = false }: SurahBismillahHeaderProps) {
  if (compact) {
    // Compact version for Mushaf page view - fits without scrolling
    return (
      <div className="mb-2 mt-1">
        {/* Compact Surah Title Frame */}
        <div className="relative py-2 px-4 mx-auto max-w-xs">
          <svg viewBox="0 0 300 50" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <rect
              x="5"
              y="5"
              width="290"
              height="40"
              rx="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-mushaf-green"
            />
            <rect
              x="10"
              y="10"
              width="280"
              height="30"
              rx="4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-mushaf-green/50"
            />
            {/* Ornaments */}
            <circle cx="25" cy="25" r="5" className="fill-mushaf-pink" />
            <circle cx="25" cy="25" r="2" className="fill-mushaf-green" />
            <circle cx="275" cy="25" r="5" className="fill-mushaf-pink" />
            <circle cx="275" cy="25" r="2" className="fill-mushaf-green" />
          </svg>
          <h2 className="relative text-center text-base font-bold font-amiri text-mushaf-green">
            سُورَةُ {surah.nameArabic}
          </h2>
        </div>

        {/* Compact Bismillah */}
        {hasBismillah(surah.number) && (
          <div className="text-center mt-1 mb-2">
            <p className="text-lg font-amiri text-foreground">{BISMILLAH}</p>
          </div>
        )}
      </div>
    )
  }

  // Full version for list view
  return (
    <div className="mb-6">
      {/* Surah Title Frame */}
      <div className="relative py-4 px-8 mx-auto max-w-md">
        {/* Decorative frame */}
        <svg viewBox="0 0 400 80" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <rect
            x="10"
            y="10"
            width="380"
            height="60"
            rx="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-mushaf-green"
          />
          <rect
            x="15"
            y="15"
            width="370"
            height="50"
            rx="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-mushaf-green/60"
          />
          <circle cx="30" cy="40" r="8" className="fill-mushaf-gold" />
          <circle cx="30" cy="40" r="4" className="fill-mushaf-green" />
          <circle cx="370" cy="40" r="8" className="fill-mushaf-gold" />
          <circle cx="370" cy="40" r="4" className="fill-mushaf-green" />
        </svg>

        <h2 className="relative text-center text-xl font-bold font-amiri text-mushaf-green">سُورَةُ {surah.nameArabic}</h2>
      </div>

      {/* Bismillah (if not At-Tawbah) */}
      {hasBismillah(surah.number) && (
        <div className="text-center my-4">
          <p className="text-2xl font-amiri text-foreground leading-relaxed">{BISMILLAH}</p>
        </div>
      )}
    </div>
  )
}
