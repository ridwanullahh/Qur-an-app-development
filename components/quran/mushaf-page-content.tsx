"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Mushaf Page Content - No-Scroll, Full Page View

import { useMemo, useState } from "react"
import { useQuran } from "@/contexts/quran-context"
import { ALL_VERSES, type Verse } from "@/lib/quran-verses"
import { SURAHS } from "@/lib/quran-data"
import ClickableWord from "./clickable-word"
import ClickableVerse from "./clickable-verse"
import VerseEndMarker from "./verse-end-marker"
import SurahBismillahHeader from "./surah-bismillah-header"

interface MushafPageContentProps {
  pageNumber: number
}

export default function MushafPageContent({ pageNumber }: MushafPageContentProps) {
  const { settings } = useQuran()
  const [containerHeight, setContainerHeight] = useState<number>(0)

  // Get verses for this page
  const versesOnPage = useMemo(() => getVersesForPage(pageNumber), [pageNumber])

  const dynamicFontSize = useMemo(() => {
    const verseCount = versesOnPage.length
    const totalWords = versesOnPage.reduce((acc, v) => acc + v.text.split(" ").length, 0)

    // Base font size adjustments based on content density
    if (totalWords > 150) return "text-[1.1rem] leading-[2.2]"
    if (totalWords > 120) return "text-[1.25rem] leading-[2.3]"
    if (totalWords > 100) return "text-[1.35rem] leading-[2.4]"
    if (totalWords > 80) return "text-[1.45rem] leading-[2.5]"
    if (totalWords > 60) return "text-[1.55rem] leading-[2.6]"
    return "text-[1.65rem] leading-[2.7]"
  }, [versesOnPage])

  if (versesOnPage.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground font-amiri text-lg">
        <p>جاري تحميل الصفحة...</p>
      </div>
    )
  }

  // Group verses by surah for proper header display
  const versesBySurah = groupVersesBySurah(versesOnPage)

  return (
    <div className="h-full flex flex-col px-3 py-2 font-amiri overflow-hidden" dir="rtl">
      {Object.entries(versesBySurah).map(([surahNum, verses]) => {
        const surah = SURAHS.find((s) => s.number === Number.parseInt(surahNum))
        const showHeader = verses[0]?.verse === 1

        return (
          <div key={surahNum} className="flex-shrink-0">
            {/* Surah header and Bismillah for new surahs */}
            {showHeader && surah && <SurahBismillahHeader surah={surah} compact />}

            <div className={`text-justify text-foreground ${dynamicFontSize}`} style={{ textAlignLast: "center" }}>
              {verses.map((verse) => (
                <ClickableVerse key={`${verse.surah}-${verse.verse}`} verse={verse} showTajweed={settings.wordByWord}>
                  {renderVerseWithClickableWords(verse, settings.wordByWord)}
                  <VerseEndMarker verseNumber={verse.verse} />
                </ClickableVerse>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function renderVerseWithClickableWords(verse: Verse, showTajweed: boolean) {
  const words = verse.text.split(" ")

  return words.map((word, index) => (
    <ClickableWord
      key={`${verse.surah}-${verse.verse}-${index}`}
      word={word}
      surah={verse.surah}
      verse={verse.verse}
      position={index}
      showTajweed={showTajweed}
    />
  ))
}

function getVersesForPage(pageNumber: number): Verse[] {
  const verses: Verse[] = []

  Object.values(ALL_VERSES).forEach((surahVerses) => {
    surahVerses.forEach((verse) => {
      if (verse.page === pageNumber) {
        verses.push(verse)
      }
    })
  })

  return verses.sort((a, b) => {
    if (a.surah !== b.surah) return a.surah - b.surah
    return a.verse - b.verse
  })
}

function groupVersesBySurah(verses: Verse[]): Record<string, Verse[]> {
  return verses.reduce(
    (acc, verse) => {
      const key = verse.surah.toString()
      if (!acc[key]) acc[key] = []
      acc[key].push(verse)
      return acc
    },
    {} as Record<string, Verse[]>,
  )
}
