"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// App Header Component

import { useState } from "react"
import { Menu, Search, Settings, User, Moon, Sun, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQuran } from "@/contexts/quran-context"
import { useAuth } from "@/contexts/auth-context"
import { SURAHS } from "@/lib/quran-data"
import Link from "next/link"

export default function AppHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const { goToSurah, currentSurah, surahInfo } = useQuran()
  const { user, isAuthenticated, logout } = useAuth()

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const filteredSurahs = SURAHS.filter(
    (s) =>
      s.nameArabic.includes(searchQuery) ||
      s.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString() === searchQuery,
  )

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold arabic-text">القرآن الكريم</h1>
            </div>
          </Link>
        </div>

        {/* Current Surah Info */}
        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">سورة</span>
          <span className="font-bold arabic-text">{surahInfo?.nameArabic}</span>
          <span className="text-muted-foreground">({surahInfo?.nameEnglish})</span>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-2">
          {showSearch ? (
            <div className="relative">
              <Input
                type="text"
                placeholder="ابحث عن سورة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 md:w-64 text-right"
                autoFocus
                onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              />
              {searchQuery && filteredSurahs.length > 0 && (
                <div className="absolute top-full right-0 mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
                  {filteredSurahs.slice(0, 10).map((surah) => (
                    <button
                      key={surah.number}
                      onClick={() => {
                        goToSurah(surah.number)
                        setSearchQuery("")
                        setShowSearch(false)
                      }}
                      className="w-full px-4 py-2 text-right hover:bg-muted flex items-center justify-between"
                    >
                      <span className="text-xs text-muted-foreground">{surah.number}</span>
                      <span className="arabic-text">{surah.nameArabic}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
              <Search className="h-5 w-5" />
            </Button>
          )}

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem className="flex flex-col items-start">
                    <span className="font-medium">{user?.name || "User"}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">الملف الشخصي</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/progress">تقدم الحفظ</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                    تسجيل الخروج
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">تسجيل الدخول</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">إنشاء حساب</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
