"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Interactive Clickable Word Component with Sciences Panel & Tajweed Colors

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Volume2, BookOpen, Languages, Sparkles, Palette, Info } from "lucide-react"
import { useI18n, toArabicNumeral } from "@/lib/i18n"
import { analyzeTajweed, getTajweedStyle, TAJWEED_RULES, type TajweedRule } from "@/lib/tajweed"
import { getColorblindColors, applyPatternOverlay } from "@/lib/accessibility"
import { cn } from "@/lib/utils"
import { useQuran } from "@/contexts/quran-context"

interface ClickableWordProps {
  word: string
  surah: number
  verse: number
  position: number
  showTajweed?: boolean // Deprecated: use QuranContext settings instead
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
  const { settings } = useQuran()

  const wordData = getWordData(word, language)

  const tajweedAnalysis = useMemo(() => analyzeTajweed(word), [word])

  // Filter rules based on difficulty level
  const filteredTajweedAnalysis = useMemo(() => {
    const difficultyLevels = {
      basic: ["basic"],
      intermediate: ["basic", "intermediate"],
      advanced: ["basic", "intermediate", "advanced"],
    }
    const allowedDifficulties = difficultyLevels[settings.tajweedDifficulty]

    return tajweedAnalysis.map((item) => {
      // Check if rule is enabled and difficulty matches
      const ruleEnabled = settings.tajweedRules[item.rule]
      const difficultyMatches = allowedDifficulties.includes(item.difficulty)

      if (!ruleEnabled || !difficultyMatches) {
        return { ...item, rule: "normal" as TajweedRule }
      }
      return item
    })
  }, [tajweedAnalysis, settings.tajweedRules, settings.tajweedDifficulty])

  // Apply color intensity adjustment to styles
  const getAdjustedTajweedStyle = (rule: TajweedRule) => {
    const baseStyle = getTajweedStyle(rule, settings.showTajweed)

    if (!settings.showTajweed || rule === "normal") {
      return baseStyle
    }

    // Apply colorblind mode if enabled
    let ruleInfo = TAJWEED_RULES[rule]
    if (settings.colorblindMode !== "none") {
      const colorblindColors = getColorblindColors(rule, settings.colorblindMode)
      ruleInfo = { ...ruleInfo, ...colorblindColors }
    }

    const intensity = settings.tajweedColorIntensity / 100

    // Parse rgba background color and adjust opacity
    const bgMatch = ruleInfo.bgColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
    if (bgMatch) {
      const [, r, g, b, a] = bgMatch
      const adjustedAlpha = parseFloat(a) * intensity
      baseStyle.backgroundColor = `rgba(${r}, ${g}, ${b}, ${adjustedAlpha})`
    }

    // Apply pattern overlays if enabled
    if (settings.usePatternOverlays) {
      const patternStyle = applyPatternOverlay(rule, true)
      Object.assign(baseStyle, patternStyle)
    }

    // Apply high contrast mode adjustments
    if (settings.highContrastMode) {
      baseStyle.fontWeight = "600"
      baseStyle.border = `1px solid ${ruleInfo.color}`
    }

    return {
      ...baseStyle,
      color: ruleInfo.color,
      transition: settings.reducedMotion ? "none" : "all 0.2s ease-in-out",
    }
  }

