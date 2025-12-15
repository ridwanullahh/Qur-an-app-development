// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Audio API - Returns audio URLs for Quran recitations

import { NextResponse } from "next/server"

// Reciter configurations with audio CDN URLs
const RECITERS = {
    mishary: {
        id: "mishary",
        name: "مشاري العفاسي",
        nameEn: "Mishary Rashid Alafasy",
        style: "murattal",
        // Using Quran.com CDN format
        baseUrl: "https://verses.quran.com/Alafasy/mp3",
        format: (surah: number, verse: number) =>
            `${surah.toString().padStart(3, "0")}${verse.toString().padStart(3, "0")}.mp3`,
    },
    abdulbasit: {
        id: "abdulbasit",
        name: "عبد الباسط عبد الصمد",
        nameEn: "Abdul Basit Abdul Samad",
        style: "murattal",
        baseUrl: "https://verses.quran.com/AbdulSamad/mp3",
        format: (surah: number, verse: number) =>
            `${surah.toString().padStart(3, "0")}${verse.toString().padStart(3, "0")}.mp3`,
    },
    husary: {
        id: "husary",
        name: "محمود خليل الحصري",
        nameEn: "Mahmoud Khalil Al-Husary",
        style: "murattal",
        baseUrl: "https://verses.quran.com/Husary/mp3",
        format: (surah: number, verse: number) =>
            `${surah.toString().padStart(3, "0")}${verse.toString().padStart(3, "0")}.mp3`,
    },
    sudais: {
        id: "sudais",
        name: "عبد الرحمن السديس",
        nameEn: "Abdur-Rahman As-Sudais",
        style: "murattal",
        baseUrl: "https://verses.quran.com/Sudais/mp3",
        format: (surah: number, verse: number) =>
            `${surah.toString().padStart(3, "0")}${verse.toString().padStart(3, "0")}.mp3`,
    },
    maher: {
        id: "maher",
        name: "ماهر المعيقلي",
        nameEn: "Maher Al-Muaiqly",
        style: "murattal",
        baseUrl: "https://verses.quran.com/Muaiqly/mp3",
        format: (surah: number, verse: number) =>
            `${surah.toString().padStart(3, "0")}${verse.toString().padStart(3, "0")}.mp3`,
    },
    ghamdi: {
        id: "ghamdi",
        name: "سعد الغامدي",
        nameEn: "Saad Al-Ghamdi",
        style: "murattal",
        baseUrl: "https://verses.quran.com/Ghamadi/mp3",
        format: (surah: number, verse: number) =>
            `${surah.toString().padStart(3, "0")}${verse.toString().padStart(3, "0")}.mp3`,
    },
    shuraim: {
        id: "shuraim",
        name: "سعود الشريم",
        nameEn: "Saud Ash-Shuraim",
        style: "murattal",
        baseUrl: "https://verses.quran.com/Shuraym/mp3",
        format: (surah: number, verse: number) =>
            `${surah.toString().padStart(3, "0")}${verse.toString().padStart(3, "0")}.mp3`,
    },
    minshawi: {
        id: "minshawi",
        name: "محمد صديق المنشاوي",
        nameEn: "Muhammad Siddiq Al-Minshawi",
        style: "mujawwad",
        baseUrl: "https://verses.quran.com/Minshawy/mp3",
        format: (surah: number, verse: number) =>
            `${surah.toString().padStart(3, "0")}${verse.toString().padStart(3, "0")}.mp3`,
    },
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const surah = searchParams.get("surah")
        const verse = searchParams.get("verse")
        const reciter = searchParams.get("reciter") || "mishary"
        const type = searchParams.get("type") // "verse" or "list"

        // Return list of available reciters
        if (type === "list" || (!surah && !verse)) {
            return NextResponse.json({
                reciters: Object.values(RECITERS).map((r) => ({
                    id: r.id,
                    name: r.name,
                    nameEn: r.nameEn,
                    style: r.style,
                })),
            })
        }

        // Get verse audio URL
        if (!surah || !verse) {
            return NextResponse.json({ error: "Missing surah or verse parameter" }, { status: 400 })
        }

        const surahNum = parseInt(surah, 10)
        const verseNum = parseInt(verse, 10)

        if (surahNum < 1 || surahNum > 114) {
            return NextResponse.json({ error: "Invalid surah number (1-114)" }, { status: 400 })
        }

        const reciterConfig = RECITERS[reciter as keyof typeof RECITERS]
        if (!reciterConfig) {
            return NextResponse.json({ error: "Invalid reciter" }, { status: 400 })
        }

        const audioUrl = `${reciterConfig.baseUrl}/${reciterConfig.format(surahNum, verseNum)}`

        return NextResponse.json({
            audioUrl,
            reciter: {
                id: reciterConfig.id,
                name: reciterConfig.name,
                nameEn: reciterConfig.nameEn,
            },
            surah: surahNum,
            verse: verseNum,
        })
    } catch (error) {
        console.error("Audio API Error:", error)
        return NextResponse.json({ error: "Failed to get audio URL" }, { status: 500 })
    }
}
