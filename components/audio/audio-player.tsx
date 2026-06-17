"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Enhanced Audio Player with Rich Features

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Download,
  BookmarkPlus,
  ListMusic,
  Settings2,
  X,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useQuran } from "@/contexts/quran-context"

const RECITERS = [
  { id: "alafasy", name: "مشاري العفاسي", nameEn: "Al-Afasy", baseUrl: "https://everyayah.com/data/Alafasy_128kbps/" },
  { id: "husary", name: "محمود خليل الحصري", nameEn: "Al-Husary", baseUrl: "https://everyayah.com/data/Husary_128kbps/" },
  { id: "abdulbasit", name: "عبد الباسط", nameEn: "Abdul Basit", baseUrl: "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/" },
  { id: "sudais", name: "عبد الرحمن السديس", nameEn: "As-Sudais", baseUrl: "https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/" },
  { id: "shuraim", name: "سعود الشريم", nameEn: "Shuraim", baseUrl: "https://everyayah.com/data/Saood_ash-Shuraym_128kbps/" },
  { id: "maher", name: "ماهر المعيقلي", nameEn: "Maher", baseUrl: "https://everyayah.com/data/MauroAl_Muaiqly_128kbps/" },
  { id: "ghamdi", name: "سعد الغامدي", nameEn: "Al-Ghamdi", baseUrl: "https://everyayah.com/data/Ghamadi_40kbps/" },
  { id: "minshawi", name: "محمد صديق المنشاوي", nameEn: "Al-Minshawi", baseUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps/" },
]

function getAudioUrl(reciterId: string, surah: number, verse: number): string {
  const reciter = RECITERS.find((r) => r.id === reciterId) || RECITERS[0]
  const s = surah.toString().padStart(3, "0")
  const v = verse.toString().padStart(3, "0")
  return `${reciter.baseUrl}${s}${v}.mp3`
}

function formatTime(time: number) {
  if (!isFinite(time) || time < 0) return "0:00"
  const m = Math.floor(time / 60)
  const s = Math.floor(time % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

interface AudioPlayerProps {
  surahNumber: number
  verseNumber: number
  surahName: string
  totalVerses?: number
  onVerseChange?: (verse: number) => void
}

export default function AudioPlayer({
  surahNumber,
  verseNumber,
  surahName,
  totalVerses = 1,
  onVerseChange,
}: AudioPlayerProps) {
  const { addBookmark } = useQuran()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [reciter, setReciter] = useState("alafasy")
  const [repeatMode, setRepeatMode] = useState<"none" | "verse" | "surah">("none")
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [autoScroll, setAutoScroll] = useState(true)
  const [repeatCount, setRepeatCount] = useState(1)
  const [currentRepeat, setCurrentRepeat] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const audioUrl = getAudioUrl(reciter, surahNumber, verseNumber)

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.src = audioUrl
    audioRef.current.load()
    setCurrentTime(0)
    setDuration(0)
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false))
    }
  }, [audioUrl])

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackSpeed
  }, [playbackSpeed])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    const v = value[0]
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v / 100
  }

  const handleSeek = (value: number[]) => {
    const t = value[0]
    setCurrentTime(t)
    if (audioRef.current) audioRef.current.currentTime = t
  }

  const cycleRepeatMode = () => {
    const modes: ("none" | "verse" | "surah")[] = ["none", "verse", "surah"]
    setRepeatMode(modes[(modes.indexOf(repeatMode) + 1) % modes.length])
    setCurrentRepeat(0)
  }

  const handleEnded = () => {
    if (repeatMode === "verse") {
      if (currentRepeat + 1 < repeatCount) {
        setCurrentRepeat((c) => c + 1)
        audioRef.current?.play()
      } else {
        setCurrentRepeat(0)
        onVerseChange?.(verseNumber + 1)
      }
    } else if (repeatMode === "surah") {
      if (verseNumber < totalVerses) {
        onVerseChange?.(verseNumber + 1)
      } else {
        onVerseChange?.(1)
      }
    } else {
      if (verseNumber < totalVerses) {
        onVerseChange?.(verseNumber + 1)
      } else {
        setIsPlaying(false)
      }
    }
  }

  const skipNext = () => {
    if (verseNumber < totalVerses) onVerseChange?.(verseNumber + 1)
  }
  const skipPrev = () => {
    if (verseNumber > 1) onVerseChange?.(verseNumber - 1)
  }

  const handleDownload = () => {
    const a = document.createElement("a")
    a.href = audioUrl
    a.download = `${surahName}_${verseNumber}.mp3`
    a.target = "_blank"
    a.click()
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="shadow-xl border bg-card/95 backdrop-blur-sm">
          <CardContent className="p-2 flex items-center gap-2">
            <Button variant="default" size="icon" className="h-9 w-9 rounded-full" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </Button>
            <div className="text-xs">
              <p className="font-amiri font-bold leading-tight">{surahName}:{verseNumber}</p>
              <p className="text-muted-foreground">{formatTime(currentTime)}/{formatTime(duration)}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsMinimized(false)}>
              <ListMusic className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        <audio ref={audioRef} onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} onEnded={handleEnded} />
      </div>
    )
  }

  return (
    <Card className="bg-card/95 backdrop-blur border shadow-lg">
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration)
          if (isPlaying) e.currentTarget.play().catch(() => {})
        }}
        onEnded={handleEnded}
      />

      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col gap-3">
          {/* Top row: info + reciter + minimize */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ListMusic className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-bold font-amiri text-sm truncate">{surahName}</p>
                <p className="text-xs text-muted-foreground">آية {verseNumber} من {totalVerses}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Select value={reciter} onValueChange={setReciter}>
                <SelectTrigger className="w-28 sm:w-36 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RECITERS.map((r) => (
                    <SelectItem key={r.id} value={r.id} className="text-xs">
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMinimized(true)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-9 tabular-nums">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-9 tabular-nums">{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-16 sm:w-20"
              />
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={skipPrev} disabled={verseNumber <= 1}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant="default" size="icon" className="h-11 w-11 rounded-full" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={skipNext} disabled={verseNumber >= totalVerses}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={cycleRepeatMode}
                title={repeatMode === "none" ? "بدون تكرار" : repeatMode === "verse" ? `تكرار الآية (${repeatCount}x)` : "تكرار السورة"}>
                {repeatMode === "verse" ? <Repeat1 className="h-4 w-4 text-primary" /> : <Repeat className={`h-4 w-4 ${repeatMode === "surah" ? "text-primary" : ""}`} />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload} title="تحميل">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => addBookmark(surahNumber, verseNumber)} title="حفظ">
                <BookmarkPlus className="h-4 w-4" />
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs">سرعة التشغيل</Label>
                      <Select value={playbackSpeed.toString()} onValueChange={(v) => setPlaybackSpeed(Number(v))}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.5">0.5x</SelectItem>
                          <SelectItem value="0.75">0.75x</SelectItem>
                          <SelectItem value="1">1x عادي</SelectItem>
                          <SelectItem value="1.25">1.25x</SelectItem>
                          <SelectItem value="1.5">1.5x</SelectItem>
                          <SelectItem value="2">2x</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">عدد التكرار: {repeatCount}</Label>
                      <Slider value={[repeatCount]} min={1} max={10} step={1} onValueChange={([v]) => setRepeatCount(v)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">تمرير تلقائي</Label>
                      <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Repeat indicator */}
          {repeatMode === "verse" && currentRepeat > 0 && (
            <div className="text-center text-xs text-muted-foreground">
              تكرار {currentRepeat + 1} من {repeatCount}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