  // Render word with tajweed colors
  const renderTajweedWord = () => {
    // Use prop for backward compatibility, but prefer context setting
    const shouldShowTajweed = settings.showTajweed ?? showTajweed

    if (!shouldShowTajweed) {
      return word
    }

    // Group consecutive characters with same rule for better performance
    const grouped: Array<{ chars: string; rule: TajweedRule; priority: number }> = []

    filteredTajweedAnalysis.forEach((item) => {
      const lastGroup = grouped[grouped.length - 1]
      if (lastGroup && lastGroup.rule === item.rule) {
        lastGroup.chars += item.char
      } else {
        grouped.push({ chars: item.char, rule: item.rule, priority: item.priority })
      }
    })

    return grouped.map((group, idx) => {
      const ruleInfo = TAJWEED_RULES[group.rule]
      const ruleName = ruleInfo?.nameArabic || ""
      const ruleDescription = ruleInfo?.description[language as "ar" | "en" | "ur"] || ruleInfo?.description.ar || ""

      return (
        <span
          key={idx}
          style={getAdjustedTajweedStyle(group.rule)}
          title={ruleInfo?.nameArabic}
          className="tajweed-char"
          role="text"
          aria-label={`${group.chars} - ${ruleName}: ${ruleDescription}`}
        >
          {group.chars}
        </span>
      )
    })
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
          "cursor-pointer transition-all duration-200 inline-block",
          "hover:bg-primary/10 rounded-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          isHovered && "bg-primary/5",
        )}
        style={{
          fontSize: "clamp(0.9rem, 2.8vh, 1.8rem)",
          lineHeight: 1.8,
          display: "inline-block",
        }}
        data-word-interactive="true"
        role="button"
        tabIndex={0}
        aria-label={`${language === "ar" ? "كلمة" : language === "ur" ? "لفظ" : "Word"}: ${word}. ${language === "ar" ? "اضغط للتفاصيل" : language === "ur" ? "تفصیلات کے لیے دبائیں" : "Press for details"}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setIsOpen(true)
          }
        }}
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

              {/* Character-by-character breakdown */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-muted-foreground flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  تحليل حرف بحرف:
                </h4>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {tajweedAnalysis
                    .filter((item) => item.rule !== "normal" && !["َ", "ُ", "ِ", "ّ", "ْ", "ً", "ٌ", "ٍ"].includes(item.char))
                    .map((item, idx) => {
                      const ruleInfo = TAJWEED_RULES[item.rule]
                      return (
                        <div
                          key={idx}
                          className="p-2 rounded-lg flex items-center gap-3 text-sm border"
                          style={{ borderColor: ruleInfo.color + "40" }}
                        >
                          <span className="text-2xl font-amiri" style={getAdjustedTajweedStyle(item.rule)}>
                            {item.char}
                          </span>
                          <div className="flex-1">
                            <p className="font-bold font-amiri text-xs" style={{ color: ruleInfo.color }}>
                              {ruleInfo.nameArabic}
                            </p>
                            {item.description && (
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            )}
                            {item.maddCount && (
                              <p className="text-xs text-muted-foreground">
                                {item.maddCount} {language === "ar" ? "حركات" : "counts"}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: ruleInfo.bgColor,
                                color: ruleInfo.color,
                              }}
                            >
                              {ruleInfo.difficulty === "basic"
                                ? "أساسي"
                                : ruleInfo.difficulty === "intermediate"
                                  ? "متوسط"
                                  : "متقدم"}
                            </span>
                            <span className="text-xs text-muted-foreground">P{item.priority}</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>

              {/* All detected rules with priorities */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-muted-foreground">قواعد التجويد في هذه الكلمة:</h4>
                {[...new Set(tajweedAnalysis.map((a) => a.rule))]
                  .filter((r) => r !== "normal")
                  .sort((a, b) => {
                    const aPriority = tajweedAnalysis.find((item) => item.rule === a)?.priority || 0
                    const bPriority = tajweedAnalysis.find((item) => item.rule === b)?.priority || 0
                    return bPriority - aPriority
                  })
                  .map((rule) => {
                    const ruleInfo = TAJWEED_RULES[rule]
                    const ruleItem = tajweedAnalysis.find((item) => item.rule === rule)
                    return (
                      <div
                        key={rule}
                        className="p-3 rounded-lg flex items-start gap-3 transition-all hover:shadow-md"
                        style={{ backgroundColor: ruleInfo.bgColor }}
                      >
                        <div className="w-4 h-4 rounded-full mt-1" style={{ backgroundColor: ruleInfo.color }} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold font-amiri" style={{ color: ruleInfo.color }}>
                              {ruleInfo.nameArabic}
                            </p>
                            <span className="text-xs text-muted-foreground">({ruleInfo.nameEnglish})</span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full ml-auto"
                              style={{
                                backgroundColor: ruleInfo.color + "20",
                                color: ruleInfo.color,
                              }}
                            >
                              {ruleInfo.difficulty === "basic"
                                ? "أساسي"
                                : ruleInfo.difficulty === "intermediate"
                                  ? "متوسط"
                                  : "متقدم"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {ruleInfo.description[language as "ar" | "en" | "ur"] || ruleInfo.description.ar}
                          </p>
                          {ruleItem?.maddCount && (
                            <p className="text-xs text-muted-foreground">
                              المد: {ruleItem.maddCount} حركات
                            </p>
                          )}
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            style={{ color: ruleInfo.color }}
                          >
                            تعلم المزيد ←
                          </Button>
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
                    .filter((r) => r.id !== "normal" && settings.tajweedRules[r.id])
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
