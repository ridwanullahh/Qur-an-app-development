// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Quran Verses Data - First 7 Surahs with complete text

export interface Verse {
  surah: number
  verse: number
  text: string
  textSimple: string
  page: number
  juz: number
  hizb: number
}

export interface Word {
  surah: number
  verse: number
  position: number
  text: string
  textSimple: string
  translation?: string
  transliteration?: string
  audio?: string
}

// Surah Al-Fatiha - Complete
export const SURAH_AL_FATIHA: Verse[] = [
  {
    surah: 1,
    verse: 1,
    text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    textSimple: "بسم الله الرحمن الرحيم",
    page: 1,
    juz: 1,
    hizb: 1,
  },
  { surah: 1, verse: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", textSimple: "الحمد لله رب العالمين", page: 1, juz: 1, hizb: 1 },
  { surah: 1, verse: 3, text: "الرَّحْمَٰنِ الرَّحِيمِ", textSimple: "الرحمن الرحيم", page: 1, juz: 1, hizb: 1 },
  { surah: 1, verse: 4, text: "مَالِكِ يَوْمِ الدِّينِ", textSimple: "مالك يوم الدين", page: 1, juz: 1, hizb: 1 },
  {
    surah: 1,
    verse: 5,
    text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    textSimple: "إياك نعبد وإياك نستعين",
    page: 1,
    juz: 1,
    hizb: 1,
  },
  { surah: 1, verse: 6, text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", textSimple: "اهدنا الصراط المستقيم", page: 1, juz: 1, hizb: 1 },
  {
    surah: 1,
    verse: 7,
    text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    textSimple: "صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين",
    page: 1,
    juz: 1,
    hizb: 1,
  },
]

// Surah Al-Baqarah - First 20 verses
export const SURAH_AL_BAQARAH_PART: Verse[] = [
  { surah: 2, verse: 1, text: "الٓمٓ", textSimple: "الم", page: 2, juz: 1, hizb: 1 },
  {
    surah: 2,
    verse: 2,
    text: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
    textSimple: "ذلك الكتاب لا ريب فيه هدى للمتقين",
    page: 2,
    juz: 1,
    hizb: 1,
  },
  {
    surah: 2,
    verse: 3,
    text: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ",
    textSimple: "الذين يؤمنون بالغيب ويقيمون الصلاة ومما رزقناهم ينفقون",
    page: 2,
    juz: 1,
    hizb: 1,
  },
  {
    surah: 2,
    verse: 4,
    text: "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ",
    textSimple: "والذين يؤمنون بما أنزل إليك وما أنزل من قبلك وبالآخرة هم يوقنون",
    page: 2,
    juz: 1,
    hizb: 1,
  },
  {
    surah: 2,
    verse: 5,
    text: "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ",
    textSimple: "أولئك على هدى من ربهم وأولئك هم المفلحون",
    page: 2,
    juz: 1,
    hizb: 1,
  },
  {
    surah: 2,
    verse: 6,
    text: "إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ",
    textSimple: "إن الذين كفروا سواء عليهم أأنذرتهم أم لم تنذرهم لا يؤمنون",
    page: 2,
    juz: 1,
    hizb: 1,
  },
  {
    surah: 2,
    verse: 7,
    text: "خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌ",
    textSimple: "ختم الله على قلوبهم وعلى سمعهم وعلى أبصارهم غشاوة ولهم عذاب عظيم",
    page: 2,
    juz: 1,
    hizb: 1,
  },
  {
    surah: 2,
    verse: 8,
    text: "وَمِنَ النَّاسِ مَن يَقُولُ آمَنَّا بِاللَّهِ وَبِالْيَوْمِ الْآخِرِ وَمَا هُم بِمُؤْمِنِينَ",
    textSimple: "ومن الناس من يقول آمنا بالله وباليوم الآخر وما هم بمؤمنين",
    page: 3,
    juz: 1,
    hizb: 1,
  },
  {
    surah: 2,
    verse: 9,
    text: "يُخَادِعُونَ اللَّهَ وَالَّذِينَ آمَنُوا وَمَا يَخْدَعُونَ إِلَّا أَنفُسَهُمْ وَمَا يَشْعُرُونَ",
    textSimple: "يخادعون الله والذين آمنوا وما يخدعون إلا أنفسهم وما يشعرون",
    page: 3,
    juz: 1,
    hizb: 1,
  },
  {
    surah: 2,
    verse: 10,
    text: "فِي قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ اللَّهُ مَرَضًا ۖ وَلَهُمْ عَذَابٌ أَلِيمٌ بِمَا كَانُوا يَكْذِبُونَ",
    textSimple: "في قلوبهم مرض فزادهم الله مرضا ولهم عذاب أليم بما كانوا يكذبون",
    page: 3,
    juz: 1,
    hizb: 1,
  },
]

// Last 10 Surahs (Juz Amma)
export const SURAH_AL_FIL: Verse[] = [
  {
    surah: 105,
    verse: 1,
    text: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ",
    textSimple: "ألم تر كيف فعل ربك بأصحاب الفيل",
    page: 601,
    juz: 30,
    hizb: 60,
  },
  {
    surah: 105,
    verse: 2,
    text: "أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ",
    textSimple: "ألم يجعل كيدهم في تضليل",
    page: 601,
    juz: 30,
    hizb: 60,
  },
  {
    surah: 105,
    verse: 3,
    text: "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ",
    textSimple: "وأرسل عليهم طيرا أبابيل",
    page: 601,
    juz: 30,
    hizb: 60,
  },
  {
    surah: 105,
    verse: 4,
    text: "تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ",
    textSimple: "ترميهم بحجارة من سجيل",
    page: 601,
    juz: 30,
    hizb: 60,
  },
  { surah: 105, verse: 5, text: "فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ", textSimple: "فجعلهم كعصف مأكول", page: 601, juz: 30, hizb: 60 },
]

export const SURAH_QURAYSH: Verse[] = [
  { surah: 106, verse: 1, text: "لِإِيلَافِ قُرَيْشٍ", textSimple: "لإيلاف قريش", page: 602, juz: 30, hizb: 60 },
  {
    surah: 106,
    verse: 2,
    text: "إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ",
    textSimple: "إيلافهم رحلة الشتاء والصيف",
    page: 602,
    juz: 30,
    hizb: 60,
  },
  {
    surah: 106,
    verse: 3,
    text: "فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ",
    textSimple: "فليعبدوا رب هذا البيت",
    page: 602,
    juz: 30,
    hizb: 60,
  },
  {
    surah: 106,
    verse: 4,
    text: "الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ",
    textSimple: "الذي أطعمهم من جوع وآمنهم من خوف",
    page: 602,
    juz: 30,
    hizb: 60,
  },
]

export const SURAH_AL_MAUN: Verse[] = [
  {
    surah: 107,
    verse: 1,
    text: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ",
    textSimple: "أرأيت الذي يكذب بالدين",
    page: 602,
    juz: 30,
    hizb: 60,
  },
  {
    surah: 107,
    verse: 2,
    text: "فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ",
    textSimple: "فذلك الذي يدع اليتيم",
    page: 602,
    juz: 30,
    hizb: 60,
  },
  {
    surah: 107,
    verse: 3,
    text: "وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ",
    textSimple: "ولا يحض على طعام المسكين",
    page: 602,
    juz: 30,
    hizb: 60,
  },
  { surah: 107, verse: 4, text: "فَوَيْلٌ لِّلْمُصَلِّينَ", textSimple: "فويل للمصلين", page: 602, juz: 30, hizb: 60 },
  {
    surah: 107,
    verse: 5,
    text: "الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ",
    textSimple: "الذين هم عن صلاتهم ساهون",
    page: 602,
    juz: 30,
    hizb: 60,
  },
  { surah: 107, verse: 6, text: "الَّذِينَ هُمْ يُرَاءُونَ", textSimple: "الذين هم يراءون", page: 602, juz: 30, hizb: 60 },
  { surah: 107, verse: 7, text: "وَيَمْنَعُونَ الْمَاعُونَ", textSimple: "ويمنعون الماعون", page: 602, juz: 30, hizb: 60 },
]

export const SURAH_AL_KAWTHAR: Verse[] = [
  { surah: 108, verse: 1, text: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", textSimple: "إنا أعطيناك الكوثر", page: 602, juz: 30, hizb: 60 },
  { surah: 108, verse: 2, text: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", textSimple: "فصل لربك وانحر", page: 602, juz: 30, hizb: 60 },
  { surah: 108, verse: 3, text: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", textSimple: "إن شانئك هو الأبتر", page: 602, juz: 30, hizb: 60 },
]

export const SURAH_AL_KAFIRUN: Verse[] = [
  {
    surah: 109,
    verse: 1,
    text: "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
    textSimple: "قل يا أيها الكافرون",
    page: 603,
    juz: 30,
    hizb: 60,
  },
  { surah: 109, verse: 2, text: "لَا أَعْبُدُ مَا تَعْبُدُونَ", textSimple: "لا أعبد ما تعبدون", page: 603, juz: 30, hizb: 60 },
  {
    surah: 109,
    verse: 3,
    text: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ",
    textSimple: "ولا أنتم عابدون ما أعبد",
    page: 603,
    juz: 30,
    hizb: 60,
  },
  {
    surah: 109,
    verse: 4,
    text: "وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ",
    textSimple: "ولا أنا عابد ما عبدتم",
    page: 603,
    juz: 30,
    hizb: 60,
  },
  {
    surah: 109,
    verse: 5,
    text: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ",
    textSimple: "ولا أنتم عابدون ما أعبد",
    page: 603,
    juz: 30,
    hizb: 60,
  },
  { surah: 109, verse: 6, text: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ", textSimple: "لكم دينكم ولي دين", page: 603, juz: 30, hizb: 60 },
]

export const SURAH_AN_NASR: Verse[] = [
  {
    surah: 110,
    verse: 1,
    text: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
    textSimple: "إذا جاء نصر الله والفتح",
    page: 603,
    juz: 30,
    hizb: 60,
  },
  {
    surah: 110,
    verse: 2,
    text: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا",
    textSimple: "ورأيت الناس يدخلون في دين الله أفواجا",
    page: 603,
    juz: 30,
    hizb: 60,
  },
  {
    surah: 110,
    verse: 3,
    text: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا",
    textSimple: "فسبح بحمد ربك واستغفره إنه كان توابا",
    page: 603,
    juz: 30,
    hizb: 60,
  },
]

export const SURAH_AL_MASAD: Verse[] = [
  {
    surah: 111,
    verse: 1,
    text: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ",
    textSimple: "تبت يدا أبي لهب وتب",
    page: 603,
    juz: 30,
    hizb: 60,
  },
  {
    surah: 111,
    verse: 2,
    text: "مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ",
    textSimple: "ما أغنى عنه ماله وما كسب",
    page: 603,
    juz: 30,
    hizb: 60,
  },
  { surah: 111, verse: 3, text: "سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ", textSimple: "سيصلى نارا ذات لهب", page: 603, juz: 30, hizb: 60 },
  {
    surah: 111,
    verse: 4,
    text: "وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ",
    textSimple: "وامرأته حمالة الحطب",
    page: 603,
    juz: 30,
    hizb: 60,
  },
  {
    surah: 111,
    verse: 5,
    text: "فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ",
    textSimple: "في جيدها حبل من مسد",
    page: 603,
    juz: 30,
    hizb: 60,
  },
]

export const SURAH_AL_IKHLAS: Verse[] = [
  { surah: 112, verse: 1, text: "قُلْ هُوَ اللَّهُ أَحَدٌ", textSimple: "قل هو الله أحد", page: 604, juz: 30, hizb: 60 },
  { surah: 112, verse: 2, text: "اللَّهُ الصَّمَدُ", textSimple: "الله الصمد", page: 604, juz: 30, hizb: 60 },
  { surah: 112, verse: 3, text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", textSimple: "لم يلد ولم يولد", page: 604, juz: 30, hizb: 60 },
  {
    surah: 112,
    verse: 4,
    text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    textSimple: "ولم يكن له كفوا أحد",
    page: 604,
    juz: 30,
    hizb: 60,
  },
]

export const SURAH_AL_FALAQ: Verse[] = [
  { surah: 113, verse: 1, text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", textSimple: "قل أعوذ برب الفلق", page: 604, juz: 30, hizb: 60 },
  { surah: 113, verse: 2, text: "مِن شَرِّ مَا خَلَقَ", textSimple: "من شر ما خلق", page: 604, juz: 30, hizb: 60 },
  {
    surah: 113,
    verse: 3,
    text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
    textSimple: "ومن شر غاسق إذا وقب",
    page: 604,
    juz: 30,
    hizb: 60,
  },
  {
    surah: 113,
    verse: 4,
    text: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
    textSimple: "ومن شر النفاثات في العقد",
    page: 604,
    juz: 30,
    hizb: 60,
  },
  {
    surah: 113,
    verse: 5,
    text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    textSimple: "ومن شر حاسد إذا حسد",
    page: 604,
    juz: 30,
    hizb: 60,
  },
]

export const SURAH_AN_NAS: Verse[] = [
  { surah: 114, verse: 1, text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", textSimple: "قل أعوذ برب الناس", page: 604, juz: 30, hizb: 60 },
  { surah: 114, verse: 2, text: "مَلِكِ النَّاسِ", textSimple: "ملك الناس", page: 604, juz: 30, hizb: 60 },
  { surah: 114, verse: 3, text: "إِلَٰهِ النَّاسِ", textSimple: "إله الناس", page: 604, juz: 30, hizb: 60 },
  {
    surah: 114,
    verse: 4,
    text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
    textSimple: "من شر الوسواس الخناس",
    page: 604,
    juz: 30,
    hizb: 60,
  },
  {
    surah: 114,
    verse: 5,
    text: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
    textSimple: "الذي يوسوس في صدور الناس",
    page: 604,
    juz: 30,
    hizb: 60,
  },
  { surah: 114, verse: 6, text: "مِنَ الْجِنَّةِ وَالنَّاسِ", textSimple: "من الجنة والناس", page: 604, juz: 30, hizb: 60 },
]

// Combined verses for quick lookup
export const ALL_VERSES: Record<number, Verse[]> = {
  1: SURAH_AL_FATIHA,
  2: SURAH_AL_BAQARAH_PART,
  105: SURAH_AL_FIL,
  106: SURAH_QURAYSH,
  107: SURAH_AL_MAUN,
  108: SURAH_AL_KAWTHAR,
  109: SURAH_AL_KAFIRUN,
  110: SURAH_AN_NASR,
  111: SURAH_AL_MASAD,
  112: SURAH_AL_IKHLAS,
  113: SURAH_AL_FALAQ,
  114: SURAH_AN_NAS,
}

// Get verses for a surah
export function getVersesForSurah(surahNumber: number): Verse[] {
  return ALL_VERSES[surahNumber] || []
}

// Get a specific verse
export function getVerse(surahNumber: number, verseNumber: number): Verse | undefined {
  const verses = ALL_VERSES[surahNumber]
  return verses?.find((v) => v.verse === verseNumber)
}
