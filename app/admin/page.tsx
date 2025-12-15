"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Admin Overview Page

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Languages, Book, Activity } from "lucide-react"

export default function AdminPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-amiri">نظرة عامة</h1>
                <p className="text-muted-foreground">ملخص نشاط وإحصائيات التطبيق</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            إجمالي المستخدمين
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% من الشهر الماضي
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            الترجمات النشطة
                        </CardTitle>
                        <Languages className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">15</div>
                        <p className="text-xs text-muted-foreground">
                            +2 لغات جديدة
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            التفاسير
                        </CardTitle>
                        <Book className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">
                            جميعها محدثة
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            نشاط API
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45.2k</div>
                        <p className="text-xs text-muted-foreground">
                            طلب في الساعة الأخيرة
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>النشاط الأخير</CardTitle>
                        <CardDescription>
                            آخر التغييرات التي تمت على المحتوى
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Simple activity log list */}
                        <div className="space-y-4">
                            {[
                                { actor: "أدمن", action: "أضاف ترجمة جديدة", target: "كردي", time: "منذ ساعتين" },
                                { actor: "نظام", action: "تحديث قاعدة البيانات", target: "مزامنة GitHub", time: "منذ 4 ساعات" },
                                { actor: "أدمن", action: "عدل في التفسير", target: "تفسير السعدي - الفاتحة", time: "منذ 5 ساعات" },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{log.actor} {log.action}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {log.target}
                                        </p>
                                    </div>
                                    <div className="mr-auto font-medium text-xs text-muted-foreground">{log.time}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
