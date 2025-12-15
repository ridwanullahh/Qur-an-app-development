"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Memorization Dashboard - Track and manage Hifz progress

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  Play,
  RefreshCw,
  Star,
  Target,
  TrendingUp,
} from "lucide-react"
import { SURAHS } from "@/lib/quran-data"
import MemorizationSession from "./memorization-session"
import Link from "next/link"

export default function MemorizationDashboard() {
  const [showSession, setShowSession] = useState(false)
  const [sessionType, setSessionType] = useState<"new" | "review">("new")
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    totalMemorized: 0,
    totalVerses: 6236,
    currentStreak: 0,
    todayMinutes: 0,
    weeklyGoal: 7,
    weeklyProgress: 0,
    dueForReview: 0,
    newToday: 0
  })
  const [memorizedSurahs, setMemorizedSurahs] = useState<number[]>([])
  const [inProgressSurahs, setInProgressSurahs] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch memorization data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, userId would come from auth context
        const userId = "default"
        const res = await fetch(`/api/memorization?userId=${userId}`)
        const data = await res.json()

        if (data.stats && data.bySurah) {
          setStats(prev => ({
            ...prev,
            totalMemorized: data.stats.totalMemorized,
            dueForReview: data.stats.dueForReview,
            // Other stats would be calculated from detailed logs in a real implementation
          }))

          // Process surah status
          const memorized = []
          const inProgress = []
          for (const [surahNum, info] of Object.entries(data.bySurah)) {
            const sNum = parseInt(surahNum)
            const surah = SURAHS.find(s => s.number === sNum)
            if (!surah) continue

            // Simple logic: if all verses memorized -> memorized
            if ((info as any).memorized >= surah.versesCount) {
              memorized.push(sNum)
            } else {
              inProgress.push(sNum)
            }
          }
          setMemorizedSurahs(memorized)
          setInProgressSurahs(inProgress)
        }
      } catch (error) {
        console.error("Failed to load memorization data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const progressPercentage = (stats.totalMemorized / stats.totalVerses) * 100

  if (showSession) {
    return <MemorizationSession type={sessionType} onClose={() => setShowSession(false)} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-amiri">الحفظ والمراجعة</h1>
          <p className="text-muted-foreground">تتبع تقدمك في حفظ القرآن الكريم</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setSessionType("review")
              setShowSession(true)
            }}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            مراجعة ({stats.dueForReview})
          </Button>
          <Button
            onClick={() => {
              setSessionType("new")
              setShowSession(true)
            }}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            حفظ جديد
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalMemorized}</p>
                <p className="text-xs text-muted-foreground">آية محفوظة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.currentStreak}</p>
                <p className="text-xs text-muted-foreground">يوم متتالي</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.todayMinutes}</p>
                <p className="text-xs text-muted-foreground">دقيقة اليوم</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Target className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats.weeklyProgress}/{stats.weeklyGoal}
                </p>
                <p className="text-xs text-muted-foreground">هدف الأسبوع</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="surahs" className="gap-2">
            <BookOpen className="h-4 w-4" />
            السور
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            <Calendar className="h-4 w-4" />
            الجدول
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                تقدم الحفظ الكلي
              </CardTitle>
              <CardDescription>
                {mockProgress.totalVersesMemorized} من {mockProgress.totalVerses} آية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progressPercentage} className="h-4" />
              <p className="text-sm text-muted-foreground mt-2 text-center">{progressPercentage.toFixed(1)}% مكتمل</p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-primary" />
                  المراجعة المستحقة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{mockProgress.dueForReview}</p>
                <p className="text-sm text-muted-foreground mb-4">آيات تحتاج مراجعة اليوم</p>
                <Button
                  className="w-full"
                  onClick={() => {
                    setSessionType("review")
                    setShowSession(true)
                  }}
                >
                  ابدأ المراجعة
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="h-5 w-5 text-green-600" />
                  حفظ جديد
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{mockProgress.newToday}</p>
                <p className="text-sm text-muted-foreground mb-4">آيات جديدة اليوم</p>
                <Button
                  variant="outline"
                  className="w-full border-green-500/50 text-green-700 hover:bg-green-500/10 bg-transparent"
                  onClick={() => {
                    setSessionType("new")
                    setShowSession(true)
                  }}
                >
                  احفظ المزيد
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="surahs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>حالة السور</CardTitle>
              <CardDescription>تتبع تقدمك في كل سورة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 max-h-[500px] overflow-y-auto">
                {SURAHS.map((surah) => {
                  const isMemorized = mockProgress.memorizedSurahs.includes(surah.number)
                  const isInProgress = mockProgress.inProgressSurahs.includes(surah.number)

                  return (
                    <Link
                      key={surah.number}
                      href={`/?surah=${surah.number}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                          {surah.number}
                        </span>
                        <div>
                          <p className="font-bold font-amiri">{surah.nameArabic}</p>
                          <p className="text-xs text-muted-foreground">{surah.versesCount} آيات</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isMemorized && (
                          <Badge variant="default" className="bg-green-500 gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            محفوظة
                          </Badge>
                        )}
                        {isInProgress && (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" />
                            جاري الحفظ
                          </Badge>
                        )}
                        {!isMemorized && !isInProgress && (
                          <Badge variant="outline" className="text-muted-foreground">
                            لم تبدأ
                          </Badge>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>جدول الحفظ</CardTitle>
              <CardDescription>خطة الحفظ الأسبوعية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"].map((day, index) => (
                  <div key={day} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="font-medium">{day}</span>
                    <div className="flex items-center gap-2">
                      {index < mockProgress.weeklyProgress ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
