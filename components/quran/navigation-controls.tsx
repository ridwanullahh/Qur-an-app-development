"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Navigation Controls Component with Background Color Picker

import { ChevronRight, ChevronLeft, SkipForward, SkipBack, Play, Pause, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useQuran } from "@/contexts/quran-context"

const MUSHAF_BG_PRESETS = [
  { name: "أبيض كريمي", value: "#FAF8F0" },
  { name: "أبيض نقي", value: "#FFFFFF" },
  { name: "بيج فاتح", value: "#F5F0E6" },
  { name: "ذهبي خفيف", value: "#FDF6E3" },
  { name: "أخضر فاتح", value: "#F0F5F0" },
  { name: "رمادي فاتح", value: "#F5F5F5" },
]

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

        <div className="flex items-center gap-4">
          <Button
            variant="default"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={isPlaying ? pauseAudio : playAudio}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 mr-[-2px]" />}
          </Button>

          <div className="text-center min-w-[100px]">
            <p className="text-sm font-medium">{surahInfo?.nameArabic}</p>
            <p className="text-xs text-muted-foreground">
              آية {currentVerse} من {surahInfo?.versesCount}
            </p>
          </div>
        </div>

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

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings2 className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end">
              <div className="space-y-4">
                <h4 className="font-bold text-sm">إعدادات سريعة</h4>

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

                <div className="space-y-2">
                  <Label className="text-xs">لون خلفية المصحف</Label>
                  <div className="flex gap-2 flex-wrap">
                    {MUSHAF_BG_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => updateSettings({ mushafBgColor: preset.value })}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          settings.mushafBgColor === preset.value
                            ? "border-primary scale-110 shadow-md"
                            : "border-border hover:border-primary/50"
                        }`}
                        style={{ backgroundColor: preset.value }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Label className="text-xs whitespace-nowrap">مخصص:</Label>
                    <input
                      type="color"
                      value={settings.mushafBgColor || "#FAF8F0"}
                      onChange={(e) => updateSettings({ mushafBgColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border border-border"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">إظهار الترجمة</Label>
                    <Switch
                      checked={settings.showTranslation}
                      onCheckedChange={(checked) => updateSettings({ showTranslation: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">إظهار التجويد</Label>
                    <Switch
                      checked={settings.showTajweed}
                      onCheckedChange={(checked) => updateSettings({ showTajweed: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">إظهار النطق</Label>
                    <Switch
                      checked={settings.showTransliteration}
                      onCheckedChange={(checked) => updateSettings({ showTransliteration: checked })}
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
