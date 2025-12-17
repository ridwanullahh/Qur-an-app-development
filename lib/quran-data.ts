// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Complete Quran Data - Surah Information

export interface Surah {
  number: number
  name: string
  nameArabic: string
  nameEnglish: string
  revelationType: "Meccan" | "Medinan"
  versesCount: number
  rukuCount: number
  sajdaCount: number
  juzStart: number
  pageStart: number
}

export const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"

// Check if surah has Bismillah (all except At-Tawbah)
export function hasBismillah(surahNumber: number): boolean {
  return surahNumber !== 9 && surahNumber !== 1 // Fatiha has it as verse 1
}

// Convert number to Arabic numerals
export function toArabicNumeral(num: number): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]
  return num
    .toString()
    .split("")
    .map((d) => arabicNumerals[Number.parseInt(d)])
    .join("")
}

// Juz information
export const JUZ_INFO = [
  { number: 1, name: "الم", startSurah: 1, startVerse: 1, endSurah: 2, endVerse: 141, pageStart: 1 },
  { number: 2, name: "سيقول", startSurah: 2, startVerse: 142, endSurah: 2, endVerse: 252, pageStart: 22 },
  { number: 3, name: "تلك الرسل", startSurah: 2, startVerse: 253, endSurah: 3, endVerse: 92, pageStart: 42 },
  { number: 4, name: "لن تنالوا", startSurah: 3, startVerse: 93, endSurah: 4, endVerse: 23, pageStart: 62 },
  { number: 5, name: "والمحصنات", startSurah: 4, startVerse: 24, endSurah: 4, endVerse: 147, pageStart: 82 },
  { number: 6, name: "لا يحب الله", startSurah: 4, startVerse: 148, endSurah: 5, endVerse: 81, pageStart: 102 },
  { number: 7, name: "وإذا سمعوا", startSurah: 5, startVerse: 82, endSurah: 6, endVerse: 110, pageStart: 121 },
  { number: 8, name: "ولو أننا", startSurah: 6, startVerse: 111, endSurah: 7, endVerse: 87, pageStart: 142 },
  { number: 9, name: "قال الملأ", startSurah: 7, startVerse: 88, endSurah: 8, endVerse: 40, pageStart: 162 },
  { number: 10, name: "واعلموا", startSurah: 8, startVerse: 41, endSurah: 9, endVerse: 92, pageStart: 182 },
  { number: 11, name: "يعتذرون", startSurah: 9, startVerse: 93, endSurah: 11, endVerse: 5, pageStart: 201 },
  { number: 12, name: "وما من دابة", startSurah: 11, startVerse: 6, endSurah: 12, endVerse: 52, pageStart: 222 },
  { number: 13, name: "وما أبرئ", startSurah: 12, startVerse: 53, endSurah: 14, endVerse: 52, pageStart: 242 },
  { number: 14, name: "ربما", startSurah: 15, startVerse: 1, endSurah: 16, endVerse: 128, pageStart: 262 },
  { number: 15, name: "سبحان الذي", startSurah: 17, startVerse: 1, endSurah: 18, endVerse: 74, pageStart: 282 },
  { number: 16, name: "قال ألم", startSurah: 18, startVerse: 75, endSurah: 20, endVerse: 135, pageStart: 302 },
  { number: 17, name: "اقترب للناس", startSurah: 21, startVerse: 1, endSurah: 22, endVerse: 78, pageStart: 322 },
  { number: 18, name: "قد أفلح", startSurah: 23, startVerse: 1, endSurah: 25, endVerse: 20, pageStart: 342 },
  { number: 19, name: "وقال الذين", startSurah: 25, startVerse: 21, endSurah: 27, endVerse: 55, pageStart: 362 },
  { number: 20, name: "أمن خلق", startSurah: 27, startVerse: 56, endSurah: 29, endVerse: 45, pageStart: 382 },
  { number: 21, name: "اتل ما أوحي", startSurah: 29, startVerse: 46, endSurah: 33, endVerse: 30, pageStart: 402 },
  { number: 22, name: "ومن يقنت", startSurah: 33, startVerse: 31, endSurah: 36, endVerse: 27, pageStart: 422 },
  { number: 23, name: "وما لي", startSurah: 36, startVerse: 28, endSurah: 39, endVerse: 31, pageStart: 442 },
  { number: 24, name: "فمن أظلم", startSurah: 39, startVerse: 32, endSurah: 41, endVerse: 46, pageStart: 462 },
  { number: 25, name: "إليه يرد", startSurah: 41, startVerse: 47, endSurah: 45, endVerse: 37, pageStart: 482 },
  { number: 26, name: "حم", startSurah: 46, startVerse: 1, endSurah: 51, endVerse: 30, pageStart: 502 },
  { number: 27, name: "قال فما خطبكم", startSurah: 51, startVerse: 31, endSurah: 57, endVerse: 29, pageStart: 522 },
  { number: 28, name: "قد سمع", startSurah: 58, startVerse: 1, endSurah: 66, endVerse: 12, pageStart: 542 },
  { number: 29, name: "تبارك", startSurah: 67, startVerse: 1, endSurah: 77, endVerse: 50, pageStart: 562 },
  { number: 30, name: "عم", startSurah: 78, startVerse: 1, endSurah: 114, endVerse: 6, pageStart: 582 },
]

