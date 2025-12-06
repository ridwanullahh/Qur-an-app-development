"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Tafsir (Commentary) Panel Component

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, Users, Scroll, MessageSquare } from "lucide-react"

interface TafsirPanelProps {
  surah: number
  verse: number
}

// Mock tafsir data
const TAFSIR_SOURCES = [
  { id: "ibn-kathir", name: "تفسير ابن كثير", author: "ابن كثير" },
  { id: "tabari", name: "تفسير الطبري", author: "الطبري" },
  { id: "qurtubi", name: "تفسير القرطبي", author: "القرطبي" },
  { id: "jalalayn", name: "تفسير الجلالين", author: "المحلي والسيوطي" },
  { id: "saadi", name: "تفسير السعدي", author: "السعدي" },
]

const mockTafsir = {
  text: `قوله تعالى: "ذلك الكتاب" أي هذا القرآن الذي أنزلناه على محمد صلى الله عليه وسلم، وهو الكتاب العظيم الذي لا يأتيه الباطل من بين يديه ولا من خلفه. "لا ريب فيه" أي لا شك فيه أنه من عند الله، ولا شك في حقيته وصدق ما فيه. "هدى للمتقين" أي هو إرشاد وبيان وضياء للذين يتقون الله بامتثال أوامره واجتناب نواهيه.`,
  source: "تفسير ابن كثير",
}

const mockAsbab = {
  text: `لم يرد في سبب نزول هذه الآية سبب خاص، وإنما هي من أوائل سورة البقرة التي نزلت في المدينة لبيان أصول الإيمان والهداية.`,
  references: ["صحيح البخاري", "تفسير ابن كثير"],
}

export default function TafsirPanel({ surah, verse }: TafsirPanelProps) {
  const [selectedTafsir, setSelectedTafsir] = useState("ibn-kathir")

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            التفسير والعلوم
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            سورة {surah} - آية {verse}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tafsir">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tafsir" className="gap-1 text-xs">
              <Scroll className="h-3 w-3" />
              التفسير
            </TabsTrigger>
            <TabsTrigger value="asbab" className="gap-1 text-xs">
              <MessageSquare className="h-3 w-3" />
              أسباب النزول
            </TabsTrigger>
            <TabsTrigger value="related" className="gap-1 text-xs">
              <Users className="h-3 w-3" />
              آيات متعلقة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tafsir" className="mt-4">
            <div className="space-y-4">
              <Select value={selectedTafsir} onValueChange={setSelectedTafsir}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر التفسير" />
                </SelectTrigger>
                <SelectContent>
                  {TAFSIR_SOURCES.map((source) => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed font-amiri">{mockTafsir.text}</p>
                  <p className="text-xs text-muted-foreground">المصدر: {mockTafsir.source}</p>
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="asbab" className="mt-4">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                <p className="text-sm leading-relaxed font-amiri">{mockAsbab.text}</p>
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-2">المراجع:</p>
                  <ul className="list-disc list-inside text-xs text-muted-foreground">
                    {mockAsbab.references.map((ref, idx) => (
                      <li key={idx}>{ref}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="related" className="mt-4">
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {[
                  { surah: 3, verse: 138, text: "هَٰذَا بَيَانٌ لِّلنَّاسِ وَهُدًى وَمَوْعِظَةٌ لِّلْمُتَّقِينَ" },
                  { surah: 16, verse: 102, text: "قُلْ نَزَّلَهُ رُوحُ الْقُدُسِ مِن رَّبِّكَ بِالْحَقِّ" },
                  { surah: 17, verse: 9, text: "إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ" },
                ].map((item, idx) => (
                  <Card key={idx} className="p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                    <p className="text-sm font-amiri mb-1">{item.text}</p>
                    <p className="text-xs text-muted-foreground">
                      سورة {item.surah} - آية {item.verse}
                    </p>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
