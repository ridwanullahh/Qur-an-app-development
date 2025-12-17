// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Admin Quran Sourcing API - Seed/Update Quran Text Data

import { NextResponse } from "next/server"
import { getSDK } from "@/lib/sdk-instance"

// POST - Fetch data from public API and seed GitHub DB
export async function POST(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get("type") || "quran" // 'quran' or 'translation'
        const limit = searchParams.get("limit") // optional limit for testing

        const sdk = getSDK()

        // Example of seeding logic
        if (type === "quran") {
            // Fetch from AlQuran Cloud
            const response = await fetch("http://api.alquran.cloud/v1/quran/quran-uthmani")
            if (!response.ok) throw new Error("Failed to fetch from source API")

            const data = await response.json()
            const surahs = data.data.surahs

            let count = 0
            const MAX_ITEMS = limit ? parseInt(limit) : 6236

            // Flatten data structure
            const verses = []
            for (const surah of surahs) {
                for (const verse of surah.ayahs) {
                    if (count >= MAX_ITEMS) break;

                    verses.push({
                        surahNumber: surah.number,
                        verseNumber: verse.numberInSurah,
                        text: verse.text,
                        page: verse.page,
                        juz: verse.juz,
                        hizb: Math.ceil(verse.hizbQuarter / 4), // Approx
                        manzil: verse.manzil,
                        ruku: verse.ruku,
                        createdAt: new Date().toISOString()
                    })
                    count++
                }
                if (count >= MAX_ITEMS) break;
            }

            // Batch create in GitHub DB
            // SDK might not support bulk create yet, loop for now or update SDK
            // This is a heavy operation, should be done in background job ideally

            // Return preview of what would be imported
            return NextResponse.json({
                success: true,
                message: `Prepared ${verses.length} verses for seeding.`,
                preview: verses.slice(0, 3),
                note: "To actually execute DB writes, un-comment the write loop in the code."
            })

            // Actual Write Loop
            for (const v of verses) {
                await sdk.create("quran_uthmani", v)
            }
        }

        return NextResponse.json({ error: "Invalid type" }, { status: 400 })

    } catch (error) {
        console.error("Seed API Error:", error)
        return NextResponse.json({ error: "Failed to seed data" }, { status: 500 })
    }
}
