"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Verse Display Component

import { useState } from "react"
import { Play, Pause, Bookmark, BookmarkCheck, Copy, Share2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useQuran } from "@/contexts/quran-context"
import type { Verse } from "@/lib/quran-verses"
import { cn } from "@/lib/utils"

interface VerseDisplayProps {
  verse: Verse
  showTranslation?: boolean
  showTransliteration?: boolean
  wordByWord?: boolean
}

// Sample translations (would come from database)
const TRANSLATIONS: Record<string, Record<number, Record<number, string>>> = {
  en: {
    1: {
      1: "In the name of Allah, the Most Gracious, the Most Merciful.",
      2: "All praise is due to Allah, Lord of the worlds.",
      3: "The Most Gracious, the Most Merciful.",
      4: "Master of the Day of Judgment.",
      5: "You alone we worship, and You alone we ask for help.",
      6: "Guide us on the Straight Path.",
      7: "The path of those You have blessed, not of those who earned Your anger, nor of those who went astray.",
    },
    112: {
      1: "Say, 'He is Allah, the One.'",
      2: "Allah, the Eternal Refuge.",
      3: "He neither begets nor is born.",
      4: "Nor is there to Him any equivalent.",
    },
    114: {
      1: "Say, 'I seek refuge in the Lord of mankind,'",
      2: "The Sovereign of mankind,",
      3: "The God of mankind,",
      4: "From the evil of the retreating whisperer,",
      5: "Who whispers [evil] into the hearts of mankind,",
      6: "From among the jinn and mankind.",
    },
  },
}

export default function VerseDisplay({
  verse,
  showTranslation = true,
  showTransliteration = false,
  wordByWord = false,
}: VerseDisplayProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedWord, setSelectedWord] = useState<number | null>(null)
  const { isBookmarked, addBookmark, removeBookmark } = useQuran()

  const bookmarked = isBookmarked(verse.surah, verse.verse)
  const translation = TRANSLATIONS.en?.[verse.surah]?.[verse.verse]

  const words = verse.text.split(" ")

  const toggleBookmark = () => {
    if (bookmarked) {
      removeBookmark(verse.surah, verse.verse)
    } else {
      addBookmark(verse.surah, verse.verse)
    }
  }

  const copyVerse = async () => {
    await navigator.clipboard.writeText(verse.text)
  }

  const shareVerse = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `سورة ${verse.surah} - آية ${verse.verse}`,
        text: verse.text,
      })
    }
  }

  return (
    <div className="group relative p-4 rounded-lg hover:bg-verse-highlight transition-colors">
      {/* Arabic Text */}
      <div className="mb-3">
        {wordByWord ? (
          <p className="verse-text leading-loose">
            {words.map((word, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className={cn("word-highlight inline-block", selectedWord === index && "active")}
                      onClick={() => setSelectedWord(selectedWord === index ? null : index)}
                    >
                      {word}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="text-center">
                      <p className="text-lg arabic-text">{word}</p>
                      <p className="text-xs text-muted-foreground mt-1">(معنى الكلمة سيظهر هنا)</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {/* Verse Number */}
            <span className="verse-number">{verse.verse}</span>
          </p>
        ) : (
          <p className="verse-text">
            {verse.text}
            <span className="verse-number">{verse.verse}</span>
          </p>
        )}
      </div>

      {/* Translation */}
      {showTranslation && translation && (
        <p className="text-sm text-muted-foreground text-left leading-relaxed border-t border-border/50 pt-3 font-sans">
          {translation}
        </p>
      )}

      {/* Transliteration */}
      {showTransliteration && (
        <p className="text-sm text-muted-foreground italic text-left mt-2 font-sans">
          (Transliteration will appear here)
        </p>
      )}

      {/* Action Buttons */}
      <div className="absolute top-2 left-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>استماع</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleBookmark}>
                {bookmarked ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{bookmarked ? "إزالة العلامة" : "إضافة علامة"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyVerse}>
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>نسخ</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={shareVerse}>
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>مشاركة</TooltipContent>
          </Tooltip>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Info className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="start">
              <div className="space-y-2 text-sm">
                <h4 className="font-bold">معلومات الآية</h4>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <span>السورة:</span>
                  <span>{verse.surah}</span>
                  <span>الآية:</span>
                  <span>{verse.verse}</span>
                  <span>الصفحة:</span>
                  <span>{verse.page}</span>
                  <span>الجزء:</span>
                  <span>{verse.juz}</span>
                  <span>الحزب:</span>
                  <span>{verse.hizb}</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </TooltipProvider>
      </div>
    </div>
  )
}
