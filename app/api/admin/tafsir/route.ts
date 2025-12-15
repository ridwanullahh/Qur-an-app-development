// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Admin Tafsir API - CRUD Operations

import { NextResponse } from "next/server"
import { getSDK } from "@/lib/sdk-instance"

// GET - List all tafsir or filter by surah/verse/scholar
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const surah = searchParams.get("surah")
        const verse = searchParams.get("verse")
        const scholar = searchParams.get("scholar")
        const language = searchParams.get("language")
        const page = parseInt(searchParams.get("page") || "1", 10)
        const limit = parseInt(searchParams.get("limit") || "50", 10)

        const sdk = getSDK()
        const allTafsir = await sdk.get<{
            id: string
            surahNumber: number
            verseNumber: number
            language: string
            text: string
            scholar: string
            createdAt?: string
            updatedAt?: string
        }>("tafseer")

        let filtered = allTafsir

        // Apply filters
        if (surah) {
            filtered = filtered.filter((t) => t.surahNumber === parseInt(surah, 10))
        }
        if (verse) {
            filtered = filtered.filter((t) => t.verseNumber === parseInt(verse, 10))
        }
        if (scholar) {
            filtered = filtered.filter((t) => t.scholar === scholar)
        }
        if (language) {
            filtered = filtered.filter((t) => t.language === language)
        }

        // Pagination
        const total = filtered.length
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginated = filtered.slice(startIndex, endIndex)

        // Get unique scholars for the filter dropdown
        const scholars = [...new Set(allTafsir.map((t) => t.scholar))]

        return NextResponse.json({
            tafsir: paginated,
            scholars,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("Admin Tafsir GET Error:", error)
        return NextResponse.json({ error: "Failed to fetch tafsir" }, { status: 500 })
    }
}

// POST - Create new tafsir entry
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { surahNumber, verseNumber, language, text, scholar } = body

        if (!surahNumber || !verseNumber || !language || !text || !scholar) {
            return NextResponse.json(
                { error: "Missing required fields: surahNumber, verseNumber, language, text, scholar" },
                { status: 400 }
            )
        }

        const sdk = getSDK()
        const newTafsir = await sdk.create("tafseer", {
            surahNumber,
            verseNumber,
            language,
            text,
            scholar,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })

        return NextResponse.json({ success: true, tafsir: newTafsir }, { status: 201 })
    } catch (error) {
        console.error("Admin Tafsir POST Error:", error)
        return NextResponse.json({ error: "Failed to create tafsir" }, { status: 500 })
    }
}

// PUT - Update existing tafsir
export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, surahNumber, verseNumber, language, text, scholar } = body

        if (!id) {
            return NextResponse.json({ error: "Missing required field: id" }, { status: 400 })
        }

        const sdk = getSDK()
        const updated = await sdk.update("tafseer", id, {
            ...(surahNumber && { surahNumber }),
            ...(verseNumber && { verseNumber }),
            ...(language && { language }),
            ...(text && { text }),
            ...(scholar && { scholar }),
            updatedAt: new Date().toISOString(),
        })

        return NextResponse.json({ success: true, tafsir: updated })
    } catch (error) {
        console.error("Admin Tafsir PUT Error:", error)
        return NextResponse.json({ error: "Failed to update tafsir" }, { status: 500 })
    }
}

// DELETE - Delete tafsir entry
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Missing required parameter: id" }, { status: 400 })
        }

        const sdk = getSDK()
        await sdk.delete("tafseer", id)

        return NextResponse.json({ success: true, message: "Tafsir deleted" })
    } catch (error) {
        console.error("Admin Tafsir DELETE Error:", error)
        return NextResponse.json({ error: "Failed to delete tafsir" }, { status: 500 })
    }
}
