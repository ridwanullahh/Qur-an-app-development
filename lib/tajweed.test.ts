// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Comprehensive unit tests for Tajweed analysis functions

import { describe, it, expect } from "vitest"
import {
  analyzeTajweed,
  analyzeTajweedSimple,
  isThroatLetter,
  isSunLetter,
  isMoonLetter,
  getVowelBefore,
  getVowelAfter,
  isWordEnd,
  type TajweedAnalysisResult,
} from "./tajweed"

describe("Helper Functions", () => {
  describe("isThroatLetter", () => {
    it("should identify throat letters correctly", () => {
      expect(isThroatLetter("ء")).toBe(true)
      expect(isThroatLetter("ه")).toBe(true)
      expect(isThroatLetter("ع")).toBe(true)
      expect(isThroatLetter("ح")).toBe(true)
      expect(isThroatLetter("غ")).toBe(true)
      expect(isThroatLetter("خ")).toBe(true)
      expect(isThroatLetter("ب")).toBe(false)
      expect(isThroatLetter("ت")).toBe(false)
    })
  })

  describe("isSunLetter", () => {
    it("should identify sun letters correctly", () => {
      expect(isSunLetter("ت")).toBe(true)
      expect(isSunLetter("ث")).toBe(true)
      expect(isSunLetter("د")).toBe(true)
      expect(isSunLetter("ذ")).toBe(true)
      expect(isSunLetter("ر")).toBe(true)
      expect(isSunLetter("ز")).toBe(true)
      expect(isSunLetter("س")).toBe(true)
      expect(isSunLetter("ش")).toBe(true)
      expect(isSunLetter("ص")).toBe(true)
      expect(isSunLetter("ض")).toBe(true)
      expect(isSunLetter("ط")).toBe(true)
      expect(isSunLetter("ظ")).toBe(true)
      expect(isSunLetter("ل")).toBe(true)
      expect(isSunLetter("ن")).toBe(true)
      expect(isSunLetter("ب")).toBe(false)
      expect(isSunLetter("ق")).toBe(false)
    })
  })

  describe("isMoonLetter", () => {
    it("should identify moon letters correctly", () => {
      expect(isMoonLetter("ا")).toBe(true)
      expect(isMoonLetter("ب")).toBe(true)
      expect(isMoonLetter("ج")).toBe(true)
      expect(isMoonLetter("ح")).toBe(true)
      expect(isMoonLetter("خ")).toBe(true)
      expect(isMoonLetter("ع")).toBe(true)
      expect(isMoonLetter("غ")).toBe(true)
      expect(isMoonLetter("ف")).toBe(true)
      expect(isMoonLetter("ق")).toBe(true)
      expect(isMoonLetter("ك")).toBe(true)
      expect(isMoonLetter("م")).toBe(true)
      expect(isMoonLetter("ه")).toBe(true)
      expect(isMoonLetter("و")).toBe(true)
      expect(isMoonLetter("ي")).toBe(true)
      expect(isMoonLetter("ت")).toBe(false)
      expect(isMoonLetter("ر")).toBe(false)
    })
  })

  describe("getVowelBefore", () => {
    it("should get vowel before character", () => {
      const chars = ["ب", "َ", "ا", "ب"]
      expect(getVowelBefore(chars, 2)).toBe("َ")
      expect(getVowelBefore(chars, 0)).toBe(null)
    })

    it("should handle sukoon", () => {
      const chars = ["ن", "ْ", "ت"]
      expect(getVowelBefore(chars, 2)).toBe("ْ")
    })
  })

  describe("getVowelAfter", () => {
    it("should get vowel after character", () => {
      const chars = ["ب", "َ", "ا"]
      expect(getVowelAfter(chars, 0)).toBe("َ")
      expect(getVowelAfter(chars, 2)).toBe(null)
    })

    it("should handle shaddah", () => {
      const chars = ["ن", "ّ", "ا"]
      expect(getVowelAfter(chars, 0)).toBe("ّ")
    })
  })

  describe("isWordEnd", () => {
    it("should detect word end correctly", () => {
      const chars = ["ب", "ا", "ب"]
      expect(isWordEnd(chars, 2)).toBe(true)
      expect(isWordEnd(chars, 1)).toBe(false)
    })

    it("should handle diacritics at end", () => {
      const chars = ["ب", "ا", "ب", "ٌ"]
      expect(isWordEnd(chars, 2)).toBe(true)
    })
  })
})

