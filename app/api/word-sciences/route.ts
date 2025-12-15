// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Word Sciences API Endpoint - Fetches morphology, transliteration, and word-level data

import { NextResponse } from "next/server"
import { getSDK } from "@/lib/sdk-instance"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const surah = searchParams.get("surah")
        const verse = searchParams.get("verse")
        const wordIndex = searchParams.get("wordIndex")
        const language = searchParams.get("language") || "ar"

        if (!surah || !verse) {
            return NextResponse.json(
                { error: "Missing required parameters: surah and verse" },
                { status: 400 }
            )
        }

        const sdk = getSDK()
        const surahNum = parseInt(surah, 10)
        const verseNum = parseInt(verse, 10)
        const wordIdx = wordIndex ? parseInt(wordIndex, 10) : null

        // Fetch morphology data
        const allMorphology = await sdk.get<{
            id: string
            surahNumber: number
            verseNumber: number
            wordIndex: number
            root: string
            lemma: string
            pos: string
            form?: string
            person?: string
            gender?: string
            number?: string
            pattern?: string
        }>("morphology")

        // Fetch transliterations
        const allTransliterations = await sdk.get<{
            id: string
            surahNumber: number
            verseNumber: number
            wordIndex: number
            text: string
        }>("transliterations")

        // Filter morphology for this verse
        let morphologyData = allMorphology.filter(
            (m) => m.surahNumber === surahNum && m.verseNumber === verseNum
        )

        // Filter transliterations for this verse
        let transliterationData = allTransliterations.filter(
            (t) => t.surahNumber === surahNum && t.verseNumber === verseNum
        )

        // If wordIndex specified, filter to that specific word
        if (wordIdx !== null) {
            morphologyData = morphologyData.filter((m) => m.wordIndex === wordIdx)
            transliterationData = transliterationData.filter((t) => t.wordIndex === wordIdx)
        }

        // Build response combining all word sciences
        const wordSciences = morphologyData.map((morph) => {
            const translit = transliterationData.find((t) => t.wordIndex === morph.wordIndex)
            return {
                wordIndex: morph.wordIndex,
                morphology: {
                    root: morph.root,
                    lemma: morph.lemma,
                    partOfSpeech: morph.pos,
                    form: morph.form,
                    person: morph.person,
                    gender: morph.gender,
                    number: morph.number,
                    pattern: morph.pattern,
                },
                transliteration: translit?.text || null,
            }
        })

        // If no data found, return empty with message
        if (wordSciences.length === 0) {
            return NextResponse.json({
                wordSciences: [],
                message: "No word sciences data available for this verse. Please add via admin panel.",
                surah: surahNum,
                verse: verseNum,
            })
        }

        return NextResponse.json({
            wordSciences,
            surah: surahNum,
            verse: verseNum,
            wordIndex: wordIdx,
        })
    } catch (error) {
        console.error("Word Sciences API Error:", error)
        return NextResponse.json(
            { error: "Failed to fetch word sciences data", wordSciences: [] },
            { status: 500 }
        )
    }
}
