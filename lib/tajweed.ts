import type React from "react"
// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Tajweed Rules and Color System
//
// This file defines 38 comprehensive Tajweed rules from basic to advanced levels.
//
// COLOR FAMILY DESIGN:
// Related rules share color families (same hue, varying saturation/lightness) to help
// learners understand relationships between parent and child rules. For example:
// - madd-red family: All Madd prolongation rules use red shades
// - qalqalah-blue family: All Qalqalah rules use blue shades
// - idgham-purple family: All Idgham rules use purple shades
//
// This pedagogical approach reduces cognitive load while maintaining clarity.
// Colors are distinct ACROSS rule categories but MAY be shared WITHIN families.
// See el-38h (Tajweed Color Palette Reference) for complete color specifications.

export type TajweedRule =
  // Basic Noon Sakinah and Tanween Rules
  | "ghunnah" // غنة - Nasal sound
  | "ikhfa" // إخفاء - Hiding
  | "idgham" // إدغام - Merging
  | "iqlab" // إقلاب - Conversion
  | "izhar" // إظهار - Clarity
  // Detailed Noon Sakinah Rules
  | "izhar_halqi" // إظهار حلقي - Throat clarity
  | "idgham_with_ghunnah" // إدغام بغنة - Merging with nasal
  | "idgham_without_ghunnah" // إدغام بلا غنة - Merging without nasal
  | "ikhfa_haqiqi" // إخفاء حقيقي - True hiding
  // Meem Sakinah Rules
  | "ikhfa_shafawi" // إخفاء شفوي - Labial hiding
  | "idgham_shafawi" // إدغام شفوي - Labial merging
  | "izhar_shafawi" // إظهار شفوي - Labial clarity
  // Qalqalah Rules
  | "qalqalah" // قلقلة - Echo
  | "qalqalah_sughra" // قلقلة صغرى - Minor echo
  | "qalqalah_kubra" // قلقلة كبرى - Major echo
  // Madd (Prolongation) Rules
  | "madd" // مد - Prolongation
  | "madd_tabii" // مد طبيعي - Natural prolongation
  | "madd_lazim" // مد لازم - Obligatory prolongation
  | "madd_muttasil" // مد متصل - Connected prolongation
  | "madd_munfasil" // مد منفصل - Separated prolongation
  | "madd_badal" // مد بدل - Substitute prolongation
  | "madd_arid" // مد عارض للسكون - Pause prolongation
  | "madd_leen" // مد لين - Soft prolongation
  | "madd_silah_sughra" // مد صلة صغرى - Minor connection
  | "madd_silah_kubra" // مد صلة كبرى - Major connection
  | "madd_iwad" // مد عوض - Compensation prolongation
  | "madd_tamkeen" // مد تمكين - Emphasis prolongation
  | "madd_farq" // مد فرق - Distinction prolongation
  // Ra Rules
  | "tafkheem" // تفخيم - Heavy/thick pronunciation
  | "tarqeeq" // ترقيق - Light/thin pronunciation
  // Lam Rules
  | "lam_shamsiyyah" // لام شمسية - Sun letter lam
  | "lam_qamariyyah" // لام قمرية - Moon letter lam
  | "lam_jalalah_tafkheem" // لام لفظ الجلالة تفخيم - Heavy Allah lam
  | "lam_jalalah_tarqeeq" // لام لفظ الجلالة ترقيق - Light Allah lam
  // Sifaat (Characteristics)
  | "istila" // استعلاء - Elevation
  | "istifal" // استفال - Lowering
  // Special States
  | "silent" // حرف ساكن - Silent
  | "normal" // عادي - Normal

export type TajweedDifficulty = "basic" | "intermediate" | "advanced"