describe("Tajweed Analysis - Ghunnah", () => {
  it("should detect Ghunnah on Noon with Shaddah", () => {
    const result = analyzeTajweed("نَّ")
    const noonResult = result.find((r) => r.char === "ن")
    expect(noonResult?.rule).toBe("ghunnah")
    expect(noonResult?.priority).toBe(10)
    expect(noonResult?.difficulty).toBe("basic")
  })

  it("should detect Ghunnah on Meem with Shaddah", () => {
    const result = analyzeTajweed("مَّ")
    const meemResult = result.find((r) => r.char === "م")
    expect(meemResult?.rule).toBe("ghunnah")
    expect(meemResult?.priority).toBe(10)
  })
})

describe("Tajweed Analysis - Noon Sakinah Rules", () => {
  it("should detect Izhar Halqi before throat letters", () => {
    const result = analyzeTajweed("مِنْ عِلْمٍ")
    const noonResult = result.find((r) => r.char === "ن")
    expect(noonResult?.rule).toBe("izhar_halqi")
    expect(noonResult?.difficulty).toBe("intermediate")
  })

  it("should detect Idgham with Ghunnah before ي", () => {
    const result = analyzeTajweed("مِنْ يَوْمٍ")
    const noonResult = result.find((r) => r.char === "ن")
    expect(noonResult?.rule).toBe("idgham_with_ghunnah")
  })

  it("should detect Idgham without Ghunnah before ل", () => {
    const result = analyzeTajweed("مِنْ لَدُنْ")
    const noonResult = result.find((r) => r.char === "ن")
    expect(noonResult?.rule).toBe("idgham_without_ghunnah")
  })

  it("should detect Idgham without Ghunnah before ر", () => {
    const result = analyzeTajweed("مِنْ رَبِّ")
    const noonResult = result.find((r) => r.char === "ن")
    expect(noonResult?.rule).toBe("idgham_without_ghunnah")
  })

  it("should detect Iqlab before ب", () => {
    const result = analyzeTajweed("مِنْ بَعْدِ")
    const noonResult = result.find((r) => r.char === "ن")
    expect(noonResult?.rule).toBe("iqlab")
    expect(noonResult?.difficulty).toBe("basic")
  })

  it("should detect Ikhfa Haqiqi before 15 letters", () => {
    const result = analyzeTajweed("مِنْ قَبْلِ")
    const noonResult = result.find((r) => r.char === "ن")
    expect(noonResult?.rule).toBe("ikhfa_haqiqi")
    expect(noonResult?.difficulty).toBe("intermediate")
  })

  it("should detect Ikhfa Haqiqi before ت", () => {
    const result = analyzeTajweed("أَنْتَ")
    const noonResult = result.find((r) => r.char === "ن")
    expect(noonResult?.rule).toBe("ikhfa_haqiqi")
  })
})

describe("Tajweed Analysis - Tanween Rules", () => {
  it("should detect Tanween Iqlab before ب", () => {
    const result = analyzeTajweed("سَمِيعٌ بَصِير")
    const tanweenResult = result.find((r) => r.char === "ٌ")
    expect(tanweenResult?.rule).toBe("iqlab")
  })

  it("should detect Tanween Izhar before throat letters", () => {
    const result = analyzeTajweed("عَلِيمٌ حَكِيم")
    const tanweenResult = result.find((r) => r.char === "ٌ")
    expect(tanweenResult?.rule).toBe("izhar_halqi")
  })
})

