import type React from "react"
// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Tajweed Rules and Color System

export type TajweedRule =
  | "ghunnah" // غنة - Nasal sound
  | "ikhfa" // إخفاء - Hiding
  | "idgham" // إدغام - Merging
  | "iqlab" // إقلاب - Conversion
  | "qalqalah" // قلقلة - Echo
  | "madd" // مد - Prolongation
  | "madd_lazim" // مد لازم - Obligatory prolongation
  | "madd_muttasil" // مد متصل - Connected prolongation
  | "madd_munfasil" // مد منفصل - Separated prolongation
  | "izhar" // إظهار - Clarity
  | "lam_shamsiyyah" // لام شمسية
  | "lam_qamariyyah" // لام قمرية
  | "silent" // حرف ساكن
  | "normal" // عادي

export interface TajweedRuleInfo {
  id: TajweedRule
  nameArabic: string
  nameEnglish: string
  color: string
  bgColor: string
  description: Record<string, string>
  examples: string[]
}

export const TAJWEED_RULES: Record<TajweedRule, TajweedRuleInfo> = {
  ghunnah: {
    id: "ghunnah",
    nameArabic: "غُنَّة",
    nameEnglish: "Ghunnah",
    color: "#16a34a",
    bgColor: "rgba(22, 163, 74, 0.15)",
    description: {
      ar: "صوت يخرج من الخيشوم (الأنف) مصاحبًا لحرفي النون والميم",
      en: "A nasal sound that accompanies the letters Noon and Meem",
      ur: "ناک سے نکلنے والی آواز جو نون اور میم کے ساتھ ہوتی ہے",
    },
    examples: ["نَّ", "مَّ", "نْ", "مْ"],
  },
  ikhfa: {
    id: "ikhfa",
    nameArabic: "إِخْفَاء",
    nameEnglish: "Ikhfa",
    color: "#ea580c",
    bgColor: "rgba(234, 88, 12, 0.15)",
    description: {
      ar: "النطق بالنون الساكنة أو التنوين بصفة بين الإظهار والإدغام مع بقاء الغنة",
      en: "Pronouncing Noon Sakinah or Tanween with a state between clarity and merging",
      ur: "نون ساکنہ یا تنوین کو اظہار اور ادغام کے درمیان پڑھنا",
    },
    examples: ["مِنْ قَبْلِ", "أَنْتَ", "عَنْكَ"],
  },
  idgham: {
    id: "idgham",
    nameArabic: "إِدْغَام",
    nameEnglish: "Idgham",
    color: "#9333ea",
    bgColor: "rgba(147, 51, 234, 0.15)",
    description: {
      ar: "إدخال حرف ساكن بحرف متحرك بحيث يصيران حرفًا واحدًا مشددًا",
      en: "Merging a silent letter into a voweled letter, making them one emphasized letter",
      ur: "ساکن حرف کو متحرک حرف میں ملا دینا",
    },
    examples: ["مِنْ يَوْمِ", "مِنْ وَالِ", "مِنْ مَالٍ"],
  },
  iqlab: {
    id: "iqlab",
    nameArabic: "إِقْلاب",
    nameEnglish: "Iqlab",
    color: "#0891b2",
    bgColor: "rgba(8, 145, 178, 0.15)",
    description: {
      ar: "قلب النون الساكنة أو التنوين ميمًا مخفاة عند الباء",
      en: "Converting Noon Sakinah or Tanween into a hidden Meem when followed by Ba",
      ur: "نون ساکنہ یا تنوین کو باء سے پہلے میم میں بدلنا",
    },
    examples: ["مِنْ بَعْدِ", "أَنْبِئْهُم", "سَمِيعٌ بَصِير"],
  },
  qalqalah: {
    id: "qalqalah",
    nameArabic: "قَلْقَلَة",
    nameEnglish: "Qalqalah",
    color: "#2563eb",
    bgColor: "rgba(37, 99, 235, 0.15)",
    description: {
      ar: "اضطراب الصوت عند النطق بالحرف الساكن حتى يُسمع له نبرة قوية (ق ط ب ج د)",
      en: "An echoing sound when pronouncing certain silent letters (Qaf, Ta, Ba, Jeem, Dal)",
      ur: "قاف، طاء، باء، جیم، دال کے ساکن ہونے پر آواز میں ارتعاش",
    },
    examples: ["قْ", "طْ", "بْ", "جْ", "دْ"],
  },
  madd: {
    id: "madd",
    nameArabic: "مَدّ",
    nameEnglish: "Madd",
    color: "#dc2626",
    bgColor: "rgba(220, 38, 38, 0.15)",
    description: {
      ar: "إطالة الصوت بحرف من حروف المد (ا، و، ي)",
      en: "Prolongation of sound with a Madd letter (Alif, Waw, Ya)",
      ur: "الف، واو، یاء کو لمبا کر کے پڑھنا",
    },
    examples: ["قَالَ", "يَقُولُ", "قِيلَ"],
  },
  madd_lazim: {
    id: "madd_lazim",
    nameArabic: "مَدّ لازِم",
    nameEnglish: "Madd Lazim",
    color: "#be123c",
    bgColor: "rgba(190, 18, 60, 0.15)",
    description: {
      ar: "المد الواجب ست حركات عند وجود سكون أصلي بعد حرف المد",
      en: "Obligatory prolongation of 6 counts when followed by original sukoon",
      ur: "چھ حرکات کا لازمی مد",
    },
    examples: ["الْحَاقَّة", "الطَّامَّة", "الضَّالِّين"],
  },
  madd_muttasil: {
    id: "madd_muttasil",
    nameArabic: "مَدّ مُتَّصِل",
    nameEnglish: "Madd Muttasil",
    color: "#e11d48",
    bgColor: "rgba(225, 29, 72, 0.15)",
    description: {
      ar: "المد الواجب عند وجود همزة بعد حرف المد في نفس الكلمة",
      en: "Connected prolongation when Hamza follows Madd letter in same word",
      ur: "ایک لفظ میں مد کے بعد ہمزہ آنے پر واجب مد",
    },
    examples: ["جَاءَ", "سُوءَ", "جِيءَ"],
  },
  madd_munfasil: {
    id: "madd_munfasil",
    nameArabic: "مَدّ مُنْفَصِل",
    nameEnglish: "Madd Munfasil",
    color: "#f43f5e",
    bgColor: "rgba(244, 63, 94, 0.15)",
    description: {
      ar: "المد الجائز عند وجود همزة في بداية الكلمة التالية",
      en: "Separated prolongation when Hamza is at the start of next word",
      ur: "الگ لفظ میں ہمزہ آنے پر جائز مد",
    },
    examples: ["إِنَّا أَنزَلْنَاهُ", "قَالُوا آمَنَّا", "فِي أَنفُسِكُمْ"],
  },
  izhar: {
    id: "izhar",
    nameArabic: "إِظْهَار",
    nameEnglish: "Izhar",
    color: "#65a30d",
    bgColor: "rgba(101, 163, 13, 0.15)",
    description: {
      ar: "إخراج الحرف من مخرجه من غير غنة",
      en: "Clear pronunciation of the letter from its articulation point without nasalization",
      ur: "حرف کو واضح طور پر بغیر غنہ کے ادا کرنا",
    },
    examples: ["مِنْ عِلْمٍ", "مَنْ آمَنَ", "مِنْ هَادٍ"],
  },
  lam_shamsiyyah: {
    id: "lam_shamsiyyah",
    nameArabic: "لام شَمْسِيَّة",
    nameEnglish: "Lam Shamsiyyah",
    color: "#ca8a04",
    bgColor: "rgba(202, 138, 4, 0.15)",
    description: {
      ar: "لام التعريف التي تُدغم في الحرف الشمسي بعدها",
      en: "The definite article Lam that merges into the following sun letter",
      ur: "وہ لام جو شمسی حرف میں مدغم ہو جائے",
    },
    examples: ["الشَّمْس", "النَّاس", "الرَّحْمَن"],
  },
  lam_qamariyyah: {
    id: "lam_qamariyyah",
    nameArabic: "لام قَمَرِيَّة",
    nameEnglish: "Lam Qamariyyah",
    color: "#0284c7",
    bgColor: "rgba(2, 132, 199, 0.15)",
    description: {
      ar: "لام التعريف التي تظهر عند الحروف القمرية",
      en: "The definite article Lam that is pronounced clearly before moon letters",
      ur: "وہ لام جو قمری حروف سے پہلے واضح ہو",
    },
    examples: ["الْقَمَر", "الْكِتَاب", "الْعَالَمِين"],
  },
  silent: {
    id: "silent",
    nameArabic: "سُكُون",
    nameEnglish: "Silent",
    color: "#64748b",
    bgColor: "rgba(100, 116, 139, 0.1)",
    description: {
      ar: "الحرف الساكن",
      en: "Silent letter",
      ur: "ساکن حرف",
    },
    examples: ["اْ", "وْ", "يْ"],
  },
  normal: {
    id: "normal",
    nameArabic: "عادي",
    nameEnglish: "Normal",
    color: "inherit",
    bgColor: "transparent",
    description: {
      ar: "نطق عادي",
      en: "Normal pronunciation",
      ur: "عام تلفظ",
    },
    examples: [],
  },
}

