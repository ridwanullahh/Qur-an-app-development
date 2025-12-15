"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Clickable Verse Component - Opens Verse Sciences Panel with Dynamic Data from API

import { useState, useEffect, type ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Languages, Link2, Clock, Volume2, Bookmark, Share2, Copy, Loader2 } from "lucide-react"
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

// Default scholars and translators for selection (will be populated from API if available)
const DEFAULT_SCHOLARS = [
  { id: "ibnKathir", name: "ابن كثير", nameEn: "Ibn Kathir" },
  { id: "tabari", name: "الطبري", nameEn: "At-Tabari" },
  { id: "qurtubi", name: "القرطبي", nameEn: "Al-Qurtubi" },
  { id: "jalalayn", name: "الجلالين", nameEn: "Al-Jalalayn" },
  { id: "sayyidQutb", name: "سيد قطب", nameEn: "Sayyid Qutb" },
]

const DEFAULT_TRANSLATORS = [
  { id: "sahihInternational", name: "Sahih International", lang: "en" },
  { id: "pickthall", name: "Pickthall", lang: "en" },
  { id: "yusufAli", name: "Yusuf Ali", lang: "en" },
  { id: "urdu", name: "اردو", lang: "ur" },
  { id: "french", name: "Français", lang: "fr" },
  { id: "turkish", name: "Türkçe", lang: "tr" },
  { id: "indonesian", name: "Indonesia", lang: "id" },
]