export const SURAHS: Surah[] = [
  { number: 1, name: "الفاتحة", nameArabic: "الفاتحة", nameEnglish: "Al-Fatiha", revelationType: "Meccan", versesCount: 7, rukuCount: 1, sajdaCount: 0, juzStart: 1, pageStart: 1 },
  { number: 2, name: "البقرة", nameArabic: "البقرة", nameEnglish: "Al-Baqarah", revelationType: "Medinan", versesCount: 286, rukuCount: 40, sajdaCount: 0, juzStart: 1, pageStart: 2 },
  { number: 3, name: "آل عمران", nameArabic: "آل عمران", nameEnglish: "Al-Imran", revelationType: "Medinan", versesCount: 200, rukuCount: 20, sajdaCount: 0, juzStart: 3, pageStart: 50 },
  { number: 4, name: "النساء", nameArabic: "النساء", nameEnglish: "An-Nisa", revelationType: "Medinan", versesCount: 176, rukuCount: 24, sajdaCount: 0, juzStart: 4, pageStart: 77 },
  { number: 5, name: "المائدة", nameArabic: "المائدة", nameEnglish: "Al-Ma'idah", revelationType: "Medinan", versesCount: 120, rukuCount: 16, sajdaCount: 0, juzStart: 6, pageStart: 106 },
  { number: 6, name: "الأنعام", nameArabic: "الأنعام", nameEnglish: "Al-An'am", revelationType: "Meccan", versesCount: 165, rukuCount: 20, sajdaCount: 0, juzStart: 7, pageStart: 128 },
  { number: 7, name: "الأعراف", nameArabic: "الأعراف", nameEnglish: "Al-A'raf", revelationType: "Meccan", versesCount: 206, rukuCount: 24, sajdaCount: 1, juzStart: 8, pageStart: 151 },
  { number: 8, name: "الأنفال", nameArabic: "الأنفال", nameEnglish: "Al-Anfal", revelationType: "Medinan", versesCount: 75, rukuCount: 10, sajdaCount: 0, juzStart: 9, pageStart: 177 },
  { number: 9, name: "التوبة", nameArabic: "التوبة", nameEnglish: "At-Tawbah", revelationType: "Medinan", versesCount: 129, rukuCount: 16, sajdaCount: 0, juzStart: 10, pageStart: 187 },
  { number: 10, name: "يونس", nameArabic: "يونس", nameEnglish: "Yunus", revelationType: "Meccan", versesCount: 109, rukuCount: 11, sajdaCount: 0, juzStart: 11, pageStart: 208 },
  { number: 11, name: "هود", nameArabic: "هود", nameEnglish: "Hud", revelationType: "Meccan", versesCount: 123, rukuCount: 10, sajdaCount: 0, juzStart: 11, pageStart: 221 },
  { number: 12, name: "يوسف", nameArabic: "يوسف", nameEnglish: "Yusuf", revelationType: "Meccan", versesCount: 111, rukuCount: 12, sajdaCount: 0, juzStart: 12, pageStart: 235 },
  { number: 13, name: "الرعد", nameArabic: "الرعد", nameEnglish: "Ar-Ra'd", revelationType: "Medinan", versesCount: 43, rukuCount: 6, sajdaCount: 1, juzStart: 13, pageStart: 249 },
  { number: 14, name: "إبراهيم", nameArabic: "إبراهيم", nameEnglish: "Ibrahim", revelationType: "Meccan", versesCount: 52, rukuCount: 7, sajdaCount: 0, juzStart: 13, pageStart: 255 },
  { number: 15, name: "الحجر", nameArabic: "الحجر", nameEnglish: "Al-Hijr", revelationType: "Meccan", versesCount: 99, rukuCount: 6, sajdaCount: 0, juzStart: 14, pageStart: 262 },
  { number: 16, name: "النحل", nameArabic: "النحل", nameEnglish: "An-Nahl", revelationType: "Meccan", versesCount: 128, rukuCount: 16, sajdaCount: 1, juzStart: 14, pageStart: 267 },
  { number: 17, name: "الإسراء", nameArabic: "الإسراء", nameEnglish: "Al-Isra", revelationType: "Meccan", versesCount: 111, rukuCount: 12, sajdaCount: 1, juzStart: 15, pageStart: 282 },
  { number: 18, name: "الكهف", nameArabic: "الكهف", nameEnglish: "Al-Kahf", revelationType: "Meccan", versesCount: 110, rukuCount: 12, sajdaCount: 0, juzStart: 15, pageStart: 293 },
  { number: 19, name: "مريم", nameArabic: "مريم", nameEnglish: "Maryam", revelationType: "Meccan", versesCount: 98, rukuCount: 6, sajdaCount: 1, juzStart: 16, pageStart: 305 },
  { number: 20, name: "طه", nameArabic: "طه", nameEnglish: "Ta-Ha", revelationType: "Meccan", versesCount: 135, rukuCount: 8, sajdaCount: 0, juzStart: 16, pageStart: 312 },
  { number: 21, name: "الأنبياء", nameArabic: "الأنبياء", nameEnglish: "Al-Anbiya", revelationType: "Meccan", versesCount: 112, rukuCount: 7, sajdaCount: 0, juzStart: 17, pageStart: 322 },
  { number: 22, name: "الحج", nameArabic: "الحج", nameEnglish: "Al-Hajj", revelationType: "Medinan", versesCount: 78, rukuCount: 10, sajdaCount: 2, juzStart: 17, pageStart: 332 },
  { number: 23, name: "المؤمنون", nameArabic: "المؤمنون", nameEnglish: "Al-Mu'minun", revelationType: "Meccan", versesCount: 118, rukuCount: 6, sajdaCount: 0, juzStart: 18, pageStart: 342 },
  { number: 24, name: "النور", nameArabic: "النور", nameEnglish: "An-Nur", revelationType: "Medinan", versesCount: 64, rukuCount: 9, sajdaCount: 0, juzStart: 18, pageStart: 350 },
  { number: 25, name: "الفرقان", nameArabic: "الفرقان", nameEnglish: "Al-Furqan", revelationType: "Meccan", versesCount: 77, rukuCount: 6, sajdaCount: 1, juzStart: 18, pageStart: 359 },
  { number: 26, name: "الشعراء", nameArabic: "الشعراء", nameEnglish: "Ash-Shu'ara", revelationType: "Meccan", versesCount: 227, rukuCount: 11, sajdaCount: 0, juzStart: 19, pageStart: 367 },
  { number: 27, name: "النمل", nameArabic: "النمل", nameEnglish: "An-Naml", revelationType: "Meccan", versesCount: 93, rukuCount: 7, sajdaCount: 1, juzStart: 19, pageStart: 377 },
  { number: 28, name: "القصص", nameArabic: "القصص", nameEnglish: "Al-Qasas", revelationType: "Meccan", versesCount: 88, rukuCount: 9, sajdaCount: 0, juzStart: 20, pageStart: 385 },
  { number: 29, name: "العنكبوت", nameArabic: "العنكبوت", nameEnglish: "Al-Ankabut", revelationType: "Meccan", versesCount: 69, rukuCount: 7, sajdaCount: 0, juzStart: 20, pageStart: 396 },
  { number: 30, name: "الروم", nameArabic: "الروم", nameEnglish: "Ar-Rum", revelationType: "Meccan", versesCount: 60, rukuCount: 6, sajdaCount: 0, juzStart: 21, pageStart: 404 },
  { number: 31, name: "لقمان", nameArabic: "لقمان", nameEnglish: "Luqman", revelationType: "Meccan", versesCount: 34, rukuCount: 4, sajdaCount: 0, juzStart: 21, pageStart: 411 },
  { number: 32, name: "السجدة", nameArabic: "السجدة", nameEnglish: "As-Sajdah", revelationType: "Meccan", versesCount: 30, rukuCount: 3, sajdaCount: 1, juzStart: 21, pageStart: 415 },
  { number: 33, name: "الأحزاب", nameArabic: "الأحزاب", nameEnglish: "Al-Ahzab", revelationType: "Medinan", versesCount: 73, rukuCount: 9, sajdaCount: 0, juzStart: 21, pageStart: 418 },
  { number: 34, name: "سبأ", nameArabic: "سبأ", nameEnglish: "Saba", revelationType: "Meccan", versesCount: 54, rukuCount: 6, sajdaCount: 0, juzStart: 22, pageStart: 428 },
  { number: 35, name: "فاطر", nameArabic: "فاطر", nameEnglish: "Fatir", revelationType: "Meccan", versesCount: 45, rukuCount: 5, sajdaCount: 0, juzStart: 22, pageStart: 434 },
  { number: 36, name: "يس", nameArabic: "يس", nameEnglish: "Ya-Sin", revelationType: "Meccan", versesCount: 83, rukuCount: 5, sajdaCount: 0, juzStart: 22, pageStart: 440 },
  { number: 37, name: "الصافات", nameArabic: "الصافات", nameEnglish: "As-Saffat", revelationType: "Meccan", versesCount: 182, rukuCount: 5, sajdaCount: 0, juzStart: 23, pageStart: 446 },
  { number: 38, name: "ص", nameArabic: "ص", nameEnglish: "Sad", revelationType: "Meccan", versesCount: 88, rukuCount: 5, sajdaCount: 1, juzStart: 23, pageStart: 453 },
  { number: 39, name: "الزمر", nameArabic: "الزمر", nameEnglish: "Az-Zumar", revelationType: "Meccan", versesCount: 75, rukuCount: 8, sajdaCount: 0, juzStart: 23, pageStart: 458 },
  { number: 40, name: "غافر", nameArabic: "غافر", nameEnglish: "Ghafir", revelationType: "Meccan", versesCount: 85, rukuCount: 9, sajdaCount: 0, juzStart: 24, pageStart: 467 },
  { number: 41, name: "فصلت", nameArabic: "فصلت", nameEnglish: "Fussilat", revelationType: "Meccan", versesCount: 54, rukuCount: 6, sajdaCount: 1, juzStart: 24, pageStart: 477 },
  { number: 42, name: "الشورى", nameArabic: "الشورى", nameEnglish: "Ash-Shura", revelationType: "Meccan", versesCount: 53, rukuCount: 5, sajdaCount: 0, juzStart: 25, pageStart: 483 },
  { number: 43, name: "الزخرف", nameArabic: "الزخرف", nameEnglish: "Az-Zukhruf", revelationType: "Meccan", versesCount: 89, rukuCount: 7, sajdaCount: 0, juzStart: 25, pageStart: 489 },
  { number: 44, name: "الدخان", nameArabic: "الدخان", nameEnglish: "Ad-Dukhan", revelationType: "Meccan", versesCount: 59, rukuCount: 3, sajdaCount: 0, juzStart: 25, pageStart: 496 },
  { number: 45, name: "الجاثية", nameArabic: "الجاثية", nameEnglish: "Al-Jathiyah", revelationType: "Meccan", versesCount: 37, rukuCount: 4, sajdaCount: 0, juzStart: 25, pageStart: 499 },
  { number: 46, name: "الأحقاف", nameArabic: "الأحقاف", nameEnglish: "Al-Ahqaf", revelationType: "Meccan", versesCount: 35, rukuCount: 4, sajdaCount: 0, juzStart: 26, pageStart: 502 },
  { number: 47, name: "محمد", nameArabic: "محمد", nameEnglish: "Muhammad", revelationType: "Medinan", versesCount: 38, rukuCount: 4, sajdaCount: 0, juzStart: 26, pageStart: 507 },
  { number: 48, name: "الفتح", nameArabic: "الفتح", nameEnglish: "Al-Fath", revelationType: "Medinan", versesCount: 29, rukuCount: 4, sajdaCount: 0, juzStart: 26, pageStart: 511 },
  { number: 49, name: "الحجرات", nameArabic: "الحجرات", nameEnglish: "Al-Hujurat", revelationType: "Medinan", versesCount: 18, rukuCount: 2, sajdaCount: 0, juzStart: 26, pageStart: 515 },
  { number: 50, name: "ق", nameArabic: "ق", nameEnglish: "Qaf", revelationType: "Meccan", versesCount: 45, rukuCount: 3, sajdaCount: 0, juzStart: 26, pageStart: 518 },
  { number: 51, name: "الذاريات", nameArabic: "الذاريات", nameEnglish: "Adh-Dhariyat", revelationType: "Meccan", versesCount: 60, rukuCount: 3, sajdaCount: 0, juzStart: 26, pageStart: 520 },
  { number: 52, name: "الطور", nameArabic: "الطور", nameEnglish: "At-Tur", revelationType: "Meccan", versesCount: 49, rukuCount: 2, sajdaCount: 0, juzStart: 27, pageStart: 523 },
  { number: 53, name: "النجم", nameArabic: "النجم", nameEnglish: "An-Najm", revelationType: "Meccan", versesCount: 62, rukuCount: 3, sajdaCount: 1, juzStart: 27, pageStart: 526 },
  { number: 54, name: "القمر", nameArabic: "القمر", nameEnglish: "Al-Qamar", revelationType: "Meccan", versesCount: 55, rukuCount: 3, sajdaCount: 0, juzStart: 27, pageStart: 528 },
  { number: 55, name: "الرحمن", nameArabic: "الرحمن", nameEnglish: "Ar-Rahman", revelationType: "Medinan", versesCount: 78, rukuCount: 3, sajdaCount: 0, juzStart: 27, pageStart: 531 },
  { number: 56, name: "الواقعة", nameArabic: "الواقعة", nameEnglish: "Al-Waqi'ah", revelationType: "Meccan", versesCount: 96, rukuCount: 3, sajdaCount: 0, juzStart: 27, pageStart: 534 },
  { number: 57, name: "الحديد", nameArabic: "الحديد", nameEnglish: "Al-Hadid", revelationType: "Medinan", versesCount: 29, rukuCount: 4, sajdaCount: 0, juzStart: 27, pageStart: 537 },
  { number: 58, name: "المجادلة", nameArabic: "المجادلة", nameEnglish: "Al-Mujadila", revelationType: "Medinan", versesCount: 22, rukuCount: 3, sajdaCount: 0, juzStart: 28, pageStart: 542 },
  { number: 59, name: "الحشر", nameArabic: "الحشر", nameEnglish: "Al-Hashr", revelationType: "Medinan", versesCount: 24, rukuCount: 3, sajdaCount: 0, juzStart: 28, pageStart: 545 },
  { number: 60, name: "الممتحنة", nameArabic: "الممتحنة", nameEnglish: "Al-Mumtahanah", revelationType: "Medinan", versesCount: 13, rukuCount: 2, sajdaCount: 0, juzStart: 28, pageStart: 549 },
  { number: 61, name: "الصف", nameArabic: "الصف", nameEnglish: "As-Saff", revelationType: "Medinan", versesCount: 14, rukuCount: 2, sajdaCount: 0, juzStart: 28, pageStart: 551 },
  { number: 62, name: "الجمعة", nameArabic: "الجمعة", nameEnglish: "Al-Jumu'ah", revelationType: "Medinan", versesCount: 11, rukuCount: 2, sajdaCount: 0, juzStart: 28, pageStart: 553 },
  { number: 63, name: "المنافقون", nameArabic: "المنافقون", nameEnglish: "Al-Munafiqun", revelationType: "Medinan", versesCount: 11, rukuCount: 2, sajdaCount: 0, juzStart: 28, pageStart: 554 },
  { number: 64, name: "التغابن", nameArabic: "التغابن", nameEnglish: "At-Taghabun", revelationType: "Medinan", versesCount: 18, rukuCount: 2, sajdaCount: 0, juzStart: 28, pageStart: 556 },
  { number: 65, name: "الطلاق", nameArabic: "الطلاق", nameEnglish: "At-Talaq", revelationType: "Medinan", versesCount: 12, rukuCount: 2, sajdaCount: 0, juzStart: 28, pageStart: 558 },
  { number: 66, name: "التحريم", nameArabic: "التحريم", nameEnglish: "At-Tahrim", revelationType: "Medinan", versesCount: 12, rukuCount: 2, sajdaCount: 0, juzStart: 28, pageStart: 560 },
  { number: 67, name: "الملك", nameArabic: "الملك", nameEnglish: "Al-Mulk", revelationType: "Meccan", versesCount: 30, rukuCount: 2, sajdaCount: 0, juzStart: 29, pageStart: 562 },
  { number: 68, name: "القلم", nameArabic: "القلم", nameEnglish: "Al-Qalam", revelationType: "Meccan", versesCount: 52, rukuCount: 2, sajdaCount: 0, juzStart: 29, pageStart: 564 },
  { number: 69, name: "الحاقة", nameArabic: "الحاقة", nameEnglish: "Al-Haqqah", revelationType: "Meccan", versesCount: 52, rukuCount: 2, sajdaCount: 0, juzStart: 29, pageStart: 566 },
  { number: 70, name: "المعارج", nameArabic: "المعارج", nameEnglish: "Al-Ma'arij", revelationType: "Meccan", versesCount: 44, rukuCount: 2, sajdaCount: 0, juzStart: 29, pageStart: 568 },
  { number: 71, name: "نوح", nameArabic: "نوح", nameEnglish: "Nuh", revelationType: "Meccan", versesCount: 28, rukuCount: 2, sajdaCount: 0, juzStart: 29, pageStart: 570 },
  { number: 72, name: "الجن", nameArabic: "الجن", nameEnglish: "Al-Jinn", revelationType: "Meccan", versesCount: 28, rukuCount: 2, sajdaCount: 0, juzStart: 29, pageStart: 572 },
  { number: 73, name: "المزمل", nameArabic: "المزمل", nameEnglish: "Al-Muzzammil", revelationType: "Meccan", versesCount: 20, rukuCount: 2, sajdaCount: 0, juzStart: 29, pageStart: 574 },
  { number: 74, name: "المدثر", nameArabic: "المدثر", nameEnglish: "Al-Muddaththir", revelationType: "Meccan", versesCount: 56, rukuCount: 2, sajdaCount: 0, juzStart: 29, pageStart: 575 },
  { number: 75, name: "القيامة", nameArabic: "القيامة", nameEnglish: "Al-Qiyamah", revelationType: "Meccan", versesCount: 40, rukuCount: 2, sajdaCount: 0, juzStart: 29, pageStart: 577 },
  { number: 76, name: "الإنسان", nameArabic: "الإنسان", nameEnglish: "Al-Insan", revelationType: "Medinan", versesCount: 31, rukuCount: 2, sajdaCount: 0, juzStart: 29, pageStart: 578 },
  { number: 77, name: "المرسلات", nameArabic: "المرسلات", nameEnglish: "Al-Mursalat", revelationType: "Meccan", versesCount: 50, rukuCount: 2, sajdaCount: 0, juzStart: 29, pageStart: 580 },
  { number: 78, name: "النبأ", nameArabic: "النبأ", nameEnglish: "An-Naba", revelationType: "Meccan", versesCount: 40, rukuCount: 2, sajdaCount: 0, juzStart: 30, pageStart: 582 },
  { number: 79, name: "النازعات", nameArabic: "النازعات", nameEnglish: "An-Nazi'at", revelationType: "Meccan", versesCount: 46, rukuCount: 2, sajdaCount: 0, juzStart: 30, pageStart: 583 },
  { number: 80, name: "عبس", nameArabic: "عبس", nameEnglish: "Abasa", revelationType: "Meccan", versesCount: 42, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 585 },
  { number: 81, name: "التكوير", nameArabic: "التكوير", nameEnglish: "At-Takwir", revelationType: "Meccan", versesCount: 29, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 586 },
  { number: 82, name: "الإنفطار", nameArabic: "الإنفطار", nameEnglish: "Al-Infitar", revelationType: "Meccan", versesCount: 19, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 587 },
  { number: 83, name: "المطففين", nameArabic: "المطففين", nameEnglish: "Al-Mutaffifin", revelationType: "Meccan", versesCount: 36, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 587 },
  { number: 84, name: "الإنشقاق", nameArabic: "الإنشقاق", nameEnglish: "Al-Inshiqaq", revelationType: "Meccan", versesCount: 25, rukuCount: 1, sajdaCount: 1, juzStart: 30, pageStart: 589 },
  { number: 85, name: "البروج", nameArabic: "البروج", nameEnglish: "Al-Buruj", revelationType: "Meccan", versesCount: 22, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 590 },
  { number: 86, name: "الطارق", nameArabic: "الطارق", nameEnglish: "At-Tariq", revelationType: "Meccan", versesCount: 17, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 591 },
  { number: 87, name: "الأعلى", nameArabic: "الأعلى", nameEnglish: "Al-A'la", revelationType: "Meccan", versesCount: 19, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 591 },
  { number: 88, name: "الغاشية", nameArabic: "الغاشية", nameEnglish: "Al-Ghashiyah", revelationType: "Meccan", versesCount: 26, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 592 },
  { number: 89, name: "الفجر", nameArabic: "الفجر", nameEnglish: "Al-Fajr", revelationType: "Meccan", versesCount: 30, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 593 },
  { number: 90, name: "البلد", nameArabic: "البلد", nameEnglish: "Al-Balad", revelationType: "Meccan", versesCount: 20, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 594 },
  { number: 91, name: "الشمس", nameArabic: "الشمس", nameEnglish: "Ash-Shams", revelationType: "Meccan", versesCount: 15, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 595 },
  { number: 92, name: "الليل", nameArabic: "الليل", nameEnglish: "Al-Layl", revelationType: "Meccan", versesCount: 21, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 595 },
  { number: 93, name: "الضحى", nameArabic: "الضحى", nameEnglish: "Ad-Duha", revelationType: "Meccan", versesCount: 11, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 596 },
  { number: 94, name: "الشرح", nameArabic: "الشرح", nameEnglish: "Ash-Sharh", revelationType: "Meccan", versesCount: 8, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 596 },
  { number: 95, name: "التين", nameArabic: "التين", nameEnglish: "At-Tin", revelationType: "Meccan", versesCount: 8, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 597 },
  { number: 96, name: "العلق", nameArabic: "العلق", nameEnglish: "Al-Alaq", revelationType: "Meccan", versesCount: 19, rukuCount: 1, sajdaCount: 1, juzStart: 30, pageStart: 597 },
  { number: 97, name: "القدر", nameArabic: "القدر", nameEnglish: "Al-Qadr", revelationType: "Meccan", versesCount: 5, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 598 },
  { number: 98, name: "البينة", nameArabic: "البينة", nameEnglish: "Al-Bayyinah", revelationType: "Medinan", versesCount: 8, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 598 },
  { number: 99, name: "الزلزلة", nameArabic: "الزلزلة", nameEnglish: "Az-Zalzalah", revelationType: "Medinan", versesCount: 8, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 599 },
  { number: 100, name: "العاديات", nameArabic: "العاديات", nameEnglish: "Al-Adiyat", revelationType: "Meccan", versesCount: 11, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 599 },
  { number: 101, name: "القارعة", nameArabic: "القارعة", nameEnglish: "Al-Qari'ah", revelationType: "Meccan", versesCount: 11, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 600 },
  { number: 102, name: "التكاثر", nameArabic: "التكاثر", nameEnglish: "At-Takathur", revelationType: "Meccan", versesCount: 8, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 600 },
  { number: 103, name: "العصر", nameArabic: "العصر", nameEnglish: "Al-Asr", revelationType: "Meccan", versesCount: 3, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 601 },
  { number: 104, name: "الهمزة", nameArabic: "الهمزة", nameEnglish: "Al-Humazah", revelationType: "Meccan", versesCount: 9, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 601 },
  { number: 105, name: "الفيل", nameArabic: "الفيل", nameEnglish: "Al-Fil", revelationType: "Meccan", versesCount: 5, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 601 },
  { number: 106, name: "قريش", nameArabic: "قريش", nameEnglish: "Quraysh", revelationType: "Meccan", versesCount: 4, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 602 },
  { number: 107, name: "الماعون", nameArabic: "الماعون", nameEnglish: "Al-Ma'un", revelationType: "Medinan", versesCount: 7, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 602 },
  { number: 108, name: "الكوثر", nameArabic: "الكوثر", nameEnglish: "Al-Kawthar", revelationType: "Meccan", versesCount: 3, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 602 },
  { number: 109, name: "الكافرون", nameArabic: "الكافرون", nameEnglish: "Al-Kafirun", revelationType: "Meccan", versesCount: 6, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 603 },
  { number: 110, name: "النصر", nameArabic: "النصر", nameEnglish: "An-Nasr", revelationType: "Medinan", versesCount: 3, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 603 },
  { number: 111, name: "المسد", nameArabic: "المسد", nameEnglish: "Al-Masad", revelationType: "Meccan", versesCount: 5, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 603 },
  { number: 112, name: "الإخراص", nameArabic: "الإخلاص", nameEnglish: "Al-Ikhlas", revelationType: "Meccan", versesCount: 4, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 604 },
  { number: 113, name: "الفلق", nameArabic: "الفلق", nameEnglish: "Al-Falaq", revelationType: "Meccan", versesCount: 5, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 604 },
  { number: 114, name: "الناس", nameArabic: "الناس", nameEnglish: "An-Nas", revelationType: "Meccan", versesCount: 6, rukuCount: 1, sajdaCount: 0, juzStart: 30, pageStart: 604 },
]

// Get Surah by number
export function getSurah(number: number): Surah | undefined {
  return SURAHS.find((s) => s.number === number)
}

// Get Juz info
export function getJuz(number: number) {
  return JUZ_INFO.find((j) => j.number === number)
}
