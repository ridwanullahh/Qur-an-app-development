// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Tafsir API Endpoint - Fetches tafsir data from GitHub DB

import { NextResponse } from "next/server"
import { getSDK } from "@/lib/sdk-instance"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const surah = searchParams.get("surah")
        const verse = searchParams.get("verse")
        const scholar = searchParams.get("scholar")
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

        // Fetch all tafsir data that matches the criteria
        const allTafsir = await sdk.get<{
            id: string
            surahNumber: number
            verseNumber: number
            language: string
            text: string
            scholar: string
        }>("tafseer")

        let filteredTafsir = allTafsir.filter(
            (t) => t.surahNumber === surahNum && t.verseNumber === verseNum
        )

        // Filter by language if specified
        if (language) {
            const langFiltered = filteredTafsir.filter((t) => t.language === language)
            if (langFiltered.length > 0) {
                filteredTafsir = langFiltered
            }
        }

        // Filter by scholar if specified
        if (scholar) {
            const scholarFiltered = filteredTafsir.filter((t) => t.scholar === scholar)
            if (scholarFiltered.length > 0) {
                filteredTafsir = scholarFiltered
            }
        }

        // If no data found, return default placeholder (empty until admin adds data)
        if (filteredTafsir.length === 0) {
            return NextResponse.json({
                tafsir: [],
                message: "No tafsir data available for this verse. Please add via admin panel.",
                availableScholars: [],
            })
        }

        // Get unique scholars for this verse
        const availableScholars = [...new Set(allTafsir
            .filter((t) => t.surahNumber === surahNum && t.verseNumber === verseNum)
            .map((t) => t.scholar))]

        return NextResponse.json({
            tafsir: filteredTafsir,
            availableScholars,
            surah: surahNum,
            verse: verseNum,
        })
    } catch (error) {
        console.error("Tafsir API Error:", error)
        return NextResponse.json(
            { error: "Failed to fetch tafsir data", tafsir: [] },
            { status: 500 }
        )
    }
}
