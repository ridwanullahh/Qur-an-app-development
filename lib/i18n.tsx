"use client"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Internationalization System for Multi-language Support

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type SupportedLanguage = "ar" | "en" | "ur" | "fr" | "es" | "id" | "tr" | "bn" | "ru" | "zh"

export interface LanguageInfo {
  code: SupportedLanguage
  name: string
  nativeName: string
  direction: "rtl" | "ltr"
  flag: string
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: "ar", name: "Arabic", nativeName: "العربية", direction: "rtl", flag: "🇸🇦" },
  { code: "en", name: "English", nativeName: "English", direction: "ltr", flag: "🇬🇧" },
  { code: "ur", name: "Urdu", nativeName: "اردو", direction: "rtl", flag: "🇵🇰" },
  { code: "fr", name: "French", nativeName: "Français", direction: "ltr", flag: "🇫🇷" },
  { code: "es", name: "Spanish", nativeName: "Español", direction: "ltr", flag: "🇪🇸" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", direction: "ltr", flag: "🇮🇩" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", direction: "ltr", flag: "🇹🇷" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", direction: "ltr", flag: "🇧🇩" },
  { code: "ru", name: "Russian", nativeName: "Русский", direction: "ltr", flag: "🇷🇺" },
  { code: "zh", name: "Chinese", nativeName: "中文", direction: "ltr", flag: "🇨🇳" },
]

