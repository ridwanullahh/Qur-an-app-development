"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Clickable Verse Component - Opens Verse Sciences Panel with Scrollable List Navigation

import { useState, useEffect, type ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, Languages, Link2, Clock, Volume2, Bookmark, Share2, Copy, Loader2, ChevronRight } from "lucide-react"
import { useI18n, toArabicNumeral } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import type { Verse } from "@/lib/quran-verses"
import { SURAHS } from "@/lib/quran-data"

interface ClickableVerseProps {
  verse: Verse
  children: ReactNode
  showTajweed?: boolean
}

interface TafsirData {
  id: string
  surahNumber: number
  verseNumber: number
  language: string
  text: string
  scholar: string
}

interface TranslationData {
  id: string
  surahNumber: number
  verseNumber: number
  language: string
  text: string
  translator: string
}

// Categories for sciences
type ScienceCategory = "tafsir" | "translation" | "related" | "asbab"

// Default scholars and translators
const DEFAULT_SCHOLARS = [
  { id: "ibnKathir", name: "ابن كثير", nameEn: "Ibn Kathir" },
  { id: "tabari", name: "الطبري", nameEn: "At-Tabari" },
  { id: "qurtubi", name: "القرطبي", nameEn: "Al-Qurtubi" },
  { id: "jalalayn", name: "الجلالين", nameEn: "Al-Jalalayn" },
  { id: "sayyidQutb", name: "سيد قطب", nameEn: "Sayyid Qutb" },
  { id: "baghawi", name: "البغوي", nameEn: "Al-Baghawi" },
  { id: "saadi", name: "السعدي", nameEn: "As-Saadi" },
  { id: "muyassar", name: "الميسر", nameEn: "Al-Muyassar" },
  { id: "waseet", name: "الوسيط", nameEn: "Al-Waseet" },
]

const DEFAULT_TRANSLATORS = [
  { id: "sahihInternational", name: "Sahih International", lang: "en" },
  { id: "pickthall", name: "Pickthall", lang: "en" },
  { id: "yusufAli", name: "Yusuf Ali", lang: "en" },
  { id: "muhsinKhan", name: "Muhsin Khan", lang: "en" },
  { id: "abdulHaleem", name: "Abdul Haleem", lang: "en" },
  { id: "urduJalandhry", name: "فتح محمد جالندھری", lang: "ur" },
  { id: "urduMaududi", name: "مودودی", lang: "ur" },
  { id: "french", name: "Français - Hamidullah", lang: "fr" },
  { id: "turkish", name: "Türkçe - Diyanet", lang: "tr" },
  { id: "indonesian", name: "Indonesia - Kemenag", lang: "id" },
  { id: "russian", name: "Русский - Кулиев", lang: "ru" },
  { id: "german", name: "Deutsch - Bubenheim", lang: "de" },
  { id: "spanish", name: "Español - García", lang: "es" },
  { id: "bengali", name: "বাংলা", lang: "bn" },
  { id: "chinese", name: "中文", lang: "zh" },
]

