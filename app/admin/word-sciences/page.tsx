"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Word Sciences Management Page

import { useState, useEffect } from "react"
import { Search, Filter, MoreVertical, Pencil, Trash, FileText, Upload } from "lucide-react"

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

export default function WordSciencesPage() {
    const [wordsData, setWordsData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Function to simulate or fetch data
        // For now we'll set it to empty since we haven't seeded this specific view fully
        setLoading(false)
    }, [])

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-amiri">علوم الكلمات</h1>
                    <p className="text-muted-foreground">إدارة الصرف، الإعراب، والمعاني لكل كلمة</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Upload className="h-4 w-4" />
                        استيراد (Bulk Import)
                    </Button>
                    <Button className="gap-2">
                        <PlusIcon className="h-4 w-4" />
                        إضافة يدوية
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>قاعدة بيانات الكلمات</CardTitle>
                    <CardDescription>
                        تحتوي قاعدة البيانات على أكثر من 77,000 كلمة قرآنية
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="بحث عن كلمة (عربي أو إنجليزي)..."
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
                                    <TableHead className="text-right">الكلمة</TableHead>
                                    <TableHead className="text-right">الموقع (سورة:آية:كلمة)</TableHead>
                                    <TableHead className="text-right">الجذر</TableHead>
                                    <TableHead className="text-right">البيانات المتوفرة</TableHead>
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
                                ) : wordsData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText className="h-10 w-10 opacity-20" />
                                                <p>استخدم خاصية الاستيراد لملء قاعدة البيانات</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    wordsData.map((w: any) => (
                                        <TableRow key={w.id}>
                                            <TableCell className="font-amiri text-lg">{w.text}</TableCell>
                                            <TableCell>{w.location}</TableCell>
                                            <TableCell>{w.root}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    {w.hasMorphology && <Badge variant="outline">صرف</Badge>}
                                                    {w.hasTajweed && <Badge variant="outline">تجويد</Badge>}
                                                </div>
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

function PlusIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
