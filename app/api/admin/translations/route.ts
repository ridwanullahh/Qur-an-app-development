// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Admin Translations API - CRUD Operations

import { NextResponse } from "next/server"
import { getSDK } from "@/lib/sdk-instance"

// GET - List all translations or filter by surah/verse
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const surah = searchParams.get("surah")
        const verse = searchParams.get("verse")
        const language = searchParams.get("language")
        const page = parseInt(searchParams.get("page") || "1", 10)
        const limit = parseInt(searchParams.get("limit") || "50", 10)

        const sdk = getSDK()
        const allTranslations = await sdk.get<{
            id: string
            surahNumber: number
            verseNumber: number
            language: string
            text: string
            translator: string
            createdAt?: string
            updatedAt?: string
        }>("translations")

        let filtered = allTranslations

        // Apply filters
        if (surah) {
            filtered = filtered.filter((t) => t.surahNumber === parseInt(surah, 10))
        }
        if (verse) {
            filtered = filtered.filter((t) => t.verseNumber === parseInt(verse, 10))
        }
        if (language) {
            filtered = filtered.filter((t) => t.language === language)
        }

        // Pagination
        const total = filtered.length
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginated = filtered.slice(startIndex, endIndex)

        return NextResponse.json({
            translations: paginated,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("Admin Translations GET Error:", error)
        return NextResponse.json({ error: "Failed to fetch translations" }, { status: 500 })
    }
}

// POST - Create new translation
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { surahNumber, verseNumber, language, text, translator } = body

        if (!surahNumber || !verseNumber || !language || !text || !translator) {
            return NextResponse.json(
                { error: "Missing required fields: surahNumber, verseNumber, language, text, translator" },
                { status: 400 }
            )
        }

        const sdk = getSDK()
        const newTranslation = await sdk.create("translations", {
            surahNumber,
            verseNumber,
            language,
            text,
            translator,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })

        return NextResponse.json({ success: true, translation: newTranslation }, { status: 201 })
    } catch (error) {
        console.error("Admin Translations POST Error:", error)
        return NextResponse.json({ error: "Failed to create translation" }, { status: 500 })
    }
}

// PUT - Update existing translation
export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, surahNumber, verseNumber, language, text, translator } = body

        if (!id) {
            return NextResponse.json({ error: "Missing required field: id" }, { status: 400 })
        }

        const sdk = getSDK()
        const updated = await sdk.update("translations", id, {
            ...(surahNumber && { surahNumber }),
            ...(verseNumber && { verseNumber }),
            ...(language && { language }),
            ...(text && { text }),
            ...(translator && { translator }),
            updatedAt: new Date().toISOString(),
        })

        return NextResponse.json({ success: true, translation: updated })
    } catch (error) {
        console.error("Admin Translations PUT Error:", error)
        return NextResponse.json({ error: "Failed to update translation" }, { status: 500 })
    }
}

// DELETE - Delete translation
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "Missing required parameter: id" }, { status: 400 })
        }

        const sdk = getSDK()
        await sdk.delete("translations", id)

        return NextResponse.json({ success: true, message: "Translation deleted" })
    } catch (error) {
        console.error("Admin Translations DELETE Error:", error)
        return NextResponse.json({ error: "Failed to delete translation" }, { status: 500 })
    }
}
