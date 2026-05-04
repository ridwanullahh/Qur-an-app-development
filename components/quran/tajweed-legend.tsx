"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Tajweed Legend Component - Interactive Educational Panel

import { useState, useMemo } from "react"
import { ChevronDown, ChevronUp, Search, Volume2, BookOpen, X, Filter } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { TAJWEED_RULES, type TajweedRule, type TajweedDifficulty } from "@/lib/tajweed"
import { useQuran } from "@/contexts/quran-context"

interface TajweedLegendProps {
  placement?: "floating" | "sidebar"
  onRuleClick?: (rule: TajweedRule) => void
  className?: string
}

// Group rules by category for better organization
const RULE_CATEGORIES = {
  "noon-sakinah": {
    nameAr: "أحكام النون الساكنة والتنوين",
    nameEn: "Noon Sakinah & Tanween Rules",
    nameUr: "نون ساکنہ اور تنوین کے احکام",
    rules: [
      "ghunnah",
      "izhar",
      "izhar_halqi",
      "ikhfa",
      "ikhfa_haqiqi",
      "idgham",
      "idgham_with_ghunnah",
      "idgham_without_ghunnah",
      "iqlab",
    ] as TajweedRule[],
  },
  "meem-sakinah": {
    nameAr: "أحكام الميم الساكنة",
    nameEn: "Meem Sakinah Rules",
    nameUr: "میم ساکن کے احکام",
    rules: ["ikhfa_shafawi", "idgham_shafawi", "izhar_shafawi"] as TajweedRule[],
  },
  qalqalah: {
    nameAr: "أحكام القلقلة",
    nameEn: "Qalqalah Rules",
    nameUr: "قلقلہ کے احکام",
    rules: ["qalqalah", "qalqalah_sughra", "qalqalah_kubra"] as TajweedRule[],
  },
  madd: {
    nameAr: "أحكام المد",
    nameEn: "Madd (Prolongation) Rules",
    nameUr: "مد کے احکام",
    rules: [
      "madd",
      "madd_tabii",
      "madd_lazim",
      "madd_muttasil",
      "madd_munfasil",
      "madd_badal",
      "madd_arid",
      "madd_leen",
      "madd_silah_sughra",
      "madd_silah_kubra",
      "madd_iwad",
      "madd_tamkeen",
      "madd_farq",
    ] as TajweedRule[],
  },
  ra: {
    nameAr: "أحكام الراء",
    nameEn: "Ra Rules",
    nameUr: "راء کے احکام",
    rules: ["tafkheem", "tarqeeq"] as TajweedRule[],
  },
  lam: {
    nameAr: "أحكام اللام",
    nameEn: "Lam Rules",
    nameUr: "لام کے احکام",
    rules: ["lam_shamsiyyah", "lam_qamariyyah", "lam_jalalah_tafkheem", "lam_jalalah_tarqeeq"] as TajweedRule[],
  },
  sifaat: {
    nameAr: "الصفات",
    nameEn: "Characteristics",
    nameUr: "صفات",
    rules: ["istila", "istifal"] as TajweedRule[],
  },
} as const

