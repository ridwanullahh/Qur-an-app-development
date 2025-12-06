"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Clickable Verse Component - Opens Verse Sciences Panel

import { useState, type ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, Languages, Link2, Clock, Volume2, Bookmark, Share2, Copy } from "lucide-react"
import { useI18n, toArabicNumeral } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import type { Verse } from "@/lib/quran-verses"
import { SURAHS } from "@/lib/quran-data"

interface ClickableVerseProps {
  verse: Verse
  children: ReactNode
  showTajweed?: boolean
}

// Mock tafsir data - in production from admin API
const getTafsirData = (surah: number, verse: number, language: string) => ({
  ibnKathir: {
    ar: "تفسير ابن كثير للآية...",
    en: "Ibn Kathir's interpretation of this verse...",
    ur: "اس آیت کی ابن کثیر کی تفسیر...",
  },
  tabari: {
    ar: "تفسير الطبري للآية...",
    en: "At-Tabari's interpretation...",
    ur: "طبری کی تفسیر...",
  },
  jalalayn: {
    ar: "تفسير الجلالين للآية...",
    en: "Jalalayn interpretation...",
    ur: "جلالین کی تفسیر...",
  },
  qurtubi: {
    ar: "تفسير القرطبي للآية...",
    en: "Al-Qurtubi's interpretation...",
    ur: "قرطبی کی تفسیر...",
  },
  sayyidQutb: {
    ar: "في ظلال القرآن - سيد قطب...",
    en: "In the Shade of the Quran - Sayyid Qutb...",
    ur: "سید قطب کی تفسیر...",
  },
})

const getTranslations = (surah: number, verse: number) => ({
  sahihInternational: "This is the Sahih International translation of the verse...",
  pickthall: "This is Pickthall's translation...",
  yusufAli: "This is Yusuf Ali's translation...",
  muhsinKhan: "This is Muhsin Khan's translation...",
  urdu: "اس آیت کا اردو ترجمہ...",
  french: "Traduction française du verset...",
  turkish: "Ayetin Türkçe çevirisi...",
  indonesian: "Terjemahan ayat dalam Bahasa Indonesia...",
})

const getRelatedVerses = (surah: number, verse: number) => [
  { surah: 3, verse: 139, text: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ..." },
  { surah: 2, verse: 286, text: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا..." },
  { surah: 94, verse: 5, text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا" },
]

const getAsbabNuzul = (surah: number, verse: number, language: string) => ({
  ar: "سبب نزول هذه الآية: ...",
  en: "The reason for the revelation of this verse: ...",
  ur: "اس آیت کے نزول کا سبب: ...",
})

export default function ClickableVerse({ verse, children, showTajweed }: ClickableVerseProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTafsir, setSelectedTafsir] = useState("ibnKathir")
  const [selectedTranslation, setSelectedTranslation] = useState("sahihInternational")
  const { t, language } = useI18n()

  const surah = SURAHS.find((s) => s.number === verse.surah)
  const tafsirData = getTafsirData(verse.surah, verse.verse, language)
  const translations = getTranslations(verse.surah, verse.verse)
  const relatedVerses = getRelatedVerses(verse.surah, verse.verse)
  const asbabNuzul = getAsbabNuzul(verse.surah, verse.verse, language)

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

  return (
    <>
      <span
        onClick={() => setIsOpen(true)}
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
                {/* Tafsir selector */}
                <div className="flex flex-wrap gap-2 pb-3 border-b">
                  {[
                    { id: "ibnKathir", name: "ابن كثير" },
                    { id: "tabari", name: "الطبري" },
                    { id: "qurtubi", name: "القرطبي" },
                    { id: "jalalayn", name: "الجلالين" },
                    { id: "sayyidQutb", name: "سيد قطب" },
                  ].map((tafsir) => (
                    <Button
                      key={tafsir.id}
                      variant={selectedTafsir === tafsir.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTafsir(tafsir.id)}
                    >
                      {tafsir.name}
                    </Button>
                  ))}
                </div>

                <div className="p-4 bg-muted/50 rounded-lg font-amiri text-lg leading-relaxed">
                  {tafsirData[selectedTafsir as keyof typeof tafsirData]?.[language as "ar" | "en" | "ur"] ||
                    tafsirData[selectedTafsir as keyof typeof tafsirData]?.ar}
                </div>
              </TabsContent>

              {/* Translation Tab */}
              <TabsContent value="translation" className="mt-0 space-y-4">
                {/* Translation selector */}
                <div className="flex flex-wrap gap-2 pb-3 border-b">
                  {[
                    { id: "sahihInternational", name: "Sahih International" },
                    { id: "pickthall", name: "Pickthall" },
                    { id: "yusufAli", name: "Yusuf Ali" },
                    { id: "urdu", name: "اردو" },
                    { id: "french", name: "Français" },
                    { id: "turkish", name: "Türkçe" },
                    { id: "indonesian", name: "Indonesia" },
                  ].map((trans) => (
                    <Button
                      key={trans.id}
                      variant={selectedTranslation === trans.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTranslation(trans.id)}
                    >
                      {trans.name}
                    </Button>
                  ))}
                </div>

                <div className="p-4 bg-muted/50 rounded-lg text-lg leading-relaxed">
                  {translations[selectedTranslation as keyof typeof translations]}
                </div>
              </TabsContent>

              {/* Related Verses Tab */}
              <TabsContent value="related" className="mt-0 space-y-4">
                <h4 className="font-bold text-muted-foreground">{t("sciences.related")}</h4>
                {relatedVerses.map((rv, idx) => (
                  <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-xl font-amiri text-primary mb-2">{rv.text}</p>
                    <p className="text-sm text-muted-foreground">
                      سورة {SURAHS.find((s) => s.number === rv.surah)?.nameArabic} - آية {rv.verse}
                    </p>
                  </div>
                ))}
              </TabsContent>

              {/* Asbab al-Nuzul Tab */}
              <TabsContent value="asbab" className="mt-0 space-y-4">
                <h4 className="font-bold text-muted-foreground">{t("sciences.reasons")}</h4>
                <div className="p-4 bg-muted/50 rounded-lg font-amiri text-lg leading-relaxed">
                  {asbabNuzul[language as keyof typeof asbabNuzul] || asbabNuzul.ar}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
