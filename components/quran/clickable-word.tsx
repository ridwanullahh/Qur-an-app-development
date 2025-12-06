"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Interactive Clickable Word Component with Sciences Panel & Tajweed Colors

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Volume2, BookOpen, Languages, Sparkles, Palette } from "lucide-react"
import { useI18n, toArabicNumeral } from "@/lib/i18n"
import { analyzeTajweed, getTajweedStyle, TAJWEED_RULES } from "@/lib/tajweed"
import { cn } from "@/lib/utils"

interface ClickableWordProps {
  word: string
  surah: number
  verse: number
  position: number
  showTajweed?: boolean
}

// Mock word data - in production this would come from admin API
const getWordData = (word: string, language: string) => ({
  arabic: word,
  transliteration: "transliteration",
  translations: {
    ar: word,
    en: "meaning in English",
    ur: "اردو میں معنی",
    fr: "signification en français",
    es: "significado en español",
    id: "arti dalam bahasa Indonesia",
    tr: "Türkçe anlam",
    bn: "বাংলায় অর্থ",
    ru: "значение на русском",
    zh: "中文意思",
  },
  root: "ج ع ل",
  morphology: {
    partOfSpeech: { ar: "فعل", en: "Verb", ur: "فعل" },
    form: { ar: "ماضٍ", en: "Past tense", ur: "ماضی" },
    person: { ar: "ثالث", en: "Third person", ur: "غائب" },
    gender: { ar: "مذكر", en: "Masculine", ur: "مذکر" },
    number: { ar: "مفرد", en: "Singular", ur: "واحد" },
    pattern: { ar: "فَعَلَ", en: "fa'ala", ur: "فَعَلَ" },
  },
  grammar: {
    irab: {
      ar: "فعل ماضٍ مبني على الفتح",
      en: "Past tense verb built on fatha",
      ur: "فعل ماضی فتحہ پر مبنی",
    },
    position: {
      ar: "خبر",
      en: "Predicate",
      ur: "خبر",
    },
    dependencies: {
      ar: "متعلق بالفاعل",
      en: "Related to the subject",
      ur: "فاعل سے متعلق",
    },
  },
  balagha: {
    ar: "استخدام بلاغي...",
    en: "Rhetorical usage...",
    ur: "بلاغی استعمال...",
  },
})

