"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Main Quran Reader Component - Cohesive UI for both Mushaf and List views

import { useState } from "react"
import { useQuran } from "@/contexts/quran-context"
import { useI18n } from "@/lib/i18n"
import MushafPageSpread from "./mushaf-page-spread"
import SurahHeader from "./surah-header"
import VerseDisplay from "./verse-display"
import NavigationControls from "./navigation-controls"
import { hasBismillah, BISMILLAH } from "@/lib/quran-data"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Book, List, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function QuranReader() {
  const { currentSurah, surahInfo, verses, settings, updateSettings } = useQuran()
  const { t, language, setLanguage, availableLanguages } = useI18n()
  const [viewMode, setViewMode] = useState<"mushaf" | "list">("mushaf")

  if (!surahInfo) {
    return (
      <div className="flex items-center justify-center h-full" role="status" aria-live="polite">
        <p className="text-muted-foreground font-amiri text-lg">{t("msg.loading")}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Unified Header Controls - Same style for both views */}
      <div className="flex items-center justify-between mb-4 px-4 py-3 bg-card rounded-lg border shadow-sm">
        {/* View Mode Toggle */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "mushaf" | "list")}>
          <TabsList className="bg-muted">
            <TabsTrigger value="mushaf" className="gap-2" aria-label={t("view.mushaf")}>
              <Book className="h-4 w-4" />
              <span className="hidden sm:inline">{t("view.mushaf")}</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2" aria-label={t("view.list")}>
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">{t("view.list")}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Current Position Info */}
        <div className="text-center flex-1 mx-4">
          <p className="font-amiri text-lg font-bold text-primary">{surahInfo.nameArabic}</p>
          <p className="text-xs text-muted-foreground">
            {t("quran.juz")} {surahInfo.juzStart} | {t("quran.page")} {surahInfo.pageStart}
          </p>
        </div>

        {/* Quick Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label={t("settings.title")}>
              <Settings2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{t("settings.title")}</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Language Selection */}
            <DropdownMenuLabel className="text-xs text-muted-foreground">{t("settings.language")}</DropdownMenuLabel>
            {availableLanguages.slice(0, 5).map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={language === lang.code ? "bg-primary/10" : ""}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.nativeName}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />

            {/* Tajweed Toggle */}
            <DropdownMenuItem onClick={() => updateSettings({ wordByWord: !settings.wordByWord })}>
              <span className="flex-1">{t("settings.tajweed")}</span>
              <span className={settings.wordByWord ? "text-primary" : "text-muted-foreground"}>
                {settings.wordByWord ? "✓" : "○"}
              </span>
            </DropdownMenuItem>

            {/* Translation Toggle */}
            <DropdownMenuItem onClick={() => updateSettings({ showTranslation: !settings.showTranslation })}>
              <span className="flex-1">{t("settings.translation")}</span>
              <span className={settings.showTranslation ? "text-primary" : "text-muted-foreground"}>
                {settings.showTranslation ? "✓" : "○"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content */}
      {viewMode === "mushaf" ? (
        /* Authentic Two-Page Mushaf View */
        <MushafPageSpread />
      ) : (
        /* List View - Cohesive styling with Mushaf view */
        <div
          className="animate-fade-in max-w-4xl mx-auto bg-card border-2 border-mushaf-green/30 rounded-lg overflow-hidden"
          style={{ backgroundColor: "var(--mushaf-cream)" }}
        >
          {/* Decorative header matching Mushaf style */}
          <div className="bg-mushaf-green/10 border-b border-mushaf-green/20 p-4">
            <SurahHeader surah={surahInfo} />
          </div>

          {/* Content area */}
          <div className="p-6">
            {hasBismillah(currentSurah) && (
              <div className="text-center my-6">
                <p className="text-2xl font-amiri text-primary">{BISMILLAH}</p>
              </div>
            )}

            <div className="space-y-4" role="list" aria-label={`آيات سورة ${surahInfo.nameArabic}`}>
              {verses.length > 0 ? (
                verses.map((verse) => (
                  <VerseDisplay
                    key={`${verse.surah}-${verse.verse}`}
                    verse={verse}
                    showTranslation={settings.showTranslation}
                    showTransliteration={settings.showTransliteration}
                    wordByWord={settings.wordByWord}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground" role="status">
                  <p className="font-amiri text-lg">آيات هذه السورة ستكون متاحة قريباً</p>
                  <p className="text-sm mt-2">يمكنك تصفح السور المتوفرة: الفاتحة، البقرة (أول 10 آيات)، وآخر 10 سور</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer matching Mushaf style */}
          <div className="bg-mushaf-green/10 border-t border-mushaf-green/20 py-3 text-center text-sm text-muted-foreground">
            <span>
              {t("quran.page")} {surahInfo.pageStart}
            </span>
            <span className="mx-2">|</span>
            <span>
              {t("quran.juz")} {surahInfo.juzStart}
            </span>
            <span className="mx-2">|</span>
            <span>
              {surahInfo.versesCount} {t("quran.verses")}
            </span>
          </div>
        </div>
      )}

      <NavigationControls />
    </div>
  )
}
