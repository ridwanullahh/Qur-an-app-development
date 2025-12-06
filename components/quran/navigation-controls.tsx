"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Navigation Controls Component

import { ChevronRight, ChevronLeft, SkipForward, SkipBack, Play, Pause, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useQuran } from "@/contexts/quran-context"

export default function NavigationControls() {
  const {
    currentSurah,
    currentVerse,
    surahInfo,
    nextVerse,
    prevVerse,
    nextSurah,
    prevSurah,
    isPlaying,
    playAudio,
    pauseAudio,
    settings,
    updateSettings,
  } = useQuran()

  return (
    <div className="sticky bottom-0 mt-6 bg-card/95 backdrop-blur border-t border-border p-4 rounded-t-xl shadow-lg">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {/* Previous */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={nextSurah} disabled={currentSurah >= 114} title="السورة التالية">
            <SkipForward className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextVerse}
            disabled={!surahInfo || currentVerse >= surahInfo.versesCount}
            title="الآية التالية"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-4">
          {/* Play/Pause */}
          <Button
            variant="default"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={isPlaying ? pauseAudio : playAudio}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 mr-[-2px]" />}
          </Button>

          {/* Current Position */}
          <div className="text-center min-w-[100px]">
            <p className="text-sm font-medium">{surahInfo?.nameArabic}</p>
            <p className="text-xs text-muted-foreground">
              آية {currentVerse} من {surahInfo?.versesCount}
            </p>
          </div>
        </div>

        {/* Next */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevVerse}
            disabled={currentVerse <= 1 && currentSurah <= 1}
            title="الآية السابقة"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={prevSurah} disabled={currentSurah <= 1} title="السورة السابقة">
            <SkipBack className="h-5 w-5" />
          </Button>

          {/* Quick Settings */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings2 className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end">
              <div className="space-y-4">
                <h4 className="font-bold text-sm">إعدادات سريعة</h4>

                {/* Font Size */}
                <div className="space-y-2">
                  <Label className="text-xs">حجم الخط</Label>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={([value]) => updateSettings({ fontSize: value })}
                    min={20}
                    max={48}
                    step={2}
                  />
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">إظهار الترجمة</Label>
                    <Switch
                      checked={settings.showTranslation}
                      onCheckedChange={(checked) => updateSettings({ showTranslation: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">إظهار النطق</Label>
                    <Switch
                      checked={settings.showTransliteration}
                      onCheckedChange={(checked) => updateSettings({ showTransliteration: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">كلمة بكلمة</Label>
                    <Switch
                      checked={settings.wordByWord}
                      onCheckedChange={(checked) => updateSettings({ wordByWord: checked })}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
