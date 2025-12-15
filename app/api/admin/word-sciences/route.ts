// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Admin Word Sciences API - CRUD Operations for Morphology, Transliteration, etc.

import { NextResponse } from "next/server"
import { getSDK } from "@/lib/sdk-instance"

// GET - List all word sciences data or filter
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const surah = searchParams.get("surah")
        const verse = searchParams.get("verse")
        const wordIndex = searchParams.get("wordIndex")
        const page = parseInt(searchParams.get("page") || "1", 10)
        const limit = parseInt(searchParams.get("limit") || "100", 10)

        const sdk = getSDK()

        // Fetch morphology data
        const allMorphology = await sdk.get<{
            id: string
            surahNumber: number
            verseNumber: number
            wordIndex: number
            arabicWord: string
            root: string
            lemma: string
            pos: string
            form?: string
            person?: string
            gender?: string
            number?: string
            pattern?: string
            translation?: string
            transliteration?: string
            createdAt?: string
            updatedAt?: string
        }>("morphology")

        let filtered = allMorphology

        // Apply filters
        if (surah) {
            filtered = filtered.filter((m) => m.surahNumber === parseInt(surah, 10))
        }
        if (verse) {
            filtered = filtered.filter((m) => m.verseNumber === parseInt(verse, 10))
        }
        if (wordIndex) {
            filtered = filtered.filter((m) => m.wordIndex === parseInt(wordIndex, 10))
        }

        // Sort by surah, verse, wordIndex
        filtered.sort((a, b) => {
            if (a.surahNumber !== b.surahNumber) return a.surahNumber - b.surahNumber
            if (a.verseNumber !== b.verseNumber) return a.verseNumber - b.verseNumber
            return a.wordIndex - b.wordIndex
        })

        // Pagination
        const total = filtered.length
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginated = filtered.slice(startIndex, endIndex)

        return NextResponse.json({
            wordSciences: paginated,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("Admin Word Sciences GET Error:", error)
        return NextResponse.json({ error: "Failed to fetch word sciences" }, { status: 500 })
    }
}

// POST - Create new word sciences entry
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            surahNumber,
            verseNumber,
            wordIndex,
            arabicWord,
            root,
            lemma,
            pos,
            form,
            person,
            gender,
            number,
            pattern,
            translation,
            transliteration,
        } = body

        if (!surahNumber || !verseNumber || wordIndex === undefined || !arabicWord) {
            return NextResponse.json(
                { error: "Missing required fields: surahNumber, verseNumber, wordIndex, arabicWord" },
                { status: 400 }
            )
        }

        const sdk = getSDK()
        const newEntry = await sdk.create("morphology", {
            surahNumber,
            verseNumber,
            wordIndex,
            arabicWord,
            root: root || "",
            lemma: lemma || "",
            pos: pos || "",
            form,
            person,
            gender,
            number,
            pattern,
            translation,
            transliteration,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })

        return NextResponse.json({ success: true, wordScience: newEntry }, { status: 201 })
    } catch (error) {
        console.error("Admin Word Sciences POST Error:", error)
        return NextResponse.json({ error: "Failed to create word sciences entry" }, { status: 500 })
    }
}

// PUT - Update existing word sciences entry
export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, ...updateData } = body

        if (!id) {
            return NextResponse.json({ error: "Missing required field: id" }, { status: 400 })
        }

        const sdk = getSDK()
        const updated = await sdk.update("morphology", id, {
            ...updateData,
            updatedAt: new Date().toISOString(),
        })

        return NextResponse.json({ success: true, wordScience: updated })
    } catch (error) {
        console.error("Admin Word Sciences PUT Error:", error)
        return NextResponse.json({ error: "Failed to update word sciences entry" }, { status: 500 })
    }
}

// DELETE - Delete word sciences entry
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Missing required parameter: id" }, { status: 400 })
        }

        const sdk = getSDK()
        await sdk.delete("morphology", id)

        return NextResponse.json({ success: true, message: "Word sciences entry deleted" })
    } catch (error) {
        console.error("Admin Word Sciences DELETE Error:", error)
        return NextResponse.json({ error: "Failed to delete word sciences entry" }, { status: 500 })
    }
}

// POST - Bulk import word sciences for a surah
export async function PATCH(request: Request) {
    try {
        const body = await request.json()
        const { entries } = body

        if (!entries || !Array.isArray(entries)) {
            return NextResponse.json({ error: "Missing required field: entries (array)" }, { status: 400 })
        }

        const sdk = getSDK()
        const results = []

        for (const entry of entries) {
            try {
                const created = await sdk.create("morphology", {
                    ...entry,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                })
                results.push({ success: true, entry: created })
            } catch (err) {
                results.push({ success: false, entry, error: String(err) })
            }
        }

        const successCount = results.filter((r) => r.success).length
        const failCount = results.filter((r) => !r.success).length

        return NextResponse.json({
            success: true,
            message: `Imported ${successCount} entries, ${failCount} failed`,
            results,
        })
    } catch (error) {
        console.error("Admin Word Sciences PATCH Error:", error)
        return NextResponse.json({ error: "Failed to bulk import" }, { status: 500 })
    }
}