// UI Translations
const translations: Record<SupportedLanguage, Record<string, string>> = {
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.quran": "القرآن الكريم",
    "nav.memorize": "الحفظ",
    "nav.search": "البحث",
    "nav.bookmarks": "العلامات",
    "nav.settings": "الإعدادات",
    "nav.admin": "لوحة التحكم",

    // Quran Reader
    "quran.surah": "سورة",
    "quran.verse": "آية",
    "quran.juz": "الجزء",
    "quran.page": "صفحة",
    "quran.hizb": "الحزب",
    "quran.meccan": "مكية",
    "quran.medinan": "مدنية",
    "quran.verses": "آيات",
    "quran.bismillah": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",

    // Views
    "view.mushaf": "مصحف",
    "view.list": "قائمة",
    "view.reading": "القراءة",

    // Sciences Panel
    "sciences.meaning": "المعنى",
    "sciences.grammar": "الإعراب",
    "sciences.morphology": "الصرف",
    "sciences.tajweed": "التجويد",
    "sciences.tafsir": "التفسير",
    "sciences.translation": "الترجمة",
    "sciences.transliteration": "النطق",
    "sciences.root": "الجذر",
    "sciences.related": "آيات ذات صلة",
    "sciences.reasons": "أسباب النزول",

    // Memorization
    "memorize.title": "حفظ القرآن",
    "memorize.new": "جديد",
    "memorize.review": "مراجعة",
    "memorize.test": "اختبار",
    "memorize.progress": "التقدم",
    "memorize.streak": "أيام متتالية",
    "memorize.memorized": "محفوظ",
    "memorize.learning": "قيد الحفظ",
    "memorize.due": "مستحق للمراجعة",

    // Audio
    "audio.play": "تشغيل",
    "audio.pause": "إيقاف مؤقت",
    "audio.stop": "إيقاف",
    "audio.repeat": "تكرار",
    "audio.speed": "السرعة",
    "audio.reciter": "القارئ",

    // Settings
    "settings.title": "الإعدادات",
    "settings.language": "اللغة",
    "settings.theme": "المظهر",
    "settings.fontSize": "حجم الخط",
    "settings.font": "الخط",
    "settings.translation": "الترجمة",
    "settings.tajweed": "ألوان التجويد",
    "settings.wordByWord": "كلمة بكلمة",

    // Themes
    "theme.light": "فاتح",
    "theme.dark": "داكن",
    "theme.sepia": "بني",

    // Actions
    "action.bookmark": "إضافة علامة",
    "action.share": "مشاركة",
    "action.copy": "نسخ",
    "action.listen": "استمع",
    "action.close": "إغلاق",
    "action.save": "حفظ",
    "action.cancel": "إلغاء",
    "action.next": "التالي",
    "action.previous": "السابق",

    // Messages
    "msg.loading": "جاري التحميل...",
    "msg.noData": "لا توجد بيانات",
    "msg.error": "حدث خطأ",
    "msg.success": "تم بنجاح",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.quran": "Quran",
    "nav.memorize": "Memorize",
    "nav.search": "Search",
    "nav.bookmarks": "Bookmarks",
    "nav.settings": "Settings",
    "nav.admin": "Admin",

    // Quran Reader
    "quran.surah": "Surah",
    "quran.verse": "Verse",
    "quran.juz": "Juz",
    "quran.page": "Page",
    "quran.hizb": "Hizb",
    "quran.meccan": "Meccan",
    "quran.medinan": "Medinan",
    "quran.verses": "verses",
    "quran.bismillah": "In the name of Allah, the Most Gracious, the Most Merciful",

    // Views
    "view.mushaf": "Mushaf",
    "view.list": "List",
    "view.reading": "Reading",

    // Sciences Panel
    "sciences.meaning": "Meaning",
    "sciences.grammar": "Grammar",
    "sciences.morphology": "Morphology",
    "sciences.tajweed": "Tajweed",
    "sciences.tafsir": "Tafsir",
    "sciences.translation": "Translation",
    "sciences.transliteration": "Transliteration",
    "sciences.root": "Root",
    "sciences.related": "Related Verses",
    "sciences.reasons": "Reasons of Revelation",

    // Memorization
    "memorize.title": "Memorize Quran",
    "memorize.new": "New",
    "memorize.review": "Review",
    "memorize.test": "Test",
    "memorize.progress": "Progress",
    "memorize.streak": "Day Streak",
    "memorize.memorized": "Memorized",
    "memorize.learning": "Learning",
    "memorize.due": "Due for Review",

    // Audio
    "audio.play": "Play",
    "audio.pause": "Pause",
    "audio.stop": "Stop",
    "audio.repeat": "Repeat",
    "audio.speed": "Speed",
    "audio.reciter": "Reciter",

    // Settings
    "settings.title": "Settings",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.fontSize": "Font Size",
    "settings.font": "Font",
    "settings.translation": "Translation",
    "settings.tajweed": "Tajweed Colors",
    "settings.wordByWord": "Word by Word",

    // Themes
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.sepia": "Sepia",

    // Actions
    "action.bookmark": "Bookmark",
    "action.share": "Share",
    "action.copy": "Copy",
    "action.listen": "Listen",
    "action.close": "Close",
    "action.save": "Save",
    "action.cancel": "Cancel",
    "action.next": "Next",
    "action.previous": "Previous",

    // Messages
    "msg.loading": "Loading...",
    "msg.noData": "No data available",
    "msg.error": "An error occurred",
    "msg.success": "Success",
  },
  ur: {
    "nav.home": "ہوم",
    "nav.quran": "قرآن کریم",
    "nav.memorize": "حفظ",
    "nav.search": "تلاش",
    "nav.bookmarks": "نشانیاں",
    "nav.settings": "ترتیبات",
    "nav.admin": "ایڈمن",
    "quran.surah": "سورۃ",
    "quran.verse": "آیت",
    "quran.juz": "پارہ",
    "quran.page": "صفحہ",
    "quran.bismillah": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    "sciences.meaning": "معنی",
    "sciences.grammar": "نحو",
    "sciences.morphology": "صرف",
    "sciences.tajweed": "تجوید",
    "sciences.tafsir": "تفسیر",
    "sciences.translation": "ترجمہ",
    "settings.title": "ترتیبات",
    "settings.language": "زبان",
    "action.close": "بند کریں",
    "msg.loading": "لوڈ ہو رہا ہے...",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.quran": "Coran",
    "nav.memorize": "Mémoriser",
    "nav.search": "Rechercher",
    "nav.bookmarks": "Favoris",
    "nav.settings": "Paramètres",
    "quran.surah": "Sourate",
    "quran.verse": "Verset",
    "quran.juz": "Juz",
    "quran.page": "Page",
    "sciences.meaning": "Signification",
    "sciences.tafsir": "Tafsir",
    "sciences.translation": "Traduction",
    "settings.title": "Paramètres",
    "settings.language": "Langue",
    "action.close": "Fermer",
    "msg.loading": "Chargement...",
  },
  es: {
    "nav.home": "Inicio",
    "nav.quran": "Corán",
    "nav.memorize": "Memorizar",
    "nav.search": "Buscar",
    "nav.settings": "Configuración",
    "quran.surah": "Sura",
    "quran.verse": "Verso",
    "sciences.meaning": "Significado",
    "sciences.tafsir": "Tafsir",
    "settings.title": "Configuración",
    "settings.language": "Idioma",
    "action.close": "Cerrar",
    "msg.loading": "Cargando...",
  },
  id: {
    "nav.home": "Beranda",
    "nav.quran": "Al-Quran",
    "nav.memorize": "Hafalan",
    "nav.search": "Cari",
    "nav.settings": "Pengaturan",
    "quran.surah": "Surah",
    "quran.verse": "Ayat",
    "sciences.meaning": "Makna",
    "sciences.tafsir": "Tafsir",
    "settings.title": "Pengaturan",
    "settings.language": "Bahasa",
    "action.close": "Tutup",
    "msg.loading": "Memuat...",
  },
  tr: {
    "nav.home": "Ana Sayfa",
    "nav.quran": "Kur'an",
    "nav.memorize": "Ezberle",
    "nav.search": "Ara",
    "nav.settings": "Ayarlar",
    "quran.surah": "Sure",
    "quran.verse": "Ayet",
    "sciences.meaning": "Anlam",
    "sciences.tafsir": "Tefsir",
    "settings.title": "Ayarlar",
    "settings.language": "Dil",
    "action.close": "Kapat",
    "msg.loading": "Yükleniyor...",
  },
  bn: {
    "nav.home": "হোম",
    "nav.quran": "কুরআন",
    "nav.memorize": "মুখস্থ",
    "nav.search": "অনুসন্ধান",
    "nav.settings": "সেটিংস",
    "quran.surah": "সূরা",
    "quran.verse": "আয়াত",
    "sciences.meaning": "অর্থ",
    "sciences.tafsir": "তাফসীর",
    "settings.title": "সেটিংস",
    "settings.language": "ভাষা",
    "action.close": "বন্ধ",
    "msg.loading": "লোড হচ্ছে...",
  },
  ru: {
    "nav.home": "Главная",
    "nav.quran": "Коран",
    "nav.memorize": "Запоминание",
    "nav.search": "Поиск",
    "nav.settings": "Настройки",
    "quran.surah": "Сура",
    "quran.verse": "Аят",
    "sciences.meaning": "Значение",
    "sciences.tafsir": "Тафсир",
    "settings.title": "Настройки",
    "settings.language": "Язык",
    "action.close": "Закрыть",
    "msg.loading": "Загрузка...",
  },
  zh: {
    "nav.home": "首页",
    "nav.quran": "古兰经",
    "nav.memorize": "背诵",
    "nav.search": "搜索",
    "nav.settings": "设置",
    "quran.surah": "章",
    "quran.verse": "节",
    "sciences.meaning": "含义",
    "sciences.tafsir": "注释",
    "settings.title": "设置",
    "settings.language": "语言",
    "action.close": "关闭",
    "msg.loading": "加载中...",
  },
}