export interface TajweedRuleInfo {
  id: TajweedRule
  nameArabic: string
  nameEnglish: string
  color: string
  bgColor: string
  description: Record<string, string>
  examples: string[]
  difficulty: TajweedDifficulty
  colorFamily?: string // Optional: groups related rules by color family (e.g., "madd-red", "qalqalah-blue")
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
    difficulty: "basic",
    colorFamily: "ghunnah-green",
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
    difficulty: "basic",
    colorFamily: "ikhfa-orange",
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
    difficulty: "basic",
    colorFamily: "idgham-purple",
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
    difficulty: "basic",
    colorFamily: "iqlab-cyan",
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
    difficulty: "basic",
    colorFamily: "izhar-lime",
  },
  izhar_halqi: {
    id: "izhar_halqi",
    nameArabic: "إِظْهَار حَلْقِي",
    nameEnglish: "Izhar Halqi",
    color: "#84cc16",
    bgColor: "rgba(132, 204, 22, 0.15)",
    description: {
      ar: "إظهار النون الساكنة أو التنوين عند أحد الحروف الستة الحلقية (ء ه ع ح غ خ)",
      en: "Clear pronunciation of Noon Sakinah or Tanween before the six throat letters",
      ur: "چھ حلقی حروف سے پہلے نون ساکنہ یا تنوین کا واضح اظہار",
    },
    examples: ["مِنْ عِلْمٍ", "مَنْ آمَنَ", "مِنْ هَادٍ", "يَنْأَوْنَ", "مِنْ غِلٍّ", "مِنْ خَيْرٍ"],
    difficulty: "intermediate",
    colorFamily: "izhar-lime",
  },
  idgham_with_ghunnah: {
    id: "idgham_with_ghunnah",
    nameArabic: "إِدْغَام بِغُنَّة",
    nameEnglish: "Idgham with Ghunnah",
    color: "#a855f7",
    bgColor: "rgba(168, 85, 247, 0.15)",
    description: {
      ar: "إدغام النون الساكنة أو التنوين في أحد حروف (ي ن م و) مع الغنة",
      en: "Merging Noon Sakinah or Tanween into letters ي ن م و with nasal sound",
      ur: "نون ساکنہ یا تنوین کو ینمو میں غنہ کے ساتھ ملانا",
    },
    examples: ["مِنْ يَوْمٍ", "مِنْ نَارٍ", "مِنْ مَالٍ", "مِنْ وَالٍ"],
    difficulty: "intermediate",
    colorFamily: "idgham-purple",
  },
  idgham_without_ghunnah: {
    id: "idgham_without_ghunnah",
    nameArabic: "إِدْغَام بِلَا غُنَّة",
    nameEnglish: "Idgham without Ghunnah",
    color: "#7c3aed",
    bgColor: "rgba(124, 58, 237, 0.15)",
    description: {
      ar: "إدغام النون الساكنة أو التنوين في اللام أو الراء بلا غنة",
      en: "Merging Noon Sakinah or Tanween into Lam or Ra without nasal sound",
      ur: "نون ساکنہ یا تنوین کو لام یا راء میں بغیر غنہ کے ملانا",
    },
    examples: ["مِنْ لَدُنْهُ", "مِنْ رَبِّهِمْ", "هُدًى لِلْمُتَّقِينَ"],
    difficulty: "intermediate",
    colorFamily: "idgham-purple",
  },
  ikhfa_haqiqi: {
    id: "ikhfa_haqiqi",
    nameArabic: "إِخْفَاء حَقِيقِي",
    nameEnglish: "Ikhfa Haqiqi",
    color: "#f97316",
    bgColor: "rgba(249, 115, 22, 0.15)",
    description: {
      ar: "إخفاء النون الساكنة أو التنوين عند أحد الحروف الخمسة عشر",
      en: "True hiding of Noon Sakinah or Tanween before 15 specific letters",
      ur: "پندرہ حروف سے پہلے نون ساکنہ یا تنوین کو چھپانا",
    },
    examples: ["مِنْ قَبْلِ", "أَنْتَ", "عَنْكَ", "مِنْ صَلْصَالٍ", "مِنْ طِينٍ"],
    difficulty: "intermediate",
    colorFamily: "ikhfa-orange",
  },
  ikhfa_shafawi: {
    id: "ikhfa_shafawi",
    nameArabic: "إِخْفَاء شَفَوِي",
    nameEnglish: "Ikhfa Shafawi",
    color: "#fb923c",
    bgColor: "rgba(251, 146, 60, 0.15)",
    description: {
      ar: "إخفاء الميم الساكنة عند الباء مع الغنة",
      en: "Hiding Meem Sakinah before Ba with nasal sound",
      ur: "میم ساکن کو باء سے پہلے غنہ کے ساتھ چھپانا",
    },
    examples: ["تَرْمِيهِمْ بِحِجَارَةٍ", "هُمْ بِهَا", "كَمْ بَعَثْنَا"],
    difficulty: "intermediate",
    colorFamily: "ikhfa-orange",
  },
  idgham_shafawi: {
    id: "idgham_shafawi",
    nameArabic: "إِدْغَام شَفَوِي",
    nameEnglish: "Idgham Shafawi",
    color: "#c026d3",
    bgColor: "rgba(192, 38, 211, 0.15)",
    description: {
      ar: "إدغام الميم الساكنة في الميم المتحركة مع الغنة",
      en: "Merging Meem Sakinah into Meem with nasal sound",
      ur: "میم ساکن کو میم متحرک میں غنہ کے ساتھ ملانا",
    },
    examples: ["لَهُمْ مَا", "كَمْ مِنْ", "أَمْ مَنْ"],
    difficulty: "intermediate",
    colorFamily: "idgham-purple",
  },
  izhar_shafawi: {
    id: "izhar_shafawi",
    nameArabic: "إِظْهَار شَفَوِي",
    nameEnglish: "Izhar Shafawi",
    color: "#a3e635",
    bgColor: "rgba(163, 230, 53, 0.15)",
    description: {
      ar: "إظهار الميم الساكنة عند باقي الحروف",
      en: "Clear pronunciation of Meem Sakinah before other letters",
      ur: "میم ساکن کو دیگر حروف سے پہلے واضح پڑھنا",
    },
    examples: ["هُمْ فِيهَا", "عَلَيْهِمْ وَلَا", "لَهُمْ عَذَابٌ"],
    difficulty: "intermediate",
    colorFamily: "izhar-lime",
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
    difficulty: "basic",
    colorFamily: "qalqalah-blue",
  },
  qalqalah_sughra: {
    id: "qalqalah_sughra",
    nameArabic: "قَلْقَلَة صُغْرَى",
    nameEnglish: "Qalqalah Sughra",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.15)",
    description: {
      ar: "القلقلة الصغرى عند الوصل في وسط الكلمة أو آخرها",
      en: "Minor Qalqalah when continuing in the middle or end of a word",
      ur: "چھوٹا قلقلہ جب لفظ کے درمیان یا آخر میں ملایا جائے",
    },
    examples: ["يَقْطَعُونَ", "أَجْرٌ", "مِنْ قَبْلِ"],
    difficulty: "intermediate",
    colorFamily: "qalqalah-blue",
  },
  qalqalah_kubra: {
    id: "qalqalah_kubra",
    nameArabic: "قَلْقَلَة كُبْرَى",
    nameEnglish: "Qalqalah Kubra",
    color: "#1d4ed8",
    bgColor: "rgba(29, 78, 216, 0.15)",
    description: {
      ar: "القلقلة الكبرى عند الوقف على حرف القلقلة",
      en: "Major Qalqalah when stopping on a Qalqalah letter",
      ur: "بڑا قلقلہ جب قلقلہ حرف پر وقف کیا جائے",
    },
    examples: ["الْفَلَقْ", "وَتَبَّ", "الْحَقّ"],
    difficulty: "intermediate",
    colorFamily: "qalqalah-blue",
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
    difficulty: "basic",
    colorFamily: "madd-red",
  },
  madd_tabii: {
    id: "madd_tabii",
    nameArabic: "مَدّ طَبِيعِي",
    nameEnglish: "Madd Tabii",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.15)",
    description: {
      ar: "المد الطبيعي بمقدار حركتين، لا يتوقف على سبب",
      en: "Natural prolongation of 2 counts, not dependent on any cause",
      ur: "قدرتی مد دو حرکات کا، کسی سبب پر منحصر نہیں",
    },
    examples: ["قَالَ", "يَقُولُ", "قِيلَ", "نُوحِيهَا"],
    difficulty: "basic",
    colorFamily: "madd-red",
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
    difficulty: "intermediate",
    colorFamily: "madd-red",
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
    difficulty: "basic",
    colorFamily: "madd-red",
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
    difficulty: "basic",
    colorFamily: "madd-red",
  },
  madd_badal: {
    id: "madd_badal",
    nameArabic: "مَدّ بَدَل",
    nameEnglish: "Madd Badal",
    color: "#fb7185",
    bgColor: "rgba(251, 113, 133, 0.15)",
    description: {
      ar: "المد البدل بمقدار حركتين عند إبدال الهمزة بحرف مد",
      en: "Substitute prolongation of 2 counts when Hamza is replaced by Madd letter",
      ur: "بدل کا مد دو حرکات جب ہمزہ مد میں بدلا جائے",
    },
    examples: ["آمَنَ", "إِيمَانًا", "أُوتُوا"],
    difficulty: "intermediate",
    colorFamily: "madd-red",
  },
  madd_arid: {
    id: "madd_arid",
    nameArabic: "مَدّ عَارِض لِلسُّكُون",
    nameEnglish: "Madd Arid Lissukoon",
    color: "#fda4af",
    bgColor: "rgba(253, 164, 175, 0.15)",
    description: {
      ar: "المد العارض للسكون بمقدار 2 أو 4 أو 6 حركات عند الوقف",
      en: "Prolongation due to pause of 2, 4, or 6 counts when stopping",
      ur: "وقف کی وجہ سے 2، 4، یا 6 حرکات کا مد",
    },
    examples: ["الْعَالَمِينَ", "نَسْتَعِينُ", "الرَّحِيمِ"],
    difficulty: "intermediate",
    colorFamily: "madd-red",
  },
  madd_leen: {
    id: "madd_leen",
    nameArabic: "مَدّ لِين",
    nameEnglish: "Madd Leen",
    color: "#fecdd3",
    bgColor: "rgba(254, 205, 211, 0.15)",
    description: {
      ar: "المد اللين بمقدار 2 أو 4 أو 6 حركات عند الوقف على واو أوياء ساكنتين مفتوح ما قبلهما",
      en: "Soft prolongation of 2, 4, or 6 counts when stopping on Waw or Ya with Fatha before",
      ur: "نرم مد 2، 4، یا 6 حرکات جب واو یا یاء ساکن پر وقف ہو",
    },
    examples: ["خَوْفٌ", "بَيْتٍ", "الصَّيْفِ"],
    difficulty: "advanced",
    colorFamily: "madd-red",
  },
  madd_silah_sughra: {
    id: "madd_silah_sughra",
    nameArabic: "مَدّ صِلَة صُغْرَى",
    nameEnglish: "Madd Silah Sughra",
    color: "#f87171",
    bgColor: "rgba(248, 113, 113, 0.15)",
    description: {
      ar: "مد الصلة الصغرى بمقدار حركتين في هاء الضمير",
      en: "Minor connection prolongation of 2 counts in pronoun Ha",
      ur: "ضمیر کی ہاء میں چھوٹا صلہ دو حرکات",
    },
    examples: ["بِهِ مُؤْمِنُونَ", "لَهُ مَا", "إِنَّهُ كَانَ"],
    difficulty: "advanced",
    colorFamily: "madd-red",
  },
  madd_silah_kubra: {
    id: "madd_silah_kubra",
    nameArabic: "مَدّ صِلَة كُبْرَى",
    nameEnglish: "Madd Silah Kubra",
    color: "#dc2626",
    bgColor: "rgba(220, 38, 38, 0.2)",
    description: {
      ar: "مد الصلة الكبرى عند وجود همزة بعد هاء الضمير",
      en: "Major connection prolongation when Hamza follows pronoun Ha",
      ur: "بڑا صلہ جب ضمیر کی ہاء کے بعد ہمزہ آئے",
    },
    examples: ["مَالَهُ أَخْلَدَهُ", "إِنَّهُ أَنَا"],
    difficulty: "advanced",
    colorFamily: "madd-red",
  },
  madd_iwad: {
    id: "madd_iwad",
    nameArabic: "مَدّ عِوَض",
    nameEnglish: "Madd Iwad",
    color: "#fca5a5",
    bgColor: "rgba(252, 165, 165, 0.15)",
    description: {
      ar: "مد العوض بمقدار حركتين عند الوقف على التنوين المنصوب",
      en: "Compensation prolongation of 2 counts when stopping on Tanween Fatha",
      ur: "تنوین فتحہ پر وقف کرتے وقت دو حرکات کا عوض مد",
    },
    examples: ["عَلِيمًا", "حَكِيمًا", "غَفُورًا"],
    difficulty: "advanced",
    colorFamily: "madd-red",
  },
  madd_tamkeen: {
    id: "madd_tamkeen",
    nameArabic: "مَدّ تَمْكِين",
    nameEnglish: "Madd Tamkeen",
    color: "#b91c1c",
    bgColor: "rgba(185, 28, 28, 0.15)",
    description: {
      ar: "مد التمكين عند اجتماع ياءين الأولى مشددة والثانية ساكنة",
      en: "Emphasis prolongation when two Ya letters meet, first with Shaddah, second silent",
      ur: "تمکین کا مد جب دو یاء ملیں پہلی مشدد اور دوسری ساکن",
    },
    examples: ["النَّبِيِّينَ", "حُيِّيتُم"],
    difficulty: "advanced",
    colorFamily: "madd-red",
  },
  madd_farq: {
    id: "madd_farq",
    nameArabic: "مَدّ فَرْق",
    nameEnglish: "Madd Farq",
    color: "#991b1b",
    bgColor: "rgba(153, 27, 27, 0.15)",
    description: {
      ar: "مد الفرق ست حركات للتفريق بين الاستفهام والخبر",
      en: "Distinction prolongation of 6 counts to differentiate between question and statement",
      ur: "فرق کا مد چھ حرکات سوال اور خبر میں فرق کے لیے",
    },
    examples: ["آلذَّكَرَيْنِ", "آللَّهُ", "آلْآنَ"],
    difficulty: "advanced",
    colorFamily: "madd-red",
  },
  tafkheem: {
    id: "tafkheem",
    nameArabic: "تَفْخِيم",
    nameEnglish: "Tafkheem",
    color: "#b45309",
    bgColor: "rgba(180, 83, 9, 0.15)",
    description: {
      ar: "التفخيم هو تسمين صوت الحرف عند النطق به",
      en: "Thick or heavy pronunciation of the letter Ra",
      ur: "راء کو موٹا یا بھاری تلفظ کرنا",
    },
    examples: ["رَبِّ", "رَحْمَة", "قُرْآن"],
    difficulty: "intermediate",
    colorFamily: "ra-brown",
  },
  tarqeeq: {
    id: "tarqeeq",
    nameArabic: "تَرْقِيق",
    nameEnglish: "Tarqeeq",
    color: "#06b6d4",
    bgColor: "rgba(6, 182, 212, 0.15)",
    description: {
      ar: "الترقيق هو نحول صوت الحرف عند النطق به",
      en: "Thin or light pronunciation of the letter Ra",
      ur: "راء کو باریک یا ہلکا تلفظ کرنا",
    },
    examples: ["فِرْعَوْن", "مِرْيَة", "الْخَيْر"],
    difficulty: "intermediate",
    colorFamily: "ra-cyan",
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
    difficulty: "basic",
    colorFamily: "lam-yellow",
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
    difficulty: "basic",
    colorFamily: "lam-sky",
  },
  lam_jalalah_tafkheem: {
    id: "lam_jalalah_tafkheem",
    nameArabic: "لام لَفْظ الجَلَالَة - تَفْخِيم",
    nameEnglish: "Lam Lafdhul Jalalah - Tafkheem",
    color: "#92400e",
    bgColor: "rgba(146, 64, 14, 0.15)",
    description: {
      ar: "تفخيم لام لفظ الجلالة (الله) إذا سبقها فتح أو ضم",
      en: "Heavy pronunciation of Lam in Allah's name when preceded by Fatha or Damma",
      ur: "اللہ کے لفظ میں لام کو بھاری پڑھنا جب فتحہ یا ضمہ سے پہلے ہو",
    },
    examples: ["قَالَ اللَّهُ", "عَبْدُ اللَّهِ", "رَسُولُ اللَّهِ"],
    difficulty: "intermediate",
    colorFamily: "lam-jalalah-brown",
  },
  lam_jalalah_tarqeeq: {
    id: "lam_jalalah_tarqeeq",
    nameArabic: "لام لَفْظ الجَلَالَة - تَرْقِيق",
    nameEnglish: "Lam Lafdhul Jalalah - Tarqeeq",
    color: "#0369a1",
    bgColor: "rgba(3, 105, 161, 0.15)",
    description: {
      ar: "ترقيق لام لفظ الجلالة (الله) إذا سبقها كسر",
      en: "Light pronunciation of Lam in Allah's name when preceded by Kasra",
      ur: "اللہ کے لفظ میں لام کو باریک پڑھنا جب کسرہ سے پہلے ہو",
    },
    examples: ["بِسْمِ اللَّهِ", "عَبْدِ اللَّهِ"],
    difficulty: "intermediate",
    colorFamily: "lam-jalalah-blue",
  },
  istila: {
    id: "istila",
    nameArabic: "اِسْتِعْلَاء",
    nameEnglish: "Isti'la",
    color: "#d97706",
    bgColor: "rgba(217, 119, 6, 0.15)",
    description: {
      ar: "صفة الاستعلاء وهي ارتفاع اللسان إلى الحنك الأعلى (خ ص ض غ ط ق ظ)",
      en: "Elevation characteristic - raising the tongue to the upper palate",
      ur: "بلندی کی صفت - زبان کو اوپری تالو کی طرف اٹھانا",
    },
    examples: ["خَالِق", "صَادِق", "ضَالِّين", "غَفُور", "طَيِّب", "قَوِيّ", "ظَالِم"],
    difficulty: "advanced",
    colorFamily: "sifaat-amber",
  },
  istifal: {
    id: "istifal",
    nameArabic: "اِسْتِفَال",
    nameEnglish: "Istifal",
    color: "#0ea5e9",
    bgColor: "rgba(14, 165, 233, 0.15)",
    description: {
      ar: "صفة الاستفال وهي انخفاض اللسان إلى قاع الفم",
      en: "Lowering characteristic - lowering the tongue to the bottom of the mouth",
      ur: "پستی کی صفت - زبان کو منہ کی تہہ کی طرف نیچے کرنا",
    },
    examples: ["بَاب", "تَاب", "ثَوَاب", "جَنَّة", "دَار"],
    difficulty: "advanced",
    colorFamily: "sifaat-sky",
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
    difficulty: "basic",
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
    difficulty: "basic",
  },
}