export default function ClickableVerse({ verse, children, showTajweed }: ClickableVerseProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<ScienceCategory>("tafsir")
  const [selectedItem, setSelectedItem] = useState<string>("ibnKathir")
  const { t, language } = useI18n()

  // API data states
  const [tafsirData, setTafsirData] = useState<TafsirData[]>([])
  const [translationData, setTranslationData] = useState<TranslationData[]>([])
  const [availableScholars, setAvailableScholars] = useState<string[]>([])
  const [availableTranslators, setAvailableTranslators] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const surah = SURAHS.find((s) => s.number === verse.surah)

  // Fetch data when dialog opens or category changes
  useEffect(() => {
    if (!isOpen) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        if (activeCategory === "tafsir") {
          const res = await fetch(`/api/tafsir?surah=${verse.surah}&verse=${verse.verse}&language=${language}`)
          const data = await res.json()
          if (data.tafsir) {
            setTafsirData(data.tafsir)
            if (data.availableScholars) setAvailableScholars(data.availableScholars)
          }
          if (data.message && data.tafsir?.length === 0) setError(data.message)
        } else if (activeCategory === "translation") {
          const res = await fetch(`/api/translations?surah=${verse.surah}&verse=${verse.verse}`)
          const data = await res.json()
          if (data.translations) {
            setTranslationData(data.translations)
            if (data.availableTranslators) setAvailableTranslators(data.availableTranslators)
          }
          if (data.message && data.translations?.length === 0) setError(data.message)
        }
      } catch (err) {
        setError("Failed to load data")
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isOpen, activeCategory, verse.surah, verse.verse, language])

  // Get current content based on selection
  const getCurrentContent = () => {
    if (activeCategory === "tafsir") {
      const found = tafsirData.find((t) => t.scholar === selectedItem)
      return found?.text || null
    } else if (activeCategory === "translation") {
      const found = translationData.find((t) => t.translator === selectedItem)
      return found?.text || null
    }
    return null
  }

  // Get items list based on category
  const getItemsList = () => {
    if (activeCategory === "tafsir") {
      return availableScholars.length > 0
        ? availableScholars.map((s) => ({ id: s, name: DEFAULT_SCHOLARS.find((d) => d.id === s)?.name || s }))
        : DEFAULT_SCHOLARS
    } else if (activeCategory === "translation") {
      return availableTranslators.length > 0
        ? availableTranslators.map((t) => ({ id: t, name: DEFAULT_TRANSLATORS.find((d) => d.id === t)?.name || t }))
        : DEFAULT_TRANSLATORS
    }
    return []
  }

  const handleCopy = () => navigator.clipboard.writeText(verse.text)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${surah?.nameArabic} - آية ${verse.verse}`,
        text: verse.text,
        url: window.location.href,
      })
    }
  }

  // Handle category change
  const handleCategoryChange = (category: ScienceCategory) => {
    setActiveCategory(category)
    // Set default selection for the category
    if (category === "tafsir") setSelectedItem("ibnKathir")
    else if (category === "translation") setSelectedItem("sahihInternational")
  }

  const categories = [
    { id: "tafsir" as ScienceCategory, name: t("sciences.tafsir"), nameAr: "التفسير", icon: BookOpen },
    { id: "translation" as ScienceCategory, name: t("sciences.translation"), nameAr: "الترجمة", icon: Languages },
    { id: "related" as ScienceCategory, name: t("sciences.related"), nameAr: "الآيات المتعلقة", icon: Link2 },
    { id: "asbab" as ScienceCategory, name: t("sciences.reasons"), nameAr: "أسباب النزول", icon: Clock },
  ]

  return (
    <>
      <span
        onClick={(e) => {
          const target = e.target as HTMLElement
          if (target.closest('[data-word-interactive="true"]')) return
          setIsOpen(true)
        }}
        className={cn("inline cursor-pointer transition-colors duration-200", "hover:bg-primary/5 rounded")}
        role="button"
        tabIndex={0}
        aria-label={`آية ${verse.verse} من سورة ${surah?.nameArabic}`}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen(true)}
      >
        {children}
      </span>

      {/* Verse Sciences Dialog - Three Column Layout */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
          {/* Header with verse text */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-b from-primary/5 to-transparent">
            <DialogTitle className="text-center space-y-2">
              <p className="text-2xl md:text-3xl font-amiri text-primary leading-relaxed">{verse.text}</p>
              <p className="text-sm text-muted-foreground">
                سورة {surah?.nameArabic} | آية {toArabicNumeral(verse.verse)} | الجزء {toArabicNumeral(verse.juz)}
              </p>
            </DialogTitle>
            {/* Action buttons */}
            <div className="flex justify-center gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 ml-1" />
                {t("action.copy")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 ml-1" />
                {t("action.share")}
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 ml-1" />
                {t("action.bookmark")}
              </Button>
              <Button variant="outline" size="sm">
                <Volume2 className="h-4 w-4 ml-1" />
                {t("action.listen")}
              </Button>
            </div>
          </DialogHeader>

          {/* Three Column Layout: Categories | Items List | Content */}
          <div className="flex h-[55vh] overflow-hidden">
            {/* Column 1: Categories */}
            <div className="w-20 md:w-28 border-l bg-muted/30 flex flex-col" dir="rtl">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 gap-1 text-xs transition-colors border-b",
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  <cat.icon className="h-5 w-5" />
                  <span className="font-amiri text-center leading-tight">{cat.nameAr}</span>
                </button>
              ))}
            </div>

            {/* Column 2: Scrollable Items List */}
            <div className="w-48 md:w-56 border-l bg-muted/10" dir="rtl">
              <div className="p-2 border-b bg-muted/20">
                <h3 className="text-sm font-bold font-amiri text-center">
                  {activeCategory === "tafsir" ? "التفاسير" : activeCategory === "translation" ? "الترجمات" : "المصادر"}
                </h3>
              </div>
              <ScrollArea className="h-[calc(55vh-40px)]">
                <div className="p-1">
                  {(activeCategory === "tafsir" || activeCategory === "translation") &&
                    getItemsList().map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item.id)}
                        className={cn(
                          "w-full text-right px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between gap-2",
                          selectedItem === item.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <span className="font-amiri truncate">{item.name}</span>
                        {selectedItem === item.id && <ChevronRight className="h-4 w-4 flex-shrink-0 rotate-180" />}
                      </button>
                    ))}
                  {(activeCategory === "related" || activeCategory === "asbab") && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      سيتم إضافة المصادر قريباً
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Column 3: Content Display */}
            <div className="flex-1 overflow-hidden" dir="rtl">
              <ScrollArea className="h-[55vh]">
                <div className="p-6">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                      <span className="text-muted-foreground font-amiri">جاري التحميل...</span>
                    </div>
                  ) : error && !getCurrentContent() ? (
                    <div className="text-center py-16">
                      <p className="text-muted-foreground font-amiri text-lg">{error}</p>
                      <p className="text-sm text-muted-foreground/70 mt-2">
                        يرجى إضافة المحتوى من لوحة الإدارة
                      </p>
                    </div>
                  ) : getCurrentContent() ? (
                    <div className="prose prose-lg max-w-none">
                      <div className="p-4 bg-muted/30 rounded-lg font-amiri text-lg leading-loose whitespace-pre-wrap">
                        {getCurrentContent()}
                      </div>
                    </div>
                  ) : (activeCategory === "related" || activeCategory === "asbab") ? (
                    <div className="text-center py-16">
                      <p className="text-muted-foreground font-amiri text-lg">
                        {activeCategory === "related"
                          ? "الآيات المتعلقة ستكون متاحة قريباً"
                          : "أسباب النزول ستكون متاحة قريباً"}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-muted-foreground font-amiri text-lg">
                        لا يوجد محتوى متاح. يرجى الإضافة من لوحة الإدارة.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