// Function to analyze a word and return tajweed markings
export function analyzeTajweed(word: string): Array<{ char: string; rule: TajweedRule }> {
  const result: Array<{ char: string; rule: TajweedRule }> = []

  // Qalqalah letters: ق ط ب ج د
  const qalqalahLetters = ["ق", "ط", "ب", "ج", "د"]

  // Ghunnah letters (noon and meem with shaddah)
  const ghunnahPattern = /[نم]ّ/

  // Madd letters
  const maddLetters = ["ا", "و", "ي"]

  // Sun letters for lam shamsiyyah
  const sunLetters = ["ت", "ث", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ل", "ن"]

  const chars = word.split("")

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]
    const nextChar = chars[i + 1]
    const prevChar = chars[i - 1]

    let rule: TajweedRule = "normal"

    // Check for Ghunnah (noon/meem with shaddah)
    if ((char === "ن" || char === "م") && nextChar === "ّ") {
      rule = "ghunnah"
    }
    // Check for Qalqalah
    else if (qalqalahLetters.includes(char) && (nextChar === "ْ" || i === chars.length - 1)) {
      rule = "qalqalah"
    }
    // Check for Madd
    else if (maddLetters.includes(char)) {
      // Check for madd muttasil (followed by hamza in same word)
      if (nextChar === "ء" || nextChar === "أ" || nextChar === "إ" || nextChar === "ئ" || nextChar === "ؤ") {
        rule = "madd_muttasil"
      } else if (["َ", "ُ", "ِ"].includes(prevChar || "")) {
        rule = "madd"
      }
    }
    // Check for Idgham (noon sakinah before specific letters)
    else if (char === "ن" && nextChar === "ْ") {
      const afterSukoon = chars[i + 2]
      if (["ي", "ر", "م", "ل", "و", "ن"].includes(afterSukoon)) {
        rule = "idgham"
      }
    }
    // Check for Ikhfa
    else if (char === "ن" && nextChar === "ْ") {
      const afterSukoon = chars[i + 2]
      const ikhfaLetters = ["ت", "ث", "ج", "د", "ذ", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ف", "ق", "ك"]
      if (ikhfaLetters.includes(afterSukoon)) {
        rule = "ikhfa"
      }
    }
    // Check for Iqlab (noon before ba)
    else if ((char === "ن" || char === "ٌ" || char === "ً" || char === "ٍ") && chars[i + 1] === "ب") {
      rule = "iqlab"
    }

    result.push({ char, rule })
  }

  return result
}

// Get CSS class for a tajweed rule
export function getTajweedClass(rule: TajweedRule): string {
  return `tajweed-${rule}`
}

// Get inline style for a tajweed rule
export function getTajweedStyle(rule: TajweedRule, showColors = true): React.CSSProperties {
  if (!showColors || rule === "normal") {
    return {}
  }

  const ruleInfo = TAJWEED_RULES[rule]
  return {
    color: ruleInfo.color,
    backgroundColor: ruleInfo.bgColor,
    borderRadius: "2px",
    padding: "0 1px",
  }
}