export default function ClickableVerse({ verse, children, showTajweed }: ClickableVerseProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedScholar, setSelectedScholar] = useState("ibnKathir")
  const [selectedTranslator, setSelectedTranslator] = useState("sahihInternational")
  const { t, language } = useI18n()

  // API data states
  const [tafsirData, setTafsirData] = useState<TafsirData[]>([])
  const [translationData, setTranslationData] = useState<TranslationData[]>([])
  const [availableScholars, setAvailableScholars] = useState<string[]>([])
  const [availableTranslators, setAvailableTranslators] = useState<string[]>([])
  const [loadingTafsir, setLoadingTafsir] = useState(false)
  const [loadingTranslation, setLoadingTranslation] = useState(false)
  const [tafsirError, setTafsirError] = useState<string | null>(null)
  const [translationError, setTranslationError] = useState<string | null>(null)

  const surah = SURAHS.find((s) => s.number === verse.surah)

  // Fetch tafsir data from API
  useEffect(() => {
    if (!isOpen) return

    const fetchTafsir = async () => {
      setLoadingTafsir(true)
      setTafsirError(null)
      try {
        const res = await fetch(
          `/api/tafsir?surah=${verse.surah}&verse=${verse.verse}&language=${language}`
        )
        const data = await res.json()
        if (data.tafsir) {
          setTafsirData(data.tafsir)
          if (data.availableScholars) {
            setAvailableScholars(data.availableScholars)
          }
        }
        if (data.message && data.tafsir.length === 0) {
          setTafsirError(data.message)
        }
      } catch (err) {
        setTafsirError("Failed to load tafsir data")
        console.error("Tafsir fetch error:", err)
      } finally {
        setLoadingTafsir(false)
      }
    }

    fetchTafsir()
  }, [isOpen, verse.surah, verse.verse, language])

  // Fetch translation data from API
  useEffect(() => {
    if (!isOpen) return

    const fetchTranslations = async () => {
      setLoadingTranslation(true)
      setTranslationError(null)
      try {
        const res = await fetch(
          `/api/translations?surah=${verse.surah}&verse=${verse.verse}&language=${language}`
        )
        const data = await res.json()
        if (data.translations) {
          setTranslationData(data.translations)
          if (data.availableTranslators) {
            setAvailableTranslators(data.availableTranslators)
          }
        }
        if (data.message && data.translations.length === 0) {
          setTranslationError(data.message)
        }
      } catch (err) {
        setTranslationError("Failed to load translation data")
        console.error("Translation fetch error:", err)
      } finally {
        setLoadingTranslation(false)
      }
    }

    fetchTranslations()
  }, [isOpen, verse.surah, verse.verse, language])

  // Get current tafsir text based on selected scholar
  const getCurrentTafsir = () => {
    const found = tafsirData.find((t) => t.scholar === selectedScholar)
    return found?.text || null
  }

  // Get current translation text based on selected translator
  const getCurrentTranslation = () => {
    const found = translationData.find((t) => t.translator === selectedTranslator)
    return found?.text || null
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(verse.text)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${surah?.nameArabic} - آية ${verse.verse}`,
        text: verse.text,
        url: window.location.href,
      })
    }
  }

  // Get scholars to display (from API or defaults)
  const scholarsToShow = availableScholars.length > 0
    ? availableScholars.map(s => ({ id: s, name: s, nameEn: s }))
    : DEFAULT_SCHOLARS

  // Get translators to display (from API or defaults)
  const translatorsToShow = availableTranslators.length > 0
    ? availableTranslators.map(t => ({ id: t, name: t, lang: "en" }))
    : DEFAULT_TRANSLATORS

  return (
    <>
      <span
        onClick={(e) => {
          // Only open verse panel if clicking directly on verse area, not on words
          const target = e.target as HTMLElement
          if (target.closest('[data-word-interactive="true"]')) {
            return
          }
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

      {/* Verse Sciences Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
            <DialogTitle className="text-center space-y-2">
              <p className="text-3xl font-amiri text-primary leading-relaxed">{verse.text}</p>
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

          <Tabs defaultValue="tafsir" className="flex-1">
            <TabsList className="grid w-full grid-cols-4 px-6 py-2 bg-muted/20">
              <TabsTrigger value="tafsir" className="gap-1.5">
                <BookOpen className="h-4 w-4" />
                {t("sciences.tafsir")}
              </TabsTrigger>
              <TabsTrigger value="translation" className="gap-1.5">
                <Languages className="h-4 w-4" />
                {t("sciences.translation")}
              </TabsTrigger>
              <TabsTrigger value="related" className="gap-1.5">
                <Link2 className="h-4 w-4" />
                {t("sciences.related")}
              </TabsTrigger>
              <TabsTrigger value="asbab" className="gap-1.5">
                <Clock className="h-4 w-4" />
                {t("sciences.reasons")}
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[50vh] px-6 py-4">
              {/* Tafsir Tab */}
              <TabsContent value="tafsir" className="mt-0 space-y-4">
                {/* Scholar selector using Select for many options */}
                <div className="flex items-center gap-3 pb-3 border-b">
                  <span className="text-sm font-medium">{t("sciences.tafsir")}:</span>
                  <Select value={selectedScholar} onValueChange={setSelectedScholar}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select Scholar" />
                    </SelectTrigger>
                    <SelectContent>
                      {scholarsToShow.map((scholar) => (
                        <SelectItem key={scholar.id} value={scholar.id}>
                          {scholar.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg font-amiri text-lg leading-relaxed min-h-[100px]">
                  {loadingTafsir ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2">جاري التحميل...</span>
                    </div>
                  ) : tafsirError && tafsirData.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">{tafsirError}</p>
                  ) : getCurrentTafsir() ? (
                    getCurrentTafsir()
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      لا يوجد تفسير متاح لهذه الآية. يرجى إضافته من لوحة الإدارة.
                    </p>
                  )}
                </div>
              </TabsContent>

              {/* Translation Tab */}
              <TabsContent value="translation" className="mt-0 space-y-4">
                {/* Translator selector using Select for many options */}
                <div className="flex items-center gap-3 pb-3 border-b">
                  <span className="text-sm font-medium">{t("sciences.translation")}:</span>
                  <Select value={selectedTranslator} onValueChange={setSelectedTranslator}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select Translator" />
                    </SelectTrigger>
                    <SelectContent>
                      {translatorsToShow.map((trans) => (
                        <SelectItem key={trans.id} value={trans.id}>
                          {trans.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg text-lg leading-relaxed min-h-[100px]">
                  {loadingTranslation ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2">Loading...</span>
                    </div>
                  ) : translationError && translationData.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">{translationError}</p>
                  ) : getCurrentTranslation() ? (
                    getCurrentTranslation()
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No translation available for this verse. Please add via admin panel.
                    </p>
                  )}
                </div>
              </TabsContent>

              {/* Related Verses Tab - Will be populated from DB in future */}
              <TabsContent value="related" className="mt-0 space-y-4">
                <h4 className="font-bold text-muted-foreground">{t("sciences.related")}</h4>
                <p className="text-muted-foreground text-center py-8">
                  Related verses will be available once data is added via admin panel.
                </p>
              </TabsContent>

              {/* Asbab al-Nuzul Tab - Will be populated from DB in future */}
              <TabsContent value="asbab" className="mt-0 space-y-4">
                <h4 className="font-bold text-muted-foreground">{t("sciences.reasons")}</h4>
                <p className="text-muted-foreground text-center py-8">
                  Asbab al-Nuzul (Reasons for Revelation) will be available once data is added via admin panel.
                </p>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
