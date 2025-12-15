// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Memorization Progress API - Track user's Hifz progress

import { NextResponse } from "next/server"
import { getSDK } from "@/lib/sdk-instance"

interface MemorizationProgress {
    id: string
    userId: string
    surahNumber: number
    verseNumber: number
    status: "new" | "learning" | "review" | "memorized"
    easeFactor: number // SM-2 algorithm
    interval: number // days until next review
    repetitions: number
    lastReview: string
    nextReview: string
    createdAt: string
    updatedAt: string
}

// GET - Get user's memorization progress
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId") || "default"
        const surah = searchParams.get("surah")
        const status = searchParams.get("status")
        const dueOnly = searchParams.get("dueOnly") === "true"

        const sdk = getSDK()
        const allProgress = await sdk.get<MemorizationProgress>("memorization_progress")

        let filtered = allProgress.filter((p) => p.userId === userId)

        // Filter by surah
        if (surah) {
            filtered = filtered.filter((p) => p.surahNumber === parseInt(surah, 10))
        }

        // Filter by status
        if (status) {
            filtered = filtered.filter((p) => p.status === status)
        }

        // Get only due items (for review)
        if (dueOnly) {
            const now = new Date().toISOString()
            filtered = filtered.filter((p) => p.nextReview <= now && p.status !== "new")
        }

        // Calculate statistics
        const stats = {
            totalMemorized: allProgress.filter((p) => p.userId === userId && p.status === "memorized").length,
            totalLearning: allProgress.filter((p) => p.userId === userId && p.status === "learning").length,
            totalReview: allProgress.filter((p) => p.userId === userId && p.status === "review").length,
            dueForReview: allProgress.filter((p) => {
                if (p.userId !== userId || p.status === "new") return false
                return p.nextReview <= new Date().toISOString()
            }).length,
        }

        // Group by surah for overview
        const bySurah: Record<number, { total: number; memorized: number; learning: number }> = {}
        filtered.forEach((p) => {
            if (!bySurah[p.surahNumber]) {
                bySurah[p.surahNumber] = { total: 0, memorized: 0, learning: 0 }
            }
            bySurah[p.surahNumber].total++
            if (p.status === "memorized") bySurah[p.surahNumber].memorized++
            if (p.status === "learning") bySurah[p.surahNumber].learning++
        })

        return NextResponse.json({
            progress: filtered,
            stats,
            bySurah,
        })
    } catch (error) {
        console.error("Memorization GET Error:", error)
        return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
    }
}

// POST - Record memorization or review result
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { userId = "default", surahNumber, verseNumber, quality } = body

        // Quality: 0-5 (SM-2 algorithm)
        // 0-2: Again (failed)
        // 3: Hard
        // 4: Good
        // 5: Easy

        if (!surahNumber || !verseNumber || quality === undefined) {
            return NextResponse.json(
                { error: "Missing required fields: surahNumber, verseNumber, quality" },
                { status: 400 }
            )
        }

        const sdk = getSDK()
        const allProgress = await sdk.get<MemorizationProgress>("memorization_progress")

        // Find existing progress for this verse
        const existing = allProgress.find(
            (p) => p.userId === userId && p.surahNumber === surahNumber && p.verseNumber === verseNumber
        )

        const now = new Date()
        let easeFactor = existing?.easeFactor || 2.5
        let interval = existing?.interval || 0
        let repetitions = existing?.repetitions || 0

        // SM-2 Algorithm
        if (quality < 3) {
            // Failed - reset
            repetitions = 0
            interval = 1
        } else {
            // Success
            repetitions++
            if (repetitions === 1) {
                interval = 1
            } else if (repetitions === 2) {
                interval = 6
            } else {
                interval = Math.round(interval * easeFactor)
            }
        }

        // Update ease factor
        easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))

        const nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000).toISOString()

        // Determine status
        let status: MemorizationProgress["status"] = "learning"
        if (repetitions >= 5 && easeFactor > 2.0) {
            status = "memorized"
        } else if (repetitions >= 1) {
            status = "review"
        }

        if (existing) {
            // Update existing
            const updated = await sdk.update("memorization_progress", existing.id, {
                easeFactor,
                interval,
                repetitions,
                status,
                lastReview: now.toISOString(),
                nextReview,
                updatedAt: now.toISOString(),
            })
            return NextResponse.json({ success: true, progress: updated })
        } else {
            // Create new
            const created = await sdk.create("memorization_progress", {
                userId,
                surahNumber,
                verseNumber,
                status: "learning",
                easeFactor,
                interval,
                repetitions,
                lastReview: now.toISOString(),
                nextReview,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
            })
            return NextResponse.json({ success: true, progress: created }, { status: 201 })
        }
    } catch (error) {
        console.error("Memorization POST Error:", error)
        return NextResponse.json({ error: "Failed to record progress" }, { status: 500 })
    }
}

// DELETE - Reset progress for a verse or surah
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId") || "default"
        const surah = searchParams.get("surah")
        const verse = searchParams.get("verse")

        if (!surah) {
            return NextResponse.json({ error: "Missing surah parameter" }, { status: 400 })
        }

        const sdk = getSDK()
        const allProgress = await sdk.get<MemorizationProgress>("memorization_progress")

        const toDelete = allProgress.filter((p) => {
            if (p.userId !== userId) return false
            if (p.surahNumber !== parseInt(surah, 10)) return false
            if (verse && p.verseNumber !== parseInt(verse, 10)) return false
            return true
        })

        for (const item of toDelete) {
            await sdk.delete("memorization_progress", item.id)
        }

        return NextResponse.json({
            success: true,
            message: `Deleted ${toDelete.length} progress entries`,
        })
    } catch (error) {
        console.error("Memorization DELETE Error:", error)
        return NextResponse.json({ error: "Failed to reset progress" }, { status: 500 })
    }
}