describe("Tajweed Analysis - Meem Sakinah Rules", () => {
  it("should detect Ikhfa Shafawi before ب", () => {
    const result = analyzeTajweed("هُمْ بِهَا")
    const meemResult = result.find((r) => r.char === "م")
    expect(meemResult?.rule).toBe("ikhfa_shafawi")
    expect(meemResult?.difficulty).toBe("intermediate")
  })

  it("should detect Idgham Shafawi before م", () => {
    const result = analyzeTajweed("لَهُمْ مَا")
    const meemResult = result.find((r) => r.char === "م")
    expect(meemResult?.rule).toBe("idgham_shafawi")
  })

  it("should detect Izhar Shafawi before other letters", () => {
    const result = analyzeTajweed("هُمْ فِيهَا")
    const meemResult = result.find((r) => r.char === "م")
    expect(meemResult?.rule).toBe("izhar_shafawi")
  })
})

describe("Tajweed Analysis - Qalqalah Rules", () => {
  it("should detect Qalqalah Sughra in middle of word", () => {
    const result = analyzeTajweed("يَقْطَعُونَ")
    const qafResult = result.find((r) => r.char === "ق")
    expect(qafResult?.rule).toBe("qalqalah_sughra")
    expect(qafResult?.difficulty).toBe("intermediate")
  })

  it("should detect Qalqalah Kubra at pause", () => {
    const result = analyzeTajweed("الْفَلَقْ", true)
    const qafResult = result.find((r) => r.char === "ق")
    expect(qafResult?.rule).toBe("qalqalah_kubra")
    expect(qafResult?.difficulty).toBe("intermediate")
  })

  it("should detect Qalqalah on all five letters", () => {
    const letters = ["ق", "ط", "ب", "ج", "د"]
    letters.forEach((letter) => {
      const result = analyzeTajweed(`${letter}ْ`)
      const letterResult = result.find((r) => r.char === letter)
      expect(letterResult?.rule).toMatch(/qalqalah/)
    })
  })
})

describe("Tajweed Analysis - Madd Rules", () => {
  it("should detect Madd Tabii with 2 counts", () => {
    const result = analyzeTajweed("قَالَ")
    const alifResult = result.find((r) => r.char === "ا")
    expect(alifResult?.rule).toBe("madd_tabii")
    expect(alifResult?.maddCount).toBe(2)
    expect(alifResult?.difficulty).toBe("basic")
  })

  it("should detect Madd Muttasil with 4 counts", () => {
    const result = analyzeTajweed("جَاءَ")
    const alifResult = result.find((r) => r.char === "ا")
    expect(alifResult?.rule).toBe("madd_muttasil")
    expect(alifResult?.maddCount).toBe(4)
    expect(alifResult?.difficulty).toBe("basic")
  })

  it("should detect Madd Lazim with 6 counts", () => {
    const result = analyzeTajweed("الضَّالِّينَ")
    const alifResult = result.find((r) => r.char === "ا" && r.rule === "madd_lazim")
    expect(alifResult?.maddCount).toBe(6)
    expect(alifResult?.difficulty).toBe("intermediate")
  })

  it("should detect Madd Badal", () => {
    const result = analyzeTajweed("آمَنَ")
    const alifResult = result.find((r) => r.char === "ا" && r.rule === "madd_badal")
    expect(alifResult?.maddCount).toBe(2)
    expect(alifResult?.difficulty).toBe("intermediate")
  })

  it("should detect Madd Arid at pause", () => {
    const result = analyzeTajweed("الْعَالَمِينَ", true)
    const yaaResult = result.find((r) => r.char === "ي" && r.rule === "madd_arid")
    expect(yaaResult?.maddCount).toBe(2)
    expect(yaaResult?.difficulty).toBe("intermediate")
  })

  it("should detect Madd Leen", () => {
    const result = analyzeTajweed("خَوْفٌ", true)
    const wawResult = result.find((r) => r.char === "و" && r.rule === "madd_leen")
    expect(wawResult?.difficulty).toBe("advanced")
  })
})

