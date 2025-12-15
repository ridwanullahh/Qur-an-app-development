// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Quran Page API - Returns verses for a specific Mushaf page

import { NextResponse } from "next/server"
import { getSDK } from "@/lib/sdk-instance"
import { ALL_VERSES } from "@/lib/quran-verses" // Fallback data

// Type for Verse from SDK/DB
interface VerseData {
    surahNumber: number
    verseNumber: number
    text: string // Uthmani text
    page: number
    juz: number
    hizb: number
    manzil: number
    ruku: number
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = searchParams.get("page")

        if (!page) {
            return NextResponse.json({ error: "Missing page parameter" }, { status: 400 })
        }

        const pageNum = parseInt(page, 10)
        if (pageNum < 1 || pageNum > 604) {
            return NextResponse.json({ error: "Invalid page number (1-604)" }, { status: 400 })
        }

        // 1. Try to fetch from GitHub DB SDK (Real Production Data)
        const sdk = getSDK()

        // Check if we have verses collection (implied schema)
        // We might need to cache this or index it better in a real DB
        // For GitHub DB, getting all verses for a page is efficient if organized by folders/files
        // But SDK `get` returns ALL items in collection usually.
        // Optimally, SDK should support filtering. 

        let pageVerses: VerseData[] = []

        try {
            // Attempt to get verses from DB
            // Assuming 'quran_uthmani' collection
            const allVerses = await sdk.get<VerseData>("quran_uthmani")
            pageVerses = allVerses.filter(v => v.page === pageNum)
        } catch (e) {
            // DB might be empty or not initialized
            console.warn("Could not fetch from GitHub DB, using local fallback if available")
        }

        // 2. Fallback to local data (for dev/initial setup)
        if (pageVerses.length === 0) {
            // Logic to get from ALL_VERSES
            // We need to convert the format slightly
            Object.values(ALL_VERSES).forEach((surahVerses) => {
                surahVerses.forEach((verse) => {
                    if (verse.page === pageNum) {
                        pageVerses.push({
                            surahNumber: verse.surah,
                            verseNumber: verse.verse,
                            text: verse.text,
                            page: verse.page,
                            juz: verse.juz,
                            hizb: verse.hizb,
                            manzil: 0,
                            ruku: 0
                        })
                    }
                })
            })
        }

        // Sort verses
        pageVerses.sort((a, b) => {
            if (a.surahNumber !== b.surahNumber) return a.surahNumber - b.surahNumber
            return a.verseNumber - b.verseNumber
        })

        if (pageVerses.length === 0) {
            // If still empty (e.g. page > available local data), 
            // we should return appropriate message or try to fetch from external API on server side
            // to populate our cache/DB?

            // For now, return empty to indicate no data found
            return NextResponse.json({ verses: [], message: "Page data not found locally or in DB" })
        }

        return NextResponse.json({ verses: pageVerses })

    } catch (error) {
        console.error("Page API Error:", error)
        return NextResponse.json({ error: "Failed to fetch page data" }, { status: 500 })
    }
}