// ============================================================================
// HELPER FUNCTIONS FOR TAJWEED DETECTION
// ============================================================================

/**
 * Checks if a character is one of the six throat letters (حروف حلقية)
 * Used for Izhar Halqi detection
 */
export function isThroatLetter(char: string): boolean {
  return ["ء", "أ", "إ", "آ", "ؤ", "ئ", "ه", "ع", "ح", "غ", "خ"].includes(char)
}

/**
 * Checks if a character is a sun letter (حرف شمسي)
 * Sun letters cause the lam of "ال" to be assimilated
 */
export function isSunLetter(char: string): boolean {
  return ["ت", "ث", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ل", "ن"].includes(char)
}

/**
 * Checks if a character is a moon letter (حرف قمري)
 * Moon letters allow the lam of "ال" to be pronounced clearly
 */
export function isMoonLetter(char: string): boolean {
  return ["ا", "ب", "ج", "ح", "خ", "ع", "غ", "ف", "ق", "ك", "م", "ه", "و", "ي"].includes(char)
}

/**
 * Gets the vowel (haraka) before a character at the given index
 * Returns the vowel character or null if none found
 */
export function getVowelBefore(chars: string[], index: number): string | null {
  if (index <= 0) return null
  const prevChar = chars[index - 1]
  if (["َ", "ُ", "ِ", "ّ", "ْ", "ً", "ٌ", "ٍ"].includes(prevChar)) {
    return prevChar
  }
  // Check two positions back for vowel after letter
  if (index >= 2 && ["َ", "ُ", "ِ", "ّ", "ْ", "ً", "ٌ", "ٍ"].includes(chars[index - 2])) {
    return chars[index - 2]
  }
  return null
}

/**
 * Gets the vowel (haraka) after a character at the given index
 * Returns the vowel character or null if none found
 */
export function getVowelAfter(chars: string[], index: number): string | null {
  if (index >= chars.length - 1) return null
  const nextChar = chars[index + 1]
  if (["َ", "ُ", "ِ", "ّ", "ْ", "ً", "ٌ", "ٍ"].includes(nextChar)) {
    return nextChar
  }
  return null
}

/**
 * Checks if the character at the given index is at the end of a word
 * Considers diacritics when determining word end
 */
export function isWordEnd(chars: string[], index: number): boolean {
  // If it's the last character, it's word end
  if (index === chars.length - 1) return true

  // Check if only diacritics follow
  for (let i = index + 1; i < chars.length; i++) {
    const char = chars[i]
    // If we find a non-diacritic, it's not word end
    if (!["َ", "ُ", "ِ", "ّ", "ْ", "ً", "ٌ", "ٍ", "ٓ", "ٰ", "ٔ", "ٕ"].includes(char)) {
      return false
    }
  }
  return true
}

/**
 * Checks if a character is a Qalqalah letter (ق ط ب ج د)
 */
function isQalqalahLetter(char: string): boolean {
  return ["ق", "ط", "ب", "ج", "د"].includes(char)
}

/**
 * Checks if a character is a Madd letter (ا و ي)
 */
function isMaddLetter(char: string): boolean {
  return ["ا", "و", "ي"].includes(char)
}

/**
 * Checks if a character is any form of Hamza
 */
function isHamza(char: string): boolean {
  return ["ء", "أ", "إ", "آ", "ؤ", "ئ"].includes(char)
}

/**
 * Checks if a character is Noon (ن)
 */
function isNoon(char: string): boolean {
  return char === "ن"
}

/**
 * Checks if a character is Meem (م)
 */
function isMeem(char: string): boolean {
  return char === "م"
}

/**
 * Checks if a character is Tanween (تنوين)
 */
function isTanween(char: string): boolean {
  return ["ً", "ٌ", "ٍ"].includes(char)
}

/**
 * Checks if a character is Sukoon (ْ)
 */
function isSukoon(char: string): boolean {
  return char === "ْ"
}

/**
 * Checks if a character is Shaddah (ّ)
 */
function isShaddah(char: string): boolean {
  return char === "ّ"
}

/**
 * Checks if a character is Fatha (َ)
 */
function isFatha(char: string): boolean {
  return char === "َ" || char === "ً"
}

/**
 * Checks if a character is Kasra (ِ)
 */
function isKasra(char: string): boolean {
  return char === "ِ" || char === "ٍ"
}

/**
 * Checks if a character is Damma (ُ)
 */
function isDamma(char: string): boolean {
  return char === "ُ" || char === "ٌ"
}

/**
 * Gets the 15 letters for Ikhfa Haqiqi
 */
function getIkhfaLetters(): string[] {
  return ["ت", "ث", "ج", "د", "ذ", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ف", "ق", "ك"]
}

/**
 * Gets the letters for Idgham with Ghunnah (ينمو)
 */
function getIdghamWithGhunnahLetters(): string[] {
  return ["ي", "ن", "م", "و"]
}

/**
 * Gets the letters for Idgham without Ghunnah (ل ر)
 */
function getIdghamWithoutGhunnahLetters(): string[] {
  return ["ل", "ر"]
}

/**
 * Checks if the word is "Allah" (الله)
 */
function isAllahName(chars: string[], index: number): boolean {
  // Look for pattern: ا ل ل ه
  if (index < 1 || index > chars.length - 2) return false

  // Check if we're at the lam position in Allah
  if (chars[index] === "ل" && chars[index - 1] === "ا" && chars[index + 1] === "ل") {
    // Look ahead for ه
    for (let i = index + 2; i < Math.min(index + 5, chars.length); i++) {
      if (chars[i] === "ه") return true
    }
  }
  return false
}

// ============================================================================
// ENHANCED TAJWEED ANALYSIS WITH METADATA
// ============================================================================

export interface TajweedAnalysisResult {
  char: string
  rule: TajweedRule
  priority: number // Higher priority rules override lower ones
  difficulty: TajweedDifficulty
  description?: string
  maddCount?: number // For Madd rules: 2, 4, or 6 counts
}

/**
 * Enhanced Tajweed analysis function with context-aware detection
 * Detects 30+ Tajweed rules with accurate pattern matching
 *
 * @param word - The Arabic word to analyze
 * @param isWordAtPause - Whether this word is at a pause/stop position (for Qalqalah Kubra)
 * @returns Array of analysis results with metadata
 */
export function analyzeTajweed(
  word: string,
  isWordAtPause = false
): TajweedAnalysisResult[] {
  const result: TajweedAnalysisResult[] = []
  const chars = word.split("")

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]
    const nextChar = chars[i + 1]
    const prevChar = chars[i - 1]
    const vowelAfter = getVowelAfter(chars, i)
    const vowelBefore = getVowelBefore(chars, i)

    let rule: TajweedRule = "normal"
    let priority = 0
    let difficulty: TajweedDifficulty = "basic"
    let description: string | undefined
    let maddCount: number | undefined

    // ========================================================================
    // PRIORITY 10: Ghunnah (Noon/Meem with Shaddah)
    // ========================================================================
    if ((isNoon(char) || isMeem(char)) && isShaddah(vowelAfter || "")) {
      rule = "ghunnah"
      priority = 10
      difficulty = "basic"
      description = "Nasal sound with emphasis"
    }

    // ========================================================================
    // PRIORITY 9: Noon Sakinah and Tanween Rules
    // ========================================================================
    else if (isNoon(char) && isSukoon(vowelAfter || "")) {
      // Noon Sakinah - check what follows
      const afterSukoon = chars[i + 2]

      if (afterSukoon && isThroatLetter(afterSukoon)) {
        // Izhar Halqi - clear pronunciation before throat letters
        rule = "izhar_halqi"
        priority = 9
        difficulty = "intermediate"
        description = "Clear pronunciation before throat letter"
      } else if (afterSukoon && getIdghamWithGhunnahLetters().includes(afterSukoon)) {
        // Idgham with Ghunnah (ينمو)
        rule = "idgham_with_ghunnah"
        priority = 9
        difficulty = "intermediate"
        description = "Merge with nasal sound"
      } else if (afterSukoon && getIdghamWithoutGhunnahLetters().includes(afterSukoon)) {
        // Idgham without Ghunnah (ل ر)
        rule = "idgham_without_ghunnah"
        priority = 9
        difficulty = "intermediate"
        description = "Merge without nasal sound"
      } else if (afterSukoon === "ب") {
        // Iqlab - convert to Meem before Ba
        rule = "iqlab"
        priority = 9
        difficulty = "basic"
        description = "Convert to hidden Meem"
      } else if (afterSukoon && getIkhfaLetters().includes(afterSukoon)) {
        // Ikhfa Haqiqi - hide before 15 letters
        rule = "ikhfa_haqiqi"
        priority = 9
        difficulty = "intermediate"
        description = "Hide with nasal sound"
      }
    }
    // Tanween rules (similar to Noon Sakinah)
    else if (isTanween(char)) {
      const nextLetter = chars[i + 1]

      if (nextLetter && isThroatLetter(nextLetter)) {
        rule = "izhar_halqi"
        priority = 9
        difficulty = "intermediate"
      } else if (nextLetter && getIdghamWithGhunnahLetters().includes(nextLetter)) {
        rule = "idgham_with_ghunnah"
        priority = 9
        difficulty = "intermediate"
      } else if (nextLetter && getIdghamWithoutGhunnahLetters().includes(nextLetter)) {
        rule = "idgham_without_ghunnah"
        priority = 9
        difficulty = "intermediate"
      } else if (nextLetter === "ب") {
        rule = "iqlab"
        priority = 9
        difficulty = "basic"
      } else if (nextLetter && getIkhfaLetters().includes(nextLetter)) {
        rule = "ikhfa_haqiqi"
        priority = 9
        difficulty = "intermediate"
      }
    }

    // ========================================================================
    // PRIORITY 8: Meem Sakinah Rules
    // ========================================================================
    else if (isMeem(char) && isSukoon(vowelAfter || "")) {
      const afterSukoon = chars[i + 2]

      if (afterSukoon === "ب") {
        // Ikhfa Shafawi - hide before Ba
        rule = "ikhfa_shafawi"
        priority = 8
        difficulty = "intermediate"
        description = "Labial hiding before Ba"
      } else if (afterSukoon === "م") {
        // Idgham Shafawi - merge into Meem
        rule = "idgham_shafawi"
        priority = 8
        difficulty = "intermediate"
        description = "Labial merging"
      } else if (afterSukoon) {
        // Izhar Shafawi - clear before other letters
        rule = "izhar_shafawi"
        priority = 8
        difficulty = "intermediate"
        description = "Clear labial pronunciation"
      }
    }

    // ========================================================================
    // PRIORITY 7: Qalqalah (Echo sound on ق ط ب ج د)
    // ========================================================================
    else if (isQalqalahLetter(char) && isSukoon(vowelAfter || "")) {
      const atWordEnd = isWordEnd(chars, i)

      if (atWordEnd && isWordAtPause) {
        // Qalqalah Kubra - major echo at pause
        rule = "qalqalah_kubra"
        priority = 7
        difficulty = "intermediate"
        description = "Major echo at pause"
      } else if (atWordEnd || isSukoon(vowelAfter || "")) {
        // Qalqalah Sughra - minor echo
        rule = "qalqalah_sughra"
        priority = 7
        difficulty = "intermediate"
        description = "Minor echo"
      } else {
        // Generic Qalqalah
        rule = "qalqalah"
        priority = 7
        difficulty = "basic"
      }
    }

    // ========================================================================
    // PRIORITY 6: Madd (Prolongation) Rules
    // ========================================================================
    else if (isMaddLetter(char)) {
      // Check for various Madd types
      const beforeVowel = vowelBefore
      const afterChar = nextChar

      // Madd Lazim - 6 counts (original sukoon after Madd)
      if (isSukoon(vowelAfter || "") && !isWordEnd(chars, i)) {
        rule = "madd_lazim"
        priority = 6
        difficulty = "intermediate"
        maddCount = 6
        description = "Obligatory prolongation (6 counts)"
      }
      // Madd Muttasil - 4-5 counts (Hamza in same word)
      else if (afterChar && isHamza(afterChar)) {
        rule = "madd_muttasil"
        priority = 6
        difficulty = "basic"
        maddCount = 4
        description = "Connected prolongation (4-5 counts)"
      }
      // Madd Badal - 2 counts (Hamza before Madd letter)
      else if (i >= 2 && isHamza(chars[i - 2])) {
        rule = "madd_badal"
        priority = 6
        difficulty = "intermediate"
        maddCount = 2
        description = "Substitute prolongation (2 counts)"
      }
      // Madd Arid Lissukoon - 2,4,6 counts (pause after Madd)
      else if (isWordEnd(chars, i) && isWordAtPause) {
        rule = "madd_arid"
        priority = 6
        difficulty = "intermediate"
        maddCount = 2 // Can be 2, 4, or 6
        description = "Pause prolongation (2, 4, or 6 counts)"
      }
      // Madd Leen - soft prolongation (و or ي with Fatha before)
      else if ((char === "و" || char === "ي") && isFatha(beforeVowel || "") && isWordEnd(chars, i)) {
        rule = "madd_leen"
        priority = 6
        difficulty = "advanced"
        maddCount = 2
        description = "Soft prolongation (2, 4, or 6 counts)"
      }
      // Madd Tabii - 2 counts (natural prolongation)
      else if (beforeVowel && (isFatha(beforeVowel) || isDamma(beforeVowel) || isKasra(beforeVowel))) {
        rule = "madd_tabii"
        priority = 6
        difficulty = "basic"
        maddCount = 2
        description = "Natural prolongation (2 counts)"
      }
      // Generic Madd
      else if (beforeVowel) {
        rule = "madd"
        priority = 5
        difficulty = "basic"
        maddCount = 2
      }
    }

    // ========================================================================
    // PRIORITY 5: Ra Rules (Tafkheem/Tarqeeq)
    // ========================================================================
    else if (char === "ر") {
      const beforeVowel = vowelBefore
      const afterVowel = vowelAfter

      // Tafkheem (heavy) - after Fatha or Damma, or with Fatha/Damma
      if (isFatha(afterVowel || "") || isDamma(afterVowel || "") ||
          isFatha(beforeVowel || "") || isDamma(beforeVowel || "")) {
        rule = "tafkheem"
        priority = 5
        difficulty = "intermediate"
        description = "Heavy pronunciation"
      }
      // Tarqeeq (light) - after Kasra or with Kasra
      else if (isKasra(afterVowel || "") || isKasra(beforeVowel || "")) {
        rule = "tarqeeq"
        priority = 5
        difficulty = "intermediate"
        description = "Light pronunciation"
      }
    }

    // ========================================================================
    // PRIORITY 4: Lam Rules
    // ========================================================================
    else if (char === "ل") {
      // Check for Allah's name (لفظ الجلالة)
      if (isAllahName(chars, i)) {
        const beforeVowel = vowelBefore

        if (isFatha(beforeVowel || "") || isDamma(beforeVowel || "")) {
          rule = "lam_jalalah_tafkheem"
          priority = 4
          difficulty = "intermediate"
          description = "Heavy Lam in Allah's name"
        } else if (isKasra(beforeVowel || "")) {
          rule = "lam_jalalah_tarqeeq"
          priority = 4
          difficulty = "intermediate"
          description = "Light Lam in Allah's name"
        }
      }
      // Check for Alif-Lam (ال) - definite article
      else if (prevChar === "ا" && nextChar) {
        if (isSunLetter(nextChar)) {
          rule = "lam_shamsiyyah"
          priority = 4
          difficulty = "basic"
          description = "Sun letter Lam (assimilated)"
        } else if (isMoonLetter(nextChar)) {
          rule = "lam_qamariyyah"
          priority = 4
          difficulty = "basic"
          description = "Moon letter Lam (pronounced)"
        }
      }
    }

    // ========================================================================
    // PRIORITY 3: Sifaat (Characteristics)
    // ========================================================================
    // Isti'la letters (استعلاء) - خ ص ض غ ط ق ظ
    else if (["خ", "ص", "ض", "غ", "ط", "ق", "ظ"].includes(char)) {
      rule = "istila"
      priority = 3
      difficulty = "advanced"
      description = "Elevation characteristic"
    }
    // Most other letters have Istifal (استفال)
    else if (priority === 0 && /[؀-ۿ]/.test(char) && !["َ", "ُ", "ِ", "ّ", "ْ", "ً", "ٌ", "ٍ"].includes(char)) {
      // Only apply if no other rule matched
      rule = "istifal"
      priority = 2
      difficulty = "advanced"
      description = "Lowering characteristic"
    }

    // ========================================================================
    // PRIORITY 1: Silent/Sukoon
    // ========================================================================
    if (isSukoon(char)) {
      rule = "silent"
      priority = 1
      difficulty = "basic"
    }

    // Build result object
    const analysisResult: TajweedAnalysisResult = {
      char,
      rule,
      priority,
      difficulty,
    }

    if (description) analysisResult.description = description
    if (maddCount) analysisResult.maddCount = maddCount

    result.push(analysisResult)
  }

  return result
}

// ============================================================================
// BACKWARD COMPATIBILITY
// ============================================================================

/**
 * Legacy function signature for backward compatibility
 * Returns simplified result format without metadata
 */
export function analyzeTajweedSimple(word: string): Array<{ char: string; rule: TajweedRule }> {
  const enhanced = analyzeTajweed(word)
  return enhanced.map(({ char, rule }) => ({ char, rule }))
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
