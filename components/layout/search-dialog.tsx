"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Search Dialog - Global Command Palette

import * as React from "react"
import { Book, FileText, Search, Calculator } from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { SURAHS } from "@/lib/quran-data"
import { useQuran } from "@/contexts/quran-context"

interface SearchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
    const { goToSurah, goToPage, goToJuz } = useQuran()

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput placeholder="ابحث عن سورة، صفحة، أو جزء..." className="font-amiri text-right" dir="rtl" />
            <CommandList className="font-amiri text-right" dir="rtl">
                <CommandEmpty>لم يتم العثور على نتائج.</CommandEmpty>

                <CommandGroup heading="السور">
                    {SURAHS.map((surah) => (
                        <CommandItem
                            key={surah.number}
                            onSelect={() => {
                                goToSurah(surah.number)
                                onOpenChange(false)
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Book className="h-4 w-4 ml-2" />
                            <span>{surah.number}. {surah.nameArabic}</span>
                            <span className="text-muted-foreground text-xs mr-auto">{surah.nameEnglish}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandGroup heading="تنقل سريع">
                    {/* Pages - Limited to first few for demo or special markers logic */}
                    <CommandItem onSelect={() => { goToPage(1); onOpenChange(false) }}>
                        <FileText className="h-4 w-4 ml-2" />
                        <span>الصفحة 1 (الفاتحة)</span>
                    </CommandItem>
                    <CommandItem onSelect={() => { goToPage(2); onOpenChange(false) }}>
                        <FileText className="h-4 w-4 ml-2" />
                        <span>الصفحة 2 (بداية البقرة)</span>
                    </CommandItem>
                    <CommandItem onSelect={() => { goToPage(293); onOpenChange(false) }}>
                        <FileText className="h-4 w-4 ml-2" />
                        <span>الصفحة 293 (بداية الكهف)</span>
                    </CommandItem>
                </CommandGroup>

                <CommandGroup heading="الأجزاء">
                    {[1, 15, 30].map(juz => (
                        <CommandItem key={juz} onSelect={() => { goToJuz(juz); onOpenChange(false) }}>
                            <Calculator className="h-4 w-4 ml-2" />
                            <span>الجزء {juz}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
