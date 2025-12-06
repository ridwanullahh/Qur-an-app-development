"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Memorization Session Component - Interactive Learning Modes

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lightbulb,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MemorizationSessionProps {
  type: "new" | "review"
  onClose: () => void
}

// Mock verses for the session
const sessionVerses = [
  {
    surah: 2,
    verse: 1,
    text: "الٓمٓ",
    translation: "Alif, Lam, Meem.",
  },
  {
    surah: 2,
    verse: 2,
    text: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
    translation: "This is the Book about which there is no doubt, a guidance for those conscious of Allah.",
  },
  {
    surah: 2,
    verse: 3,
    text: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ",
    translation: "Who believe in the unseen, establish prayer, and spend out of what We have provided for them.",
  },
]

type Mode = "listen" | "reveal" | "firstLetter" | "test"

export default function MemorizationSession({ type, onClose }: MemorizationSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mode, setMode] = useState<Mode>("listen")
  const [isRevealed, setIsRevealed] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [completed, setCompleted] = useState<number[]>([])
  const [responses, setResponses] = useState<Record<number, "easy" | "medium" | "hard">>({})

  const currentVerse = sessionVerses[currentIndex]
  const progress = ((currentIndex + 1) / sessionVerses.length) * 100

  const getDisplayText = () => {
    if (isRevealed || mode === "listen") return currentVerse.text

    if (mode === "firstLetter") {
      // Show only first letter of each word
      return currentVerse.text
        .split(" ")
        .map((word) => word[0] + "...")
        .join(" ")
    }

    if (mode === "reveal") {
      return "اضغط للكشف عن الآية"
    }

    return "___"
  }

  const handleNext = () => {
    if (currentIndex < sessionVerses.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsRevealed(false)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsRevealed(false)
    }
  }

  const handleResponse = (difficulty: "easy" | "medium" | "hard") => {
    setResponses({ ...responses, [currentIndex]: difficulty })
    setCompleted([...completed, currentIndex])
    handleNext()
  }

  const handleComplete = () => {
    // Save progress and close
    onClose()
  }

  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onClose} className="gap-2">
          <ArrowRight className="h-4 w-4" />
          الرجوع
        </Button>
        <Badge variant={type === "new" ? "default" : "secondary"}>{type === "new" ? "حفظ جديد" : "مراجعة"}</Badge>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {sessionVerses.length}
        </span>
      </div>

      {/* Progress */}
      <Progress value={progress} className="mb-6" />

      {/* Mode Selection */}
      <div className="flex justify-center gap-2 mb-6">
        <Button
          variant={mode === "listen" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("listen")}
          className="gap-1"
        >
          <Volume2 className="h-4 w-4" />
          استمع
        </Button>
        <Button
          variant={mode === "reveal" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setMode("reveal")
            setIsRevealed(false)
          }}
          className="gap-1"
        >
          <Eye className="h-4 w-4" />
          اكشف
        </Button>
        <Button
          variant={mode === "firstLetter" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setMode("firstLetter")
            setIsRevealed(false)
          }}
          className="gap-1"
        >
          <Lightbulb className="h-4 w-4" />
          حرف أول
        </Button>
        <Button
          variant={mode === "test" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setMode("test")
            setIsRevealed(false)
          }}
          className="gap-1"
        >
          <EyeOff className="h-4 w-4" />
          اختبار
        </Button>
      </div>

      {/* Main Card */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-sm text-muted-foreground">
            سورة {currentVerse.surah} - آية {currentVerse.verse}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center p-8">
          {/* Verse Text */}
          <div
            className={cn(
              "text-center mb-8 transition-all duration-300",
              !isRevealed && mode !== "listen" && "cursor-pointer hover:opacity-80",
            )}
            onClick={() => mode !== "listen" && setIsRevealed(true)}
          >
            <p
              className={cn(
                "text-3xl font-amiri leading-relaxed",
                !isRevealed && mode !== "listen" && mode !== "firstLetter" && "text-muted-foreground",
              )}
            >
              {getDisplayText()}
            </p>
          </div>

          {/* Audio Button */}
          <Button variant="outline" size="lg" className="gap-2 mb-6 bg-transparent">
            <Volume2 className="h-5 w-5" />
            استمع للآية
          </Button>

          {/* Translation Toggle */}
          <Button variant="ghost" size="sm" onClick={() => setShowTranslation(!showTranslation)} className="mb-4">
            {showTranslation ? "إخفاء الترجمة" : "إظهار الترجمة"}
          </Button>

          {showTranslation && (
            <p className="text-center text-muted-foreground text-sm max-w-md">{currentVerse.translation}</p>
          )}
        </CardContent>

        {/* Response Buttons */}
        <div className="border-t p-4">
          <p className="text-center text-sm text-muted-foreground mb-4">كيف كان مستواك؟</p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="flex-1 max-w-[120px] gap-2 border-red-500/50 text-red-600 hover:bg-red-500/10 bg-transparent"
              onClick={() => handleResponse("hard")}
            >
              <ThumbsDown className="h-4 w-4" />
              صعب
            </Button>
            <Button
              variant="outline"
              className="flex-1 max-w-[120px] gap-2 border-yellow-500/50 text-yellow-600 hover:bg-yellow-500/10 bg-transparent"
              onClick={() => handleResponse("medium")}
            >
              <Minus className="h-4 w-4" />
              متوسط
            </Button>
            <Button
              variant="outline"
              className="flex-1 max-w-[120px] gap-2 border-green-500/50 text-green-600 hover:bg-green-500/10 bg-transparent"
              onClick={() => handleResponse("easy")}
            >
              <ThumbsUp className="h-4 w-4" />
              سهل
            </Button>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0}>
          <ArrowRight className="h-4 w-4 ml-2" />
          السابق
        </Button>

        {currentIndex === sessionVerses.length - 1 ? (
          <Button onClick={handleComplete} className="gap-2">
            <Check className="h-4 w-4" />
            إنهاء الجلسة
          </Button>
        ) : (
          <Button variant="outline" onClick={handleNext}>
            التالي
            <ArrowLeft className="h-4 w-4 mr-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
