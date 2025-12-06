// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Surah Header Component

import type { Surah } from "@/lib/quran-data"

interface SurahHeaderProps {
  surah: Surah
}

export default function SurahHeader({ surah }: SurahHeaderProps) {
  return (
    <div className="surah-header">
      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold arabic-text mb-1">سورة {surah.nameArabic}</h2>
        <p className="text-sm opacity-80">
          {surah.nameEnglish} • {surah.versesCount} آيات • {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="islamic-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M10 0L20 10L10 20L0 10Z" fill="currentColor" opacity="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>
    </div>
  )
}
