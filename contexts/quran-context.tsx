"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Quran Context - State Management for Quran Reader

import type React from "react"
import { createContext, useContext, useState, useCallback, useMemo } from "react"
import { SURAHS, type Surah } from "@/lib/quran-data"
import { ALL_VERSES, type Verse } from "@/lib/quran-verses"

interface QuranSettings {
  fontSize: number
  fontFamily: "uthmani" | "naskh" | "amiri"
  showTranslation: boolean
  showTransliteration: boolean
  translationLanguage: string
  reciter: string
  theme: "light" | "dark" | "sepia"
  pageView: "mushaf" | "list"
  wordByWord: boolean
}

interface QuranContextType {
  // Current position
  currentSurah: number
  currentVerse: number
  currentPage: number
  currentJuz: number

  // Data
  surahInfo: Surah | undefined
  verses: Verse[]

  // Settings
  settings: QuranSettings
  updateSettings: (updates: Partial<QuranSettings>) => void

  // Navigation
  goToSurah: (surahNumber: number) => void
  goToVerse: (surahNumber: number, verseNumber: number) => void
  goToPage: (pageNumber: number) => void
  goToJuz: (juzNumber: number) => void
  nextVerse: () => void
  prevVerse: () => void
  nextSurah: () => void
  prevSurah: () => void

  // Bookmarks
  bookmarks: Array<{ surah: number; verse: number; note?: string }>
  addBookmark: (surah: number, verse: number, note?: string) => void
  removeBookmark: (surah: number, verse: number) => void
  isBookmarked: (surah: number, verse: number) => boolean

  // Audio
  isPlaying: boolean
  playAudio: () => void
  pauseAudio: () => void
  stopAudio: () => void
}

const defaultSettings: QuranSettings = {
  fontSize: 28,
  fontFamily: "uthmani",
  showTranslation: true,
  showTransliteration: false,
  translationLanguage: "en",
  reciter: "mishary-alafasy",
  theme: "light",
  pageView: "mushaf",
  wordByWord: false,
}

const QuranContext = createContext<QuranContextType | undefined>(undefined)

export function QuranProvider({ children }: { children: React.ReactNode }) {
  const [currentSurah, setCurrentSurah] = useState(1)
  const [currentVerse, setCurrentVerse] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentJuz, setCurrentJuz] = useState(1)
  const [settings, setSettings] = useState<QuranSettings>(defaultSettings)
  const [bookmarks, setBookmarks] = useState<Array<{ surah: number; verse: number; note?: string }>>([])
  const [isPlaying, setIsPlaying] = useState(false)

  const surahInfo = useMemo(() => SURAHS.find((s) => s.number === currentSurah), [currentSurah])
  const verses = useMemo(() => ALL_VERSES[currentSurah] || [], [currentSurah])

  const updateSettings = useCallback((updates: Partial<QuranSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }, [])

  const goToSurah = useCallback((surahNumber: number) => {
    if (surahNumber >= 1 && surahNumber <= 114) {
      setCurrentSurah(surahNumber)
      setCurrentVerse(1)
      const surah = SURAHS.find((s) => s.number === surahNumber)
      if (surah) {
        setCurrentPage(surah.pageStart)
        setCurrentJuz(surah.juzStart)
      }
    }
  }, [])

  const goToVerse = useCallback((surahNumber: number, verseNumber: number) => {
    setCurrentSurah(surahNumber)
    setCurrentVerse(verseNumber)
    const verse = ALL_VERSES[surahNumber]?.find((v) => v.verse === verseNumber)
    if (verse) {
      setCurrentPage(verse.page)
      setCurrentJuz(verse.juz)
    }
  }, [])

  const goToPage = useCallback((pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= 604) {
      setCurrentPage(pageNumber)
      // Find first surah on this page
      const surah = SURAHS.find((s) => s.pageStart <= pageNumber)
      if (surah) {
        setCurrentSurah(surah.number)
      }
    }
  }, [])

  const goToJuz = useCallback((juzNumber: number) => {
    if (juzNumber >= 1 && juzNumber <= 30) {
      setCurrentJuz(juzNumber)
      // Find first surah in this juz
      const surah = SURAHS.find((s) => s.juzStart === juzNumber)
      if (surah) {
        setCurrentSurah(surah.number)
        setCurrentVerse(1)
        setCurrentPage(surah.pageStart)
      }
    }
  }, [])

  const nextVerse = useCallback(() => {
    const surah = SURAHS.find((s) => s.number === currentSurah)
    if (surah && currentVerse < surah.versesCount) {
      setCurrentVerse((prev) => prev + 1)
    } else if (currentSurah < 114) {
      setCurrentSurah((prev) => prev + 1)
      setCurrentVerse(1)
    }
  }, [currentSurah, currentVerse])

  const prevVerse = useCallback(() => {
    if (currentVerse > 1) {
      setCurrentVerse((prev) => prev - 1)
    } else if (currentSurah > 1) {
      const prevSurah = SURAHS.find((s) => s.number === currentSurah - 1)
      if (prevSurah) {
        setCurrentSurah(currentSurah - 1)
        setCurrentVerse(prevSurah.versesCount)
      }
    }
  }, [currentSurah, currentVerse])

  const nextSurah = useCallback(() => {
    if (currentSurah < 114) {
      goToSurah(currentSurah + 1)
    }
  }, [currentSurah, goToSurah])

  const prevSurah = useCallback(() => {
    if (currentSurah > 1) {
      goToSurah(currentSurah - 1)
    }
  }, [currentSurah, goToSurah])

  const addBookmark = useCallback((surah: number, verse: number, note?: string) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.surah === surah && b.verse === verse)) {
        return prev
      }
      return [...prev, { surah, verse, note }]
    })
  }, [])

  const removeBookmark = useCallback((surah: number, verse: number) => {
    setBookmarks((prev) => prev.filter((b) => !(b.surah === surah && b.verse === verse)))
  }, [])

  const isBookmarked = useCallback(
    (surah: number, verse: number) => {
      return bookmarks.some((b) => b.surah === surah && b.verse === verse)
    },
    [bookmarks],
  )

  const playAudio = useCallback(() => setIsPlaying(true), [])
  const pauseAudio = useCallback(() => setIsPlaying(false), [])
  const stopAudio = useCallback(() => setIsPlaying(false), [])

  return (
    <QuranContext.Provider
      value={{
        currentSurah,
        currentVerse,
        currentPage,
        currentJuz,
        surahInfo,
        verses,
        settings,
        updateSettings,
        goToSurah,
        goToVerse,
        goToPage,
        goToJuz,
        nextVerse,
        prevVerse,
        nextSurah,
        prevSurah,
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        isPlaying,
        playAudio,
        pauseAudio,
        stopAudio,
      }}
    >
      {children}
    </QuranContext.Provider>
  )
}

export function useQuran() {
  const context = useContext(QuranContext)
  if (context === undefined) {
    throw new Error("useQuran must be used within a QuranProvider")
  }
  return context
}
