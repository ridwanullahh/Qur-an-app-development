"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Settings Panel Component

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useQuran } from "@/contexts/quran-context"
import { BookOpen, Palette, Volume2, Bell, Download, ChevronDown, Info } from "lucide-react"
import { TAJWEED_RULES, type TajweedRule } from "@/lib/tajweed"

const TRANSLATIONS = [
  { id: "sahih", name: "Sahih International", language: "en" },
  { id: "pickthall", name: "Muhammad Pickthall", language: "en" },
  { id: "yusufali", name: "Yusuf Ali", language: "en" },
  { id: "urdu", name: "Mufti Taqi Usmani", language: "ur" },
  { id: "turkish", name: "Diyanet İşleri", language: "tr" },
  { id: "french", name: "Muhammad Hamidullah", language: "fr" },
]

const RECITERS = [
  { id: "mishary", name: "مشاري العفاسي" },
  { id: "abdulbasit", name: "عبد الباسط عبد الصمد" },
  { id: "husary", name: "محمود خليل الحصري" },
  { id: "sudais", name: "عبد الرحمن السديس" },
  { id: "maher", name: "ماهر المعيقلي" },
]

export default function SettingsPanel() {
  const { settings, updateSettings } = useQuran()
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    reviewDue: true,
    streakReminder: false,
  })
  const [customizeRulesOpen, setCustomizeRulesOpen] = useState(false)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-amiri">الإعدادات</h1>
        <p className="text-muted-foreground">تخصيص تجربة القراءة والحفظ</p>
      </div>

      <Tabs defaultValue="display">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="display" className="gap-1">
            <Palette className="h-4 w-4" />
            العرض
          </TabsTrigger>
          <TabsTrigger value="reading" className="gap-1">
            <BookOpen className="h-4 w-4" />
            القراءة
          </TabsTrigger>
          <TabsTrigger value="tajweed" className="gap-1">
            <Palette className="h-4 w-4" />
            التجويد
          </TabsTrigger>
          <TabsTrigger value="audio" className="gap-1">
            <Volume2 className="h-4 w-4" />
            الصوت
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1">
            <Bell className="h-4 w-4" />
            التنبيهات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="display" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>المظهر</CardTitle>
              <CardDescription>تخصيص مظهر التطبيق</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>السمة</Label>
                <Select value={settings.theme} onValueChange={(v: any) => updateSettings({ theme: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">فاتح</SelectItem>
                    <SelectItem value="dark">داكن</SelectItem>
                    <SelectItem value="sepia">سيبيا</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>حجم الخط العربي: {settings.fontSize}px</Label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([v]) => updateSettings({ fontSize: v })}
                  min={20}
                  max={48}
                  step={2}
                />
              </div>

              <div className="space-y-2">
                <Label>خط المصحف</Label>
                <Select value={settings.fontFamily} onValueChange={(v: any) => updateSettings({ fontFamily: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uthmani">الخط العثماني</SelectItem>
                    <SelectItem value="naskh">النسخ</SelectItem>
                    <SelectItem value="amiri">أميري</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>عرض الصفحة</Label>
                <Select value={settings.pageView} onValueChange={(v: any) => updateSettings({ pageView: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mushaf">عرض المصحف</SelectItem>
                    <SelectItem value="list">عرض القائمة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reading" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>خيارات القراءة</CardTitle>
              <CardDescription>تخصيص محتوى العرض</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>إظهار الترجمة</Label>
                  <p className="text-xs text-muted-foreground">عرض ترجمة الآيات</p>
                </div>
                <Switch
                  checked={settings.showTranslation}
                  onCheckedChange={(v) => updateSettings({ showTranslation: v })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>إظهار النطق</Label>
                  <p className="text-xs text-muted-foreground">عرض النطق بالحروف اللاتينية</p>
                </div>
                <Switch
                  checked={settings.showTransliteration}
                  onCheckedChange={(v) => updateSettings({ showTransliteration: v })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>كلمة بكلمة</Label>
                  <p className="text-xs text-muted-foreground">تفعيل التفاعل مع كل كلمة</p>
                </div>
                <Switch checked={settings.wordByWord} onCheckedChange={(v) => updateSettings({ wordByWord: v })} />
              </div>

              <div className="space-y-2">
                <Label>لغة الترجمة</Label>
                <Select
                  value={settings.translationLanguage}
                  onValueChange={(v) => updateSettings({ translationLanguage: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSLATIONS.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tajweed" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات التجويد</CardTitle>
              <CardDescription>تخصيص عرض أحكام التجويد</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>إظهار ألوان التجويد</Label>
                  <p className="text-xs text-muted-foreground">تفعيل أو إيقاف جميع ألوان التجويد</p>
                </div>
                <Switch
                  checked={settings.showTajweed}
                  onCheckedChange={(v) => updateSettings({ showTajweed: v })}
                />
              </div>

              <div className="space-y-2">
                <Label>مستوى الصعوبة</Label>
                <Select
                  value={settings.tajweedDifficulty}
                  onValueChange={(v: "basic" | "intermediate" | "advanced") =>
                    updateSettings({ tajweedDifficulty: v })
                  }
                  disabled={!settings.showTajweed}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">أساسي - Basic</SelectItem>
                    <SelectItem value="intermediate">متوسط - Intermediate</SelectItem>
                    <SelectItem value="advanced">متقدم - Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">اختر مستوى الأحكام المعروضة حسب مستواك</p>
              </div>

              <div className="space-y-2">
                <Label>شدة اللون: {settings.tajweedColorIntensity}%</Label>
                <Slider
                  value={[settings.tajweedColorIntensity]}
                  onValueChange={([v]) => updateSettings({ tajweedColorIntensity: v })}
                  min={0}
                  max={100}
                  step={10}
                  disabled={!settings.showTajweed}
                />
                <p className="text-xs text-muted-foreground">تحكم في شدة ألوان التجويد</p>
              </div>

              <Collapsible open={customizeRulesOpen} onOpenChange={setCustomizeRulesOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    disabled={!settings.showTajweed}
                  >
                    تخصيص الأحكام
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${customizeRulesOpen ? "rotate-180" : ""}`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-muted-foreground">
                      أحكام النون الساكنة والتنوين
                    </div>
                    {(["ghunnah", "ikhfa", "idgham", "iqlab", "izhar"] as TajweedRule[]).map((ruleId) => {
                      const rule = TAJWEED_RULES[ruleId]
                      return (
                        <div key={ruleId} className="flex items-center justify-between pr-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: rule.color }}
                            />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-1 cursor-help">
                                    <Label className="cursor-help">
                                      {rule.nameArabic} - {rule.nameEnglish}
                                    </Label>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="text-sm">{rule.description.ar}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {rule.description.en}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Switch
                            checked={settings.tajweedRules[ruleId] ?? true}
                            onCheckedChange={(v) =>
                              updateSettings({
                                tajweedRules: {
                                  ...settings.tajweedRules,
                                  [ruleId]: v,
                                },
                              })
                            }
                          />
                        </div>
                      )
                    })}

                    <div className="text-sm font-semibold text-muted-foreground mt-4">أحكام القلقلة</div>
                    {(["qalqalah"] as TajweedRule[]).map((ruleId) => {
                      const rule = TAJWEED_RULES[ruleId]
                      return (
                        <div key={ruleId} className="flex items-center justify-between pr-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: rule.color }}
                            />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-1 cursor-help">
                                    <Label className="cursor-help">
                                      {rule.nameArabic} - {rule.nameEnglish}
                                    </Label>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="text-sm">{rule.description.ar}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {rule.description.en}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Switch
                            checked={settings.tajweedRules[ruleId] ?? true}
                            onCheckedChange={(v) =>
                              updateSettings({
                                tajweedRules: {
                                  ...settings.tajweedRules,
                                  [ruleId]: v,
                                },
                              })
                            }
                          />
                        </div>
                      )
                    })}

                    <div className="text-sm font-semibold text-muted-foreground mt-4">أحكام المد</div>
                    {(["madd", "madd_lazim", "madd_muttasil", "madd_munfasil"] as TajweedRule[]).map(
                      (ruleId) => {
                        const rule = TAJWEED_RULES[ruleId]
                        return (
                          <div key={ruleId} className="flex items-center justify-between pr-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: rule.color }}
                              />
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1 cursor-help">
                                      <Label className="cursor-help">
                                        {rule.nameArabic} - {rule.nameEnglish}
                                      </Label>
                                      <Info className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p className="text-sm">{rule.description.ar}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {rule.description.en}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Switch
                              checked={settings.tajweedRules[ruleId] ?? true}
                              onCheckedChange={(v) =>
                                updateSettings({
                                  tajweedRules: {
                                    ...settings.tajweedRules,
                                    [ruleId]: v,
                                  },
                                })
                              }
                            />
                          </div>
                        )
                      },
                    )}

                    <div className="text-sm font-semibold text-muted-foreground mt-4">أحكام اللام</div>
                    {(["lam_shamsiyyah", "lam_qamariyyah"] as TajweedRule[]).map((ruleId) => {
                      const rule = TAJWEED_RULES[ruleId]
                      return (
                        <div key={ruleId} className="flex items-center justify-between pr-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: rule.color }}
                            />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-1 cursor-help">
                                    <Label className="cursor-help">
                                      {rule.nameArabic} - {rule.nameEnglish}
                                    </Label>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="text-sm">{rule.description.ar}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {rule.description.en}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Switch
                            checked={settings.tajweedRules[ruleId] ?? true}
                            onCheckedChange={(v) =>
                              updateSettings({
                                tajweedRules: {
                                  ...settings.tajweedRules,
                                  [ruleId]: v,
                                },
                              })
                            }
                          />
                        </div>
                      )
                    })}

                    <div className="text-sm font-semibold text-muted-foreground mt-4">أخرى</div>
                    {(["silent"] as TajweedRule[]).map((ruleId) => {
                      const rule = TAJWEED_RULES[ruleId]
                      return (
                        <div key={ruleId} className="flex items-center justify-between pr-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: rule.color }}
                            />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-1 cursor-help">
                                    <Label className="cursor-help">
                                      {rule.nameArabic} - {rule.nameEnglish}
                                    </Label>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="text-sm">{rule.description.ar}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {rule.description.en}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Switch
                            checked={settings.tajweedRules[ruleId] ?? true}
                            onCheckedChange={(v) =>
                              updateSettings({
                                tajweedRules: {
                                  ...settings.tajweedRules,
                                  [ruleId]: v,
                                },
                              })
                            }
                          />
                        </div>
                      )
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  updateSettings({
                    showTajweed: true,
                    tajweedDifficulty: "basic",
                    tajweedColorIntensity: 80,
                    tajweedRules: {
                      ghunnah: true,
                      ikhfa: true,
                      idgham: true,
                      iqlab: true,
                      qalqalah: true,
                      madd: true,
                      madd_lazim: true,
                      madd_muttasil: true,
                      madd_munfasil: true,
                      izhar: true,
                      lam_shamsiyyah: true,
                      lam_qamariyyah: true,
                      silent: true,
                      normal: true,
                    },
                  })
                }}
              >
                إعادة تعيين إلى الافتراضي
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الصوت</CardTitle>
              <CardDescription>تخصيص تجربة الاستماع</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>القارئ الافتراضي</Label>
                <Select value={settings.reciter} onValueChange={(v) => updateSettings({ reciter: v })}>
                  <SelectTrigger>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>التنبيهات</CardTitle>
              <CardDescription>إدارة التذكيرات والإشعارات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>تذكير يومي</Label>
                  <p className="text-xs text-muted-foreground">تذكير للقراءة اليومية</p>
                </div>
                <Switch
                  checked={notifications.dailyReminder}
                  onCheckedChange={(v) => setNotifications({ ...notifications, dailyReminder: v })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>تذكير المراجعة</Label>
                  <p className="text-xs text-muted-foreground">تنبيه عند وجود آيات للمراجعة</p>
                </div>
                <Switch
                  checked={notifications.reviewDue}
                  onCheckedChange={(v) => setNotifications({ ...notifications, reviewDue: v })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>تذكير السلسلة</Label>
                  <p className="text-xs text-muted-foreground">تذكير للحفاظ على السلسلة اليومية</p>
                </div>
                <Switch
                  checked={notifications.streakReminder}
                  onCheckedChange={(v) => setNotifications({ ...notifications, streakReminder: v })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            تحميل للقراءة بدون اتصال
          </CardTitle>
          <CardDescription>تحميل المحتوى للوصول بدون إنترنت</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full bg-transparent">
            تحميل القرآن كاملاً
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