describe("Tajweed Analysis - Ra Rules", () => {
  it("should detect Tafkheem with Fatha", () => {
    const result = analyzeTajweed("رَبِّ")
    const raResult = result.find((r) => r.char === "ر")
    expect(raResult?.rule).toBe("tafkheem")
    expect(raResult?.difficulty).toBe("intermediate")
  })

  it("should detect Tafkheem with Damma", () => {
    const result = analyzeTajweed("رُحْمَة")
    const raResult = result.find((r) => r.char === "ر")
    expect(raResult?.rule).toBe("tafkheem")
  })

  it("should detect Tarqeeq with Kasra", () => {
    const result = analyzeTajweed("فِرْعَوْن")
    const raResult = result.find((r) => r.char === "ر")
    expect(raResult?.rule).toBe("tarqeeq")
    expect(raResult?.difficulty).toBe("intermediate")
  })
})

describe("Tajweed Analysis - Lam Rules", () => {
  it("should detect Lam Shamsiyyah", () => {
    const result = analyzeTajweed("الشَّمْس")
    const lamResult = result.find((r) => r.char === "ل")
    expect(lamResult?.rule).toBe("lam_shamsiyyah")
    expect(lamResult?.difficulty).toBe("basic")
  })

  it("should detect Lam Qamariyyah", () => {
    const result = analyzeTajweed("الْقَمَر")
    const lamResult = result.find((r) => r.char === "ل")
    expect(lamResult?.rule).toBe("lam_qamariyyah")
    expect(lamResult?.difficulty).toBe("basic")
  })

  it("should detect Lam Jalalah Tafkheem after Fatha", () => {
    const result = analyzeTajweed("قَالَ اللَّهُ")
    const lamResults = result.filter((r) => r.char === "ل")
    const jalalahLam = lamResults.find((r) => r.rule === "lam_jalalah_tafkheem")
    expect(jalalahLam).toBeDefined()
    expect(jalalahLam?.difficulty).toBe("intermediate")
  })

  it("should detect Lam Jalalah Tarqeeq after Kasra", () => {
    const result = analyzeTajweed("بِسْمِ اللَّهِ")
    const lamResults = result.filter((r) => r.char === "ل")
    const jalalahLam = lamResults.find((r) => r.rule === "lam_jalalah_tarqeeq")
    expect(jalalahLam).toBeDefined()
    expect(jalalahLam?.difficulty).toBe("intermediate")
  })
})

describe("Tajweed Analysis - Sifaat", () => {
  it("should detect Isti'la on elevation letters", () => {
    const elevationLetters = ["خ", "ص", "ض", "غ", "ط", "ق", "ظ"]
    elevationLetters.forEach((letter) => {
      const result = analyzeTajweed(letter)
      const letterResult = result.find((r) => r.char === letter)
      expect(letterResult?.rule).toBe("istila")
      expect(letterResult?.difficulty).toBe("advanced")
    })
  })

  it("should detect Istifal on lowering letters", () => {
    const result = analyzeTajweed("ب")
    const baResult = result.find((r) => r.char === "ب")
    expect(baResult?.rule).toBe("istifal")
    expect(baResult?.difficulty).toBe("advanced")
  })
})

describe("Tajweed Analysis - Performance", () => {
  it("should analyze a word in less than 10ms", () => {
    const word = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
    const start = performance.now()
    analyzeTajweed(word)
    const end = performance.now()
    const duration = end - start
    expect(duration).toBeLessThan(10)
  })

  it("should handle long words efficiently", () => {
    const longWord = "فَسَيَكْفِيكَهُمُ اللَّهُ وَهُوَ السَّمِيعُ الْعَلِيمُ"
    const start = performance.now()
    analyzeTajweed(longWord)
    const end = performance.now()
    const duration = end - start
    expect(duration).toBeLessThan(10)
  })
})

