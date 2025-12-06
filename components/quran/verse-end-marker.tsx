// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Ornate Verse End Marker - King Fahd Complex Style

interface VerseEndMarkerProps {
  verseNumber: number
}

export default function VerseEndMarker({ verseNumber }: VerseEndMarkerProps) {
  // Convert to Arabic numerals
  const toArabicNumeral = (num: number): string => {
    const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]
    return num
      .toString()
      .split("")
      .map((d) => arabicNumerals[Number.parseInt(d)])
      .join("")
  }

  return (
    <span className="inline-flex items-center justify-center mx-1 align-middle">
      <span className="relative inline-flex items-center justify-center w-8 h-8">
        {/* Outer decorative circle */}
        <svg viewBox="0 0 32 32" className="absolute inset-0 w-full h-full">
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-mushaf-green"
          />
          {/* Decorative dots around the circle */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180
            const x = 16 + 14 * Math.cos(rad)
            const y = 16 + 14 * Math.sin(rad)
            return <circle key={angle} cx={x} cy={y} r="1.5" className="fill-mushaf-gold" />
          })}
        </svg>
        {/* Verse number */}
        <span className="relative text-xs font-amiri text-mushaf-green font-bold">{toArabicNumeral(verseNumber)}</span>
      </span>
    </span>
  )
}