export default function ClickableWord({ word, surah, verse, position, showTajweed = true }: ClickableWordProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { t, language } = useI18n()

  const wordData = getWordData(word, language)

  const tajweedAnalysis = useMemo(() => analyzeTajweed(word), [word])

  // Render word with tajweed colors
  const renderTajweedWord = () => {
    if (!showTajweed) {
      return word
    }

    return tajweedAnalysis.map((item, idx) => (
      <span key={idx} style={getTajweedStyle(item.rule, true)} title={TAJWEED_RULES[item.rule]?.nameArabic}>
        {item.char}
      </span>
    ))
  }

  // Get translation in current language
  const getLocalizedText = (obj: Record<string, string> | undefined) => {
    if (!obj) return ""
    return obj[language] || obj.en || obj.ar || ""
  }

  return (
    <>
      <span
        onClick={(e) => {
          e.stopPropagation() // Prevent verse click
          setIsOpen(true)
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "cursor-pointer transition-all duration-200 inline-block mx-[2px]",
          "hover:bg-primary/10 rounded px-0.5",
          isHovered && "scale-105",
        )}
        role="button"
        tabIndex={0}
        aria-label={`كلمة: ${word}`}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen(true)}
      >
        {renderTajweedWord()}
      </span>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-4xl font-amiri text-center text-primary">{word}</DialogTitle>
            <p className="text-center text-sm text-muted-foreground">
              {t("quran.surah")} {toArabicNumeral(surah)} | {t("quran.verse")} {toArabicNumeral(verse)} | كلمة{" "}
              {toArabicNumeral(position + 1)}
            </p>
          </DialogHeader>

          <Tabs defaultValue="meaning" className="mt-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="meaning" className="gap-1 text-xs">
                <Languages className="h-3.5 w-3.5" />
                {t("sciences.meaning")}
              </TabsTrigger>
              <TabsTrigger value="grammar" className="gap-1 text-xs">
                <BookOpen className="h-3.5 w-3.5" />
                {t("sciences.grammar")}
              </TabsTrigger>
              <TabsTrigger value="morphology" className="gap-1 text-xs">
                <Sparkles className="h-3.5 w-3.5" />
                {t("sciences.morphology")}
              </TabsTrigger>
              <TabsTrigger value="tajweed" className="gap-1 text-xs">
                <Palette className="h-3.5 w-3.5" />
                {t("sciences.tajweed")}
              </TabsTrigger>
              <TabsTrigger value="audio" className="gap-1 text-xs">
                <Volume2 className="h-3.5 w-3.5" />
                صوت
              </TabsTrigger>
            </TabsList>

            {/* Meaning Tab */}
            <TabsContent value="meaning" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-bold text-sm text-muted-foreground mb-2">{t("sciences.translation")}</h4>
                  <p className="text-lg">{getLocalizedText(wordData.translations)}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-bold text-sm text-muted-foreground mb-2">{t("sciences.transliteration")}</h4>
                  <p className="text-lg italic">{wordData.transliteration}</p>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-bold text-sm text-muted-foreground mb-2">{t("sciences.root")}</h4>
                <p className="text-3xl font-amiri text-center text-primary">{wordData.root}</p>
              </div>
              <Button className="w-full gap-2">
                <Volume2 className="h-4 w-4" />
                {t("action.listen")}
              </Button>
            </TabsContent>

            {/* Grammar Tab */}
            <TabsContent value="grammar" className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-bold text-sm text-muted-foreground mb-2">الإعراب</h4>
                <p className="text-lg font-amiri">{getLocalizedText(wordData.grammar.irab)}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-bold text-sm text-muted-foreground mb-2">الموقع الإعرابي</h4>
                <p className="text-lg font-amiri">{getLocalizedText(wordData.grammar.position)}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-bold text-sm text-muted-foreground mb-2">العلاقات</h4>
                <p className="text-lg font-amiri">{getLocalizedText(wordData.grammar.dependencies)}</p>
              </div>
            </TabsContent>

            {/* Morphology Tab */}
            <TabsContent value="morphology" className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-bold text-sm text-muted-foreground mb-2">نوع الكلمة</h4>
                  <p className="text-lg font-amiri">{getLocalizedText(wordData.morphology.partOfSpeech)}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-bold text-sm text-muted-foreground mb-2">الصيغة</h4>
                  <p className="text-lg font-amiri">{getLocalizedText(wordData.morphology.form)}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-bold text-sm text-muted-foreground mb-2">الوزن</h4>
                  <p className="text-lg font-amiri">{getLocalizedText(wordData.morphology.pattern)}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-bold text-sm text-muted-foreground mb-2">الجنس</h4>
                  <p className="text-lg font-amiri">{getLocalizedText(wordData.morphology.gender)}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-bold text-sm text-muted-foreground mb-2">العدد</h4>
                  <p className="text-lg font-amiri">{getLocalizedText(wordData.morphology.number)}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-bold text-sm text-muted-foreground mb-2">الشخص</h4>
                  <p className="text-lg font-amiri">{getLocalizedText(wordData.morphology.person)}</p>
                </div>
              </div>
            </TabsContent>

            {/* Tajweed Tab */}
            <TabsContent value="tajweed" className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-4xl font-amiri mb-4">{renderTajweedWord()}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-muted-foreground">قواعد التجويد في هذه الكلمة:</h4>
                {[...new Set(tajweedAnalysis.map((a) => a.rule))]
                  .filter((r) => r !== "normal")
                  .map((rule) => {
                    const ruleInfo = TAJWEED_RULES[rule]
                    return (
                      <div
                        key={rule}
                        className="p-3 rounded-lg flex items-center gap-3"
                        style={{ backgroundColor: ruleInfo.bgColor }}
                      >
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ruleInfo.color }} />
                        <div>
                          <p className="font-bold font-amiri" style={{ color: ruleInfo.color }}>
                            {ruleInfo.nameArabic}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {ruleInfo.description[language as "ar" | "en" | "ur"] || ruleInfo.description.ar}
                          </p>
                        </div>
                      </div>
                    )
                  })}

                {tajweedAnalysis.every((a) => a.rule === "normal") && (
                  <p className="text-muted-foreground text-center py-4">لا توجد قواعد تجويد خاصة في هذه الكلمة</p>
                )}
              </div>

              {/* Tajweed color legend */}
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-bold text-sm text-muted-foreground mb-3">دليل الألوان:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.values(TAJWEED_RULES)
                    .filter((r) => r.id !== "normal")
                    .slice(0, 8)
                    .map((rule) => (
                      <div key={rule.id} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: rule.color }} />
                        <span>{rule.nameArabic}</span>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>

            {/* Audio Tab */}
            <TabsContent value="audio" className="space-y-4 py-4">
              <div className="p-6 bg-muted rounded-lg text-center">
                <p className="text-4xl font-amiri mb-4">{word}</p>
                <Button size="lg" className="gap-2">
                  <Volume2 className="h-5 w-5" />
                  استمع للنطق
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center">سيتم تشغيل نطق الكلمة بصوت القارئ المحدد</p>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
