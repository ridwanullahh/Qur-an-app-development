"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// QUL Mushaf Page Component - Renders Quran pages using offline QUL data with Tajweed

import { useEffect, useState, useMemo } from "react"
import { getPageLayout, getWords, getSurahName, type PageLine, type Word } from "@/lib/quran-offline-db"
import { cn } from "@/lib/utils"
import { useQuran } from "@/contexts/quran-context"
import { analyzeTajweed, getTajweedStyle, TAJWEED_RULES, type TajweedRule } from "@/lib/tajweed"

interface QulMushafPageProps {
  pageNumber: number
  className?: string
}

interface RenderedLine {
  lineNumber: number
  lineType: "ayah" | "surah_name" | "basmallah"
  isCentered: boolean
  content: string
  words?: Word[]
  surahNumber?: number
}

export function QulMushafPage({ pageNumber, className }: QulMushafPageProps) {
  const [lines, setLines] = useState<RenderedLine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { settings } = useQuran()

  useEffect(() => {
    async function loadPage() {
      setLoading(true)
      setError(null)
      try {
        const layout = await getPageLayout(pageNumber)
        if (!layout.length) {
          setError(`Page ${pageNumber} not found`)
          setLoading(false)
          return
        }
        const renderedLines: RenderedLine[] = await Promise.all(
          layout.map(async (line: PageLine) => {
            const base: RenderedLine = {
              lineNumber: line.line_number,
              lineType: line.line_type,
              isCentered: line.is_centered,
              content: "",
            }
            switch (line.line_type) {
              case "surah_name":
                if (line.surah_number) {
                  base.content = await getSurahName(line.surah_number)
                  base.surahNumber = line.surah_number
                }
                break
              case "basmallah":
                base.content = "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0640\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650"
                break
              case "ayah":
                if (line.first_word_id && line.last_word_id) {
                  const words = await getWords(line.first_word_id, line.last_word_id)
                  base.words = words
                  base.content = words.map((w) => w.text).join(" ")
                }
                break
            }
            return base
          })
        )
        setLines(renderedLines)
      } catch (err) {
        console.error("Error loading page:", err)
        setError(err instanceof Error ? err.message : "Failed to load page")
      } finally {
        setLoading(false)
      }
    }
    loadPage()
  }, [pageNumber])

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <div className="text-muted-foreground animate-pulse">Loading page {pageNumber}...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <div className="text-destructive">{error}</div>
      </div>
    )
  }

  return (
    <div
      className={cn("qul-mushaf-page w-full h-full", "flex flex-col", className)}
      style={{ fontFamily: "'qpc-hafs', serif", direction: "rtl" }}
      dir="rtl"
    >
      {lines.map((line) => (
        <div
          key={line.lineNumber}
          className={cn(
            "qul-line flex-1 flex items-center",
            line.lineType === "surah_name" && "surah-name-line",
            line.lineType === "basmallah" && "basmallah-line",
            line.lineType === "ayah" && "ayah-line"
          )}
          style={{
            textAlign: line.isCentered ? "center" : "justify",
            justifyContent: line.isCentered ? "center" : "space-between",
          }}
        >
          {line.lineType === "surah_name" && <SurahNameLine name={line.content} surahNumber={line.surahNumber} />}
          {line.lineType === "basmallah" && <BasmallahLine />}
          {line.lineType === "ayah" && (
            <AyahLine words={line.words || []} isCentered={line.isCentered} showTajweed={settings.showTajweed} settings={settings} />
          )}
        </div>
      ))}
    </div>
  )
}

function SurahNameLine({ name, surahNumber }: { name: string; surahNumber?: number }) {
  return (
    <div className="surah-header-qul w-full text-center py-2">
      <span className="text-lg font-semibold text-mushaf-green">
        {`سُورَةُ ${name}`}
      </span>
    </div>
  )
}

function BasmallahLine() {
  return (
    <div className="basmallah-qul w-full text-center py-1">
      <span className="text-xl" style={{ fontFamily: "'qpc-hafs', serif" }}>
        بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
      </span>
    </div>
  )
}

interface AyahLineProps {
  words: Word[]
  isCentered: boolean
  showTajweed: boolean
  settings: any
}

function AyahLine({ words, isCentered, showTajweed, settings }: AyahLineProps) {
  return (
    <div
      className="ayah-qul w-full"
      style={{
        fontFamily: "'qpc-hafs', serif",
        textAlign: isCentered ? "center" : "justify",
        textAlignLast: isCentered ? "center" : "justify",
        fontSize: 0,
        lineHeight: 0,
      }}
    >
      {words.map((word, idx) => (
        <TajweedWord key={`${word.word_key}-${idx}`} word={word} showTajweed={showTajweed} settings={settings} />
      ))}
    </div>
  )
}

function TajweedWord({ word, showTajweed, settings }: { word: Word; showTajweed: boolean; settings: any }) {
  const tajweedAnalysis = useMemo(() => analyzeTajweed(word.text), [word.text])

  if (!showTajweed) {
    return (
      <span
        className="qul-word cursor-pointer hover:bg-primary/10 rounded-sm transition-colors"
        style={{
          fontFamily: "'qpc-hafs', serif",
          fontSize: "clamp(1.2rem, 4vh, 2.2rem)",
          lineHeight: 1.8,
          display: "inline-block",
        }}
        data-word-key={word.word_key}
      >
        {word.text}
      </span>
    )
  }

  const intensity = (settings.tajweedColorIntensity ?? 80) / 100
  const grouped: Array<{ chars: string; rule: TajweedRule }> = []

  tajweedAnalysis.forEach((item) => {
    const isEnabled = settings.tajweedRules?.[item.rule] !== false
    const rule = isEnabled ? item.rule : ("normal" as TajweedRule)
    const lastGroup = grouped[grouped.length - 1]
    if (lastGroup && lastGroup.rule === rule) {
      lastGroup.chars += item.char
    } else {
      grouped.push({ chars: item.char, rule })
    }
  })

  return (
    <span
      className="qul-word cursor-pointer hover:bg-primary/10 rounded-sm transition-colors"
      style={{
        fontFamily: "'qpc-hafs', serif",
        fontSize: "clamp(1.2rem, 4vh, 2.2rem)",
        lineHeight: 1.8,
        display: "inline-block",
      }}
      data-word-key={word.word_key}
    >
      {grouped.map((group, idx) => {
        if (group.rule === "normal") {
          return <span key={idx}>{group.chars}</span>
        }
        const ruleInfo = TAJWEED_RULES[group.rule]
        if (!ruleInfo) return <span key={idx}>{group.chars}</span>
        const style = getTajweedStyle(group.rule, true)
        const bgMatch = ruleInfo.bgColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
        if (bgMatch) {
          const [, r, g, b, a] = bgMatch
          style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${parseFloat(a) * intensity})`
        }
        return (
          <span key={idx} className="tajweed-char" style={style} title={ruleInfo.nameArabic}>
            {group.chars}
          </span>
        )
      })}
    </span>
  )
}

export default QulMushafPage