describe("Tajweed Analysis - Backward Compatibility", () => {
  it("should support legacy analyzeTajweedSimple function", () => {
    const result = analyzeTajweedSimple("قَالَ")
    expect(result).toBeInstanceOf(Array)
    expect(result[0]).toHaveProperty("char")
    expect(result[0]).toHaveProperty("rule")
    expect(result[0]).not.toHaveProperty("priority")
    expect(result[0]).not.toHaveProperty("difficulty")
  })

  it("should return same rules as enhanced version", () => {
    const word = "مِنْ قَبْلِ"
    const simple = analyzeTajweedSimple(word)
    const enhanced = analyzeTajweed(word)

    expect(simple.length).toBe(enhanced.length)
    simple.forEach((item, index) => {
      expect(item.char).toBe(enhanced[index].char)
      expect(item.rule).toBe(enhanced[index].rule)
    })
  })
})

describe("Tajweed Analysis - Complex Real-World Examples", () => {
  it("should analyze Bismillah correctly", () => {
    const result = analyzeTajweed("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ")
    expect(result.length).toBeGreaterThan(0)

    // Check for Lam Jalalah Tarqeeq in Allah after Kasra
    const lamResults = result.filter((r) => r.char === "ل")
    const hasJalalahTarqeeq = lamResults.some((r) => r.rule === "lam_jalalah_tarqeeq")
    expect(hasJalalahTarqeeq).toBe(true)
  })

  it("should analyze Al-Fatiha opening correctly", () => {
    const result = analyzeTajweed("الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ")
    expect(result.length).toBeGreaterThan(0)

    // Should detect various rules
    const rules = result.map((r) => r.rule)
    expect(rules).toContain("lam_qamariyyah") // الْحَمْد
    expect(rules.some((r) => r.includes("madd"))).toBe(true) // الْعَالَمِين
  })

  it("should handle words with multiple rules", () => {
    const result = analyzeTajweed("الرَّحْمَٰنِ")
    const rules = new Set(result.map((r) => r.rule))
    expect(rules.size).toBeGreaterThan(1) // Multiple different rules
  })
})

describe("Tajweed Analysis - Edge Cases", () => {
  it("should handle empty string", () => {
    const result = analyzeTajweed("")
    expect(result).toEqual([])
  })

  it("should handle single character", () => {
    const result = analyzeTajweed("ا")
    expect(result.length).toBe(1)
  })

  it("should handle diacritics only", () => {
    const result = analyzeTajweed("َُِ")
    expect(result.length).toBe(3)
  })

  it("should not produce false positives", () => {
    const result = analyzeTajweed("كَتَبَ")
    // Simple word should mostly have normal or basic rules
    const complexRules = result.filter(
      (r) => !["normal", "istifal", "istila"].includes(r.rule)
    )
    expect(complexRules.length).toBeLessThan(result.length)
  })
})

describe("Tajweed Analysis - Priority System", () => {
  it("should assign higher priority to Ghunnah", () => {
    const result = analyzeTajweed("نَّ")
    const noonResult = result.find((r) => r.char === "ن")
    expect(noonResult?.priority).toBe(10)
  })

  it("should assign priority 9 to Noon Sakinah rules", () => {
    const result = analyzeTajweed("مِنْ عِلْمٍ")
    const noonResult = result.find((r) => r.char === "ن")
    expect(noonResult?.priority).toBe(9)
  })

  it("should assign priority 8 to Meem Sakinah rules", () => {
    const result = analyzeTajweed("هُمْ بِهَا")
    const meemResult = result.find((r) => r.char === "م")
    expect(meemResult?.priority).toBe(8)
  })

  it("should assign priority 7 to Qalqalah rules", () => {
    const result = analyzeTajweed("قْ")
    const qafResult = result.find((r) => r.char === "ق")
    expect(qafResult?.priority).toBe(7)
  })

  it("should assign priority 6 to Madd rules", () => {
    const result = analyzeTajweed("قَالَ")
    const alifResult = result.find((r) => r.char === "ا")
    expect(alifResult?.priority).toBe(6)
  })
})
