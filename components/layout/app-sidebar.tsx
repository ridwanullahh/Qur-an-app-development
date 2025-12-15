"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// App Sidebar Component

import { useState } from "react"
import { ChevronLeft, ChevronRight, Book, Bookmark, Star, Layers, Search } from "lucide-react"
import { SearchDialog } from "./search-dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuran } from "@/contexts/quran-context"
import { SURAHS } from "@/lib/quran-data"
import { cn } from "@/lib/utils"

export default function AppSidebar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Keyboard shortcut for search
  useState(() => {
    if (typeof window === "undefined") return
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }) // Empty dependency to run once active

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex flex-col border-l border-border bg-sidebar transition-all duration-300",
          isCollapsed ? "w-16" : "w-72",
        )}
      >
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -left-3 top-20 z-10 h-6 w-6 rounded-full border border-border bg-card shadow-md"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>

        {/* Search Trigger */}
        <div className={cn("p-4 border-b border-border", isCollapsed && "px-2")}>
          <Button
            variant="outline"
            className={cn("w-full justify-start text-muted-foreground", isCollapsed && "justify-center px-0")}
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-4 w-4 shrink-0" />
            {!isCollapsed && (
              <>
                <span className="mr-2">بحث...</span>
                <kbd className="pointer-events-none mr-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </>
            )}
          </Button>
        </div>

        {isCollapsed ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <Button variant="ghost" size="icon" title="السور">
              <Book className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" title="الأجزاء">
              <Layers className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" title="العلامات">
              <Bookmark className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="surahs" className="flex flex-col h-full">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
              <TabsTrigger
                value="surahs"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                <Book className="h-4 w-4 ml-2" />
                السور
              </TabsTrigger>
              <TabsTrigger
                value="juz"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                <Layers className="h-4 w-4 ml-2" />
                الأجزاء
              </TabsTrigger>
              <TabsTrigger
                value="bookmarks"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                <Bookmark className="h-4 w-4 ml-2" />
                العلامات
              </TabsTrigger>
            </TabsList>

            <TabsContent value="surahs" className="flex-1 m-0">
              <ScrollArea className="h-[calc(100vh-14rem)]"> {/* Adjusted height for search bar */}
                <div className="p-2">
                  {SURAHS.map((surah) => (
                    <button
                      key={surah.number}
                      onClick={() => goToSurah(surah.number)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-right transition-colors",
                        currentSurah === surah.number ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                          currentSurah === surah.number
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {surah.number}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold arabic-text truncate">{surah.nameArabic}</p>
                        <p className="text-xs opacity-70">
                          {surah.nameEnglish} • {surah.versesCount} آيات
                        </p>
                      </div>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded",
                          surah.revelationType === "Meccan"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                        )}
                      >
                        {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}
                      </span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="juz" className="flex-1 m-0">
              <ScrollArea className="h-[calc(100vh-14rem)]">
                <div className="p-2 grid grid-cols-5 gap-2">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                    <button
                      key={juz}
                      onClick={() => goToJuz(juz)}
                      className="flex h-12 w-12 items-center justify-center rounded-lg border border-border hover:bg-muted hover:border-primary transition-colors"
                    >
                      <span className="text-lg font-bold">{juz}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="bookmarks" className="flex-1 m-0">
              <ScrollArea className="h-[calc(100vh-14rem)]">
                <div className="p-2">
                  {bookmarks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <Bookmark className="h-12 w-12 mb-2 opacity-50" />
                      <p>لا توجد علامات</p>
                      <p className="text-xs">اضغط على الآية لإضافة علامة</p>
                    </div>
                  ) : (
                    bookmarks.map((bookmark, index) => {
                      const surah = SURAHS.find((s) => s.number === bookmark.surah)
                      return (
                        <button
                          key={index}
                          onClick={() => goToVerse(bookmark.surah, bookmark.verse)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-right hover:bg-muted transition-colors"
                        >
                          <Star className="h-4 w-4 text-gold-accent" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{surah?.nameArabic}</p>
                            <p className="text-xs text-muted-foreground">آية {bookmark.verse}</p>
                          </div>
                        </button>
                      )
                    })
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </aside>
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  )
}