export default function TajweedLegend({ placement = "floating", onRuleClick, className }: TajweedLegendProps) {
  const { settings, updateSettings } = useQuran()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<TajweedDifficulty | "all">("all")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [hoveredRule, setHoveredRule] = useState<TajweedRule | null>(null)

  // Get current language from settings (default to 'ar')
  const language = settings.translationLanguage || "ar"

  // Filter rules based on search and difficulty
  const filteredCategories = useMemo(() => {
    const filtered: typeof RULE_CATEGORIES = {} as any

    Object.entries(RULE_CATEGORIES).forEach(([categoryKey, category]) => {
      const filteredRules = category.rules.filter((ruleId) => {
        const rule = TAJWEED_RULES[ruleId]
        if (!rule) return false

        // Filter by difficulty
        if (selectedDifficulty !== "all" && rule.difficulty !== selectedDifficulty) {
          return false
        }

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          return (
            rule.nameArabic.includes(searchQuery) ||
            rule.nameEnglish.toLowerCase().includes(query) ||
            rule.description.ar?.includes(searchQuery) ||
            rule.description.en?.toLowerCase().includes(query) ||
            rule.description.ur?.includes(searchQuery)
          )
        }

        return true
      })

      if (filteredRules.length > 0) {
        filtered[categoryKey] = { ...category, rules: filteredRules }
      }
    })

    return filtered
  }, [searchQuery, selectedDifficulty])

  const handleRuleClick = (rule: TajweedRule) => {
    // Toggle rule visibility in settings
    updateSettings({
      tajweedRules: {
        ...settings.tajweedRules,
        [rule]: !settings.tajweedRules[rule],
      },
    })

    // Notify parent component
    onRuleClick?.(rule)
  }

  const getCategoryName = (category: (typeof RULE_CATEGORIES)[keyof typeof RULE_CATEGORIES]) => {
    if (language === "en") return category.nameEn
    if (language === "ur") return category.nameUr
    return category.nameAr
  }

  const getDescription = (rule: (typeof TAJWEED_RULES)[TajweedRule]) => {
    if (language === "en") return rule.description.en
    if (language === "ur") return rule.description.ur
    return rule.description.ar
  }

  const getDifficultyLabel = (difficulty: TajweedDifficulty) => {
    const labels = {
      basic: { ar: "أساسي", en: "Basic", ur: "بنیادی" },
      intermediate: { ar: "متوسط", en: "Intermediate", ur: "درمیانی" },
      advanced: { ar: "متقدم", en: "Advanced", ur: "اعلیٰ" },
    }
    if (language === "en") return labels[difficulty].en
    if (language === "ur") return labels[difficulty].ur
    return labels[difficulty].ar
  }

  const getDifficultyColor = (difficulty: TajweedDifficulty) => {
    return {
      basic: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }[difficulty]
  }

  return (
    <div
      className={cn(
        "tajweed-legend",
        placement === "floating" && "fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]",
        placement === "sidebar" && "w-full",
        className,
      )}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="bg-card border rounded-lg shadow-lg">
          {/* Header */}
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50"
              aria-label={isOpen ? "إغلاق دليل التجويد" : "فتح دليل التجويد"}
            >
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg">
                  {language === "en" ? "Tajweed Legend" : language === "ur" ? "تجوید کی رہنما" : "دليل التجويد"}
                </span>
              </div>
              {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
            </Button>
          </CollapsibleTrigger>

          {/* Content */}
          <CollapsibleContent>
            <div className="border-t">
              {/* Search and Filters */}
              <div className="p-4 space-y-3 border-b bg-muted/30">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={
                      language === "en"
                        ? "Search rules..."
                        : language === "ur"
                        ? "قواعد تلاش کریں..."
                        : "ابحث عن القواعد..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-9"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Difficulty Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Button
                    variant={selectedDifficulty === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty("all")}
                  >
                    {language === "en" ? "All" : language === "ur" ? "تمام" : "الكل"}
                  </Button>
                  <Button
                    variant={selectedDifficulty === "basic" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty("basic")}
                  >
                    {getDifficultyLabel("basic")}
                  </Button>
                  <Button
                    variant={selectedDifficulty === "intermediate" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty("intermediate")}
                  >
                    {getDifficultyLabel("intermediate")}
                  </Button>
                  <Button
                    variant={selectedDifficulty === "advanced" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty("advanced")}
                  >
                    {getDifficultyLabel("advanced")}
                  </Button>
                </div>
              </div>

              {/* Rules List */}
              <ScrollArea className="h-[60vh] max-h-[500px]">
                <div className="p-4 space-y-4">
                  {Object.entries(filteredCategories).map(([categoryKey, category]) => (
                    <div key={categoryKey} className="space-y-2">
                      {/* Category Header */}
                      <button
                        onClick={() => setActiveCategory(activeCategory === categoryKey ? null : categoryKey)}
                        className="w-full flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <h3 className="font-bold text-sm text-primary">{getCategoryName(category)}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {category.rules.length}
                        </Badge>
                      </button>

                      {/* Rules in Category */}
                      {(activeCategory === categoryKey || activeCategory === null) && (
                        <div className="space-y-1 pl-2">
                          {category.rules.map((ruleId) => {
                            const rule = TAJWEED_RULES[ruleId]
                            if (!rule) return null

                            const isEnabled = settings.tajweedRules[ruleId] !== false
                            const isHovered = hoveredRule === ruleId

                            return (
                              <div
                                key={ruleId}
                                className={cn(
                                  "group relative flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer",
                                  isEnabled ? "bg-card hover:bg-muted/50" : "bg-muted/30 opacity-60",
                                  isHovered && "ring-2 ring-primary/50",
                                )}
                                onClick={() => handleRuleClick(ruleId)}
                                onMouseEnter={() => setHoveredRule(ruleId)}
                                onMouseLeave={() => setHoveredRule(null)}
                                role="button"
                                tabIndex={0}
                                aria-label={`${rule.nameArabic} - ${isEnabled ? "مفعّل" : "معطّل"}`}
                                onKeyDown={(e) => e.key === "Enter" && handleRuleClick(ruleId)}
                              >
                                {/* Color Indicator */}
                                <div
                                  className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 ring-2 ring-offset-2 ring-offset-background"
                                  style={{
                                    backgroundColor: rule.color,
                                    ringColor: isEnabled ? rule.color : "transparent",
                                  }}
                                />

                                {/* Rule Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold font-amiri text-sm" style={{ color: rule.color }}>
                                      {rule.nameArabic}
                                    </span>
                                    <Badge className={cn("text-xs", getDifficultyColor(rule.difficulty))}>
                                      {getDifficultyLabel(rule.difficulty)}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">{getDescription(rule)}</p>

                                  {/* Examples */}
                                  {rule.examples.length > 0 && (
                                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                                      {rule.examples.slice(0, 3).map((example, idx) => (
                                        <span
                                          key={idx}
                                          className="text-sm font-amiri px-2 py-0.5 rounded"
                                          style={{ backgroundColor: rule.bgColor, color: rule.color }}
                                        >
                                          {example}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      // TODO: Play audio pronunciation
                                    }}
                                    aria-label="استمع للنطق"
                                  >
                                    <Volume2 className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      // TODO: Open detailed explanation
                                    }}
                                    aria-label="اقرأ المزيد"
                                  >
                                    <BookOpen className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}

                  {Object.keys(filteredCategories).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>{language === "en" ? "No rules found" : language === "ur" ? "کوئی قاعدہ نہیں ملا" : "لا توجد قواعد"}</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Footer Actions */}
              <div className="border-t p-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const allEnabled = Object.fromEntries(
                      Object.keys(TAJWEED_RULES).map((rule) => [rule, true]),
                    ) as Record<TajweedRule, boolean>
                    updateSettings({ tajweedRules: allEnabled })
                  }}
                >
                  {language === "en" ? "Enable All" : language === "ur" ? "تمام فعال کریں" : "تفعيل الكل"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const allDisabled = Object.fromEntries(
                      Object.keys(TAJWEED_RULES).map((rule) => [rule, false]),
                    ) as Record<TajweedRule, boolean>
                    updateSettings({ tajweedRules: allDisabled })
                  }}
                >
                  {language === "en" ? "Disable All" : language === "ur" ? "تمام غیر فعال کریں" : "تعطيل الكل"}
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  )
}

// Missing import
import { Palette } from "lucide-react"
