"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Admin Dashboard Layout

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Languages, BookOpen, Users, Settings, Database, MessageSquare, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        // Check auth
        fetch("/api/auth")
            .then(res => {
                if (res.ok) return res.json()
                throw new Error("Unauthorized")
            })
            .then(data => setUser(data.user))
            .catch(() => router.push("/login"))
    }, [router])

    const handleLogout = async () => {
        await fetch("/api/auth", {
            method: "POST",
            body: JSON.stringify({ action: "logout" })
        })
        router.push("/login")
    }

    const sidebarItems = [
        {
            title: "لوحة التحكم",
            href: "/admin",
            icon: LayoutDashboard,
        },
        {
            title: "الترجمات",
            href: "/admin/translations",
            icon: Languages,
        },
        {
            title: "التفاسير",
            href: "/admin/tafsir",
            icon: BookOpen,
        },
        {
            title: "علوم الكلمات",
            href: "/admin/word-sciences",
            icon: Database,
        },
        {
            title: "المستخدمين",
            href: "/admin/users",
            icon: Users,
        },
        {
            title: "الإعدادات",
            href: "/admin/settings",
            icon: Settings,
        },
    ]

    return (
        <div className="flex h-screen bg-muted/20" dir="rtl">
            {/* Admin Sidebar */}
            <aside className="w-64 border-l bg-card hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold font-amiri text-primary">لوحة الإدارة</h2>
                    <p className="text-sm text-muted-foreground">تطبيق القرآن الكريم</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3",
                                        isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.title}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {user?.name?.[0] || "A"}
                        </div>
                        <div className="text-sm">
                            <p className="font-medium">{user?.name || "Admin"}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[120px]">{user?.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        تسجيل الخروج
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