interface I18nContextType {
  language: SupportedLanguage
  languageInfo: LanguageInfo
  setLanguage: (lang: SupportedLanguage) => void
  t: (key: string, fallback?: string) => string
  direction: "rtl" | "ltr"
  isRTL: boolean
  availableLanguages: LanguageInfo[]
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("ar")

  const languageInfo = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0]

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang)
    // Update document direction
    if (typeof document !== "undefined") {
      const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === lang)
      document.documentElement.dir = langInfo?.direction || "ltr"
      document.documentElement.lang = lang
    }
  }, [])

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const langTranslations = translations[language]
      if (langTranslations && langTranslations[key]) {
        return langTranslations[key]
      }
      // Fallback to English
      if (translations.en[key]) {
        return translations.en[key]
      }
      // Fallback to Arabic
      if (translations.ar[key]) {
        return translations.ar[key]
      }
      return fallback || key
    },
    [language],
  )

  return (
    <I18nContext.Provider
      value={{
        language,
        languageInfo,
        setLanguage,
        t,
        direction: languageInfo.direction,
        isRTL: languageInfo.direction === "rtl",
        availableLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}

// Convert number to Arabic numerals
export function toArabicNumeral(num: number): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]
  return num
    .toString()
    .split("")
    .map((d) => arabicNumerals[Number.parseInt(d)] || d)
    .join("")
}
