// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Translations API Endpoint - Fetches translation data from GitHub DB

import { NextResponse } from "next/server"
import { getSDK } from "@/lib/sdk-instance"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const surah = searchParams.get("surah")
        const verse = searchParams.get("verse")
        const language = searchParams.get("language") || "en"
        const translator = searchParams.get("translator")

        if (!surah || !verse) {
            return NextResponse.json(
                { error: "Missing required parameters: surah and verse" },
                { status: 400 }
            )
        }

        const sdk = getSDK()
        const surahNum = parseInt(surah, 10)
        const verseNum = parseInt(verse, 10)

        // Fetch all translations that match the criteria
        const allTranslations = await sdk.get<{
            id: string
            surahNumber: number
            verseNumber: number
            language: string
            text: string
            translator: string
        }>("translations")

        let filteredTranslations = allTranslations.filter(
            (t) => t.surahNumber === surahNum && t.verseNumber === verseNum
        )

        // Filter by language if specified
        if (language) {
            const langFiltered = filteredTranslations.filter((t) => t.language === language)
            if (langFiltered.length > 0) {
                filteredTranslations = langFiltered
            }
        }

        // Filter by translator if specified
        if (translator) {
            const transFiltered = filteredTranslations.filter((t) => t.translator === translator)
            if (transFiltered.length > 0) {
                filteredTranslations = transFiltered
            }
        }

        // If no data found, return empty with message
        if (filteredTranslations.length === 0) {
            return NextResponse.json({
                translations: [],
                message: "No translation data available for this verse. Please add via admin panel.",
                availableLanguages: [],
                availableTranslators: [],
            })
        }

        // Get available languages and translators for this verse
        const availableLanguages = [...new Set(allTranslations
            .filter((t) => t.surahNumber === surahNum && t.verseNumber === verseNum)
            .map((t) => t.language))]

        const availableTranslators = [...new Set(allTranslations
            .filter((t) => t.surahNumber === surahNum && t.verseNumber === verseNum)
            .map((t) => t.translator))]

        return NextResponse.json({
            translations: filteredTranslations,
            availableLanguages,
            availableTranslators,
            surah: surahNum,
            verse: verseNum,
        })
    } catch (error) {
        console.error("Translations API Error:", error)
        return NextResponse.json(
            { error: "Failed to fetch translation data", translations: [] },
            { status: 500 }
        )
    }
}
