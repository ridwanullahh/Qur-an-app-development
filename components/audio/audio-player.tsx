"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Enhanced Audio Player Component

import { useState, useRef } from "react"
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
  ListMusic,
  Settings2,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

// Available reciters
const RECITERS = [
  { id: "mishary", name: "مشاري العفاسي", nameEn: "Mishary Alafasy" },
  { id: "abdulbasit", name: "عبد الباسط", nameEn: "Abdul Basit" },
  { id: "husary", name: "محمود خليل الحصري", nameEn: "Al-Husary" },
  { id: "sudais", name: "عبد الرحمن السديس", nameEn: "As-Sudais" },
  { id: "shuraim", name: "سعود الشريم", nameEn: "Shuraim" },
  { id: "maher", name: "ماهر المعيقلي", nameEn: "Maher Al-Muaiqly" },
  { id: "ghamdi", name: "سعد الغامدي", nameEn: "Al-Ghamdi" },
]

interface AudioPlayerProps {
  surahNumber: number
  verseNumber: number
  surahName: string
  onVerseChange?: (verse: number) => void
}

export default function AudioPlayer({ surahNumber, verseNumber, surahName, onVerseChange }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [reciter, setReciter] = useState("mishary")
  const [repeatMode, setRepeatMode] = useState<"none" | "verse" | "surah">("none")
  const [playbackSpeed, setPlaybackSpeed] = useState(1)

  const audioRef = useRef<HTMLAudioElement>(null)

  // Format time as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  const handleSeek = (value: number[]) => {
    const newTime = value[0]
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const cycleRepeatMode = () => {
    const modes: ("none" | "verse" | "surah")[] = ["none", "verse", "surah"]
    const currentIndex = modes.indexOf(repeatMode)
    setRepeatMode(modes[(currentIndex + 1) % modes.length])
  }

  const skipPrevious = () => {
    if (verseNumber > 1) {
      onVerseChange?.(verseNumber - 1)
    }
  }

  const skipNext = () => {
    onVerseChange?.(verseNumber + 1)
  }

  return (
    <Card className="bg-card/95 backdrop-blur border-t shadow-lg">
      <CardContent className="p-4">
        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={currentTime === 0 && !isPlaying ? "" : audioRef.current?.src || ""}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => {
            setDuration(e.currentTarget.duration)
            if (isPlaying) e.currentTarget.play()
          }}
          onEnded={() => {
            if (repeatMode === "verse") {
              audioRef.current?.play()
            } else {
              setIsPlaying(false)
              skipNext()
            }
          }}
        />

        <div className="flex flex-col gap-4">
          {/* Current info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ListMusic className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-bold font-amiri">{surahName}</p>
                <p className="text-xs text-muted-foreground">آية {verseNumber}</p>
              </div>
            </div>

            {/* Reciter selection */}
            <Select value={reciter} onValueChange={setReciter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RECITERS.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-10">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10">{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Left controls */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>

            {/* Center controls */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={skipNext}>
                <SkipForward className="h-5 w-5" />
              </Button>

              <Button variant="default" size="icon" className="h-12 w-12 rounded-full" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
              </Button>

              <Button variant="ghost" size="icon" onClick={skipPrevious}>
                <SkipBack className="h-5 w-5" />
              </Button>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={cycleRepeatMode}>
                {repeatMode === "verse" ? (
                  <Repeat1 className="h-5 w-5 text-primary" />
                ) : repeatMode === "surah" ? (
                  <Repeat className="h-5 w-5 text-primary" />
                ) : (
                  <Repeat className="h-5 w-5" />
                )}
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings2 className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="end">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs">سرعة التشغيل</Label>
                      <Select value={playbackSpeed.toString()} onValueChange={(v) => setPlaybackSpeed(Number(v))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.5">0.5x</SelectItem>
                          <SelectItem value="0.75">0.75x</SelectItem>
                          <SelectItem value="1">1x (عادي)</SelectItem>
                          <SelectItem value="1.25">1.25x</SelectItem>
                          <SelectItem value="1.5">1.5x</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
