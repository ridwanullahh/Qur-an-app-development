"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Mushaf Page Content - King Fahd 15 Lines Per Page Style

import { useMemo, useState, useEffect } from "react"
import { useQuran } from "@/contexts/quran-context"
import { SURAHS } from "@/lib/quran-data"
import ClickableWord from "./clickable-word"
import ClickableVerse from "./clickable-verse"
import VerseEndMarker from "./verse-end-marker"
import SurahBismillahHeader from "./surah-bismillah-header"
import { Loader2 } from "lucide-react"

interface Verse {
  surah: number
  verse: number
  text: string
  page: number
  juz: number
  hizb: number
}

interface MushafPageContentProps {
  pageNumber: number
}

// King Fahd Complex Mushaf uses 15 lines per page
const LINES_PER_PAGE = 15

export default function MushafPageContent({ pageNumber }: MushafPageContentProps) {
  const { settings } = useQuran()
  const [versesOnPage, setVersesOnPage] = useState<Verse[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch verses for the page from API
  useEffect(() => {
    let mounted = true
    const fetchPageData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/quran/page?page=${pageNumber}`)
        const data = await res.json()
        if (mounted && data.verses) {
          // Map API response to Component Verse type
          const mappedVerses = data.verses.map((v: any) => ({
            surah: v.surahNumber,
            verse: v.verseNumber,
            text: v.text,
            page: v.page,
            juz: v.juz,
            hizb: v.hizb
          }))
          setVersesOnPage(mappedVerses)
        }
      } catch (error) {
        console.error("Failed to load page data:", error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchPageData()
    return () => { mounted = false }
  }, [pageNumber])


  // Group verses by surah for proper header display
  const versesBySurah = useMemo(() => groupVersesBySurah(versesOnPage), [versesOnPage])

  // Calculate content for the 15 lines
  const pageLines = useMemo(() => {
    return distributeContentToLines(versesOnPage, versesBySurah, LINES_PER_PAGE)
  }, [versesOnPage, versesBySurah])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground font-amiri text-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mr-3">جاري تحميل الصفحة...</p>
      </div>
    )
  }

  if (versesOnPage.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground font-amiri text-lg p-4 text-center">
        <p>لا توجد بيانات لهذه الصفحة حالياً.</p>
        <p className="text-sm mt-2">يرجى تحديث قاعدة البيانات.</p>
      </div>
    )
  }

  return (
    <div
      className="h-full flex flex-col font-amiri overflow-hidden mushaf-15-lines"
      dir="rtl"
      style={{
        // Fixed height container for 15 lines
        display: "grid",
        gridTemplateRows: `repeat(${LINES_PER_PAGE}, 1fr)`,
        alignContent: "stretch",
        padding: "0.5rem 0.75rem",
      }}
    >
      {pageLines.map((lineContent, lineIndex) => (
        <div
          key={lineIndex}
          className="mushaf-line w-full flex items-center text-foreground overflow-hidden px-[1px]"
          style={{
            minHeight: 0,
            textAlign: "justify",
            textAlignLast: lineContent.type === "surahHeader" ? "center" : "justify",
            fontSize: "clamp(0.9rem, 2.8vh, 1.8rem)",
            lineHeight: 1.8,
            width: "100%",
            direction: "rtl"
          }}
        >
          {lineContent.type === "surahHeader" && lineContent.surah && (
            <div className="w-full flex justify-center">
              <SurahBismillahHeader surah={lineContent.surah} compact />
            </div>
          )}
          {lineContent.type === "content" && (
            <span className="w-full block" style={{ textAlign: "justify", textAlignLast: "justify" }}>
              {lineContent.verses?.map((verse) => (
                <ClickableVerse key={`${verse.surah}-${verse.verse}`} verse={verse} showTajweed={true}>
                  {renderVerseWithClickableWords(verse, true)}
                  <VerseEndMarker verseNumber={verse.verse} />
                </ClickableVerse>
              ))}
            </span>
          )}
          {lineContent.type === "empty" && <span className="w-full">&nbsp;</span>}
        </div>
      ))}
    </div>
  )
}

interface LineContent {
  type: "surahHeader" | "content" | "empty"
  surah?: typeof SURAHS[0]
  verses?: Verse[]
}

function distributeContentToLines(
  versesOnPage: Verse[],
  versesBySurah: Record<string, Verse[]>,
  linesCount: number
): LineContent[] {
  const lines: LineContent[] = []

  // Simple distribution: divide verses evenly across lines
  // For more accuracy, we'd need word-level line breaking data from Quran API
  const surahEntries = Object.entries(versesBySurah)
  let currentLineVerses: Verse[] = []
  let totalCharsInLine = 0
  // Approximate chars per line (King Fahd uses ~45-55 chars per line)
  const CHARS_PER_LINE = 50

  surahEntries.forEach(([surahNum, verses]) => {
    const surah = SURAHS.find((s) => s.number === Number.parseInt(surahNum))
    const showHeader = verses[0]?.verse === 1

    // Add surah header as separate line if first verse
    if (showHeader && surah && surah.number !== 1 && surah.number !== 9) {
      // Flush current line if has content
      if (currentLineVerses.length > 0) {
        lines.push({ type: "content", verses: [...currentLineVerses] })
        currentLineVerses = []
        totalCharsInLine = 0
      }
      lines.push({ type: "surahHeader", surah })
    }

    verses.forEach((verse) => {
      const verseChars = verse.text.length

      if (totalCharsInLine + verseChars > CHARS_PER_LINE && currentLineVerses.length > 0) {
        // Line is full, push and start new line
        lines.push({ type: "content", verses: [...currentLineVerses] })
        currentLineVerses = [verse]
        totalCharsInLine = verseChars
      } else {
        // Add verse to current line
        currentLineVerses.push(verse)
        totalCharsInLine += verseChars
      }
    })
  })

  // Flush remaining verses
  if (currentLineVerses.length > 0) {
    lines.push({ type: "content", verses: [...currentLineVerses] })
  }

  // Pad or trim to exactly 15 lines
  while (lines.length < linesCount) {
    lines.push({ type: "empty" })
  }

  // If more than 15 lines, we need to combine some
  if (lines.length > linesCount) {
    // Combine content lines to fit
    const contentLines = lines.filter((l) => l.type === "content" || l.type === "surahHeader")
    // Simple approach: if too many lines, just show first 15
    return contentLines.slice(0, linesCount)
  }

  return lines.slice(0, linesCount)
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
