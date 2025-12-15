"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Tafsir Management Page

import { useState, useEffect } from "react"
import { Plus, Search, Filter, MoreVertical, Pencil, Trash, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function TafsirPage() {
    const [tafsirData, setTafsirData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/tafsir')
                const data = await res.json()
                if (data.tafsir) {
                    setTafsirData(data.tafsir)
                }
            } catch (error) {
                console.error("Failed to fetch tafsir", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-amiri">إدارة التفاسير</h1>
                    <p className="text-muted-foreground">إضافة وتعديل تفاسير القرآن الكريم</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    إضافة تفسير جديد
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>قائمة التفاسير</CardTitle>
                    <CardDescription>
                        عرض وإدارة محتوى التفاسير (ابن كثير، الطبري، إلخ)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="بحث في التفاسير..."
                                className="pr-9"
                            />
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            تصفية
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-right">المفسر (الكتاب)</TableHead>
                                    <TableHead className="text-right">اللغة</TableHead>
                                    <TableHead className="text-right">السورة / الآية</TableHead>
                                    <TableHead className="text-right">الحالة</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            جاري التحميل...
                                        </TableCell>
                                    </TableRow>
                                ) : tafsirData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            لا توجد تفاسير مضافة بعد.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tafsirData.map((t: any) => (
                                        <TableRow key={t.id}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                {t.scholar}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{t.language}</Badge>
                                            </TableCell>
                                            <TableCell>{t.surah}:{t.verse}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-green-100 text-green-700">منشور</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                            <span className="sr-only">تعديل</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Pencil className="ml-2 h-4 w-4" />
                                                            تعديل
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                                            <Trash className="ml-2 h-4 w-4" />
                                                            حذف
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
