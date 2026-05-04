// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Accessibility Utilities for Tajweed System

import { type TajweedRule, TAJWEED_RULES } from "./tajweed"

export type ColorblindMode = "none" | "protanopia" | "deuteranopia" | "tritanopia"

/**
 * Colorblind-friendly color palettes for Tajweed rules
 * These palettes are designed to be distinguishable for users with different types of color vision deficiency
 */
export const COLORBLIND_PALETTES: Record<
  ColorblindMode,
  Record<TajweedRule, { color: string; bgColor: string }>
> = {
  none: Object.fromEntries(
    Object.entries(TAJWEED_RULES).map(([key, rule]) => [
      key,
      { color: rule.color, bgColor: rule.bgColor },
    ])
  ) as Record<TajweedRule, { color: string; bgColor: string }>,

  // Protanopia (red-blind) - Use blue-yellow spectrum
  protanopia: {
    // Noon Sakinah and Tanween Rules - Blue tones
    ghunnah: { color: "#0369a1", bgColor: "rgba(3, 105, 161, 0.15)" },
    ikhfa: { color: "#0891b2", bgColor: "rgba(8, 145, 178, 0.15)" },
    idgham: { color: "#0e7490", bgColor: "rgba(14, 116, 144, 0.15)" },
    idgham_with_ghunnah: { color: "#06b6d4", bgColor: "rgba(6, 182, 212, 0.15)" },
    idgham_without_ghunnah: { color: "#0284c7", bgColor: "rgba(2, 132, 199, 0.15)" },
    iqlab: { color: "#0ea5e9", bgColor: "rgba(14, 165, 233, 0.15)" },
    izhar: { color: "#7c3aed", bgColor: "rgba(124, 58, 237, 0.15)" },
    izhar_halqi: { color: "#8b5cf6", bgColor: "rgba(139, 92, 246, 0.15)" },
    ikhfa_haqiqi: { color: "#22d3ee", bgColor: "rgba(34, 211, 238, 0.15)" },

    // Meem Sakinah Rules - Purple tones
    ikhfa_shafawi: { color: "#9333ea", bgColor: "rgba(147, 51, 234, 0.15)" },
    idgham_shafawi: { color: "#a855f7", bgColor: "rgba(168, 85, 247, 0.15)" },
    izhar_shafawi: { color: "#c084fc", bgColor: "rgba(192, 132, 252, 0.15)" },

    // Qalqalah Rules - Dark blue tones
    qalqalah: { color: "#1e3a8a", bgColor: "rgba(30, 58, 138, 0.15)" },
    qalqalah_sughra: { color: "#1e40af", bgColor: "rgba(30, 64, 175, 0.15)" },
    qalqalah_kubra: { color: "#1d4ed8", bgColor: "rgba(29, 78, 216, 0.15)" },

    // Madd Rules - Yellow to brown spectrum
    madd: { color: "#ca8a04", bgColor: "rgba(202, 138, 4, 0.15)" },
    madd_tabii: { color: "#eab308", bgColor: "rgba(234, 179, 8, 0.15)" },
    madd_lazim: { color: "#92400e", bgColor: "rgba(146, 64, 14, 0.15)" },
    madd_muttasil: { color: "#b45309", bgColor: "rgba(180, 83, 9, 0.15)" },
    madd_munfasil: { color: "#d97706", bgColor: "rgba(217, 119, 6, 0.15)" },
    madd_badal: { color: "#f59e0b", bgColor: "rgba(245, 158, 11, 0.15)" },
    madd_arid: { color: "#fbbf24", bgColor: "rgba(251, 191, 36, 0.15)" },
    madd_leen: { color: "#fcd34d", bgColor: "rgba(252, 211, 77, 0.15)" },
    madd_silah_sughra: { color: "#fde047", bgColor: "rgba(253, 224, 71, 0.15)" },
    madd_silah_kubra: { color: "#facc15", bgColor: "rgba(250, 204, 21, 0.15)" },
    madd_iwad: { color: "#fef08a", bgColor: "rgba(254, 240, 138, 0.15)" },
    madd_tamkeen: { color: "#a16207", bgColor: "rgba(161, 98, 7, 0.15)" },
    madd_farq: { color: "#854d0e", bgColor: "rgba(133, 77, 14, 0.15)" },

    // Ra Rules - Cyan tones
    tafkheem: { color: "#155e75", bgColor: "rgba(21, 94, 117, 0.15)" },
    tarqeeq: { color: "#06b6d4", bgColor: "rgba(6, 182, 212, 0.15)" },

    // Lam Rules - Mixed blue-purple
    lam_shamsiyyah: { color: "#6366f1", bgColor: "rgba(99, 102, 241, 0.15)" },
    lam_qamariyyah: { color: "#818cf8", bgColor: "rgba(129, 140, 248, 0.15)" },
    lam_jalalah_tafkheem: { color: "#4f46e5", bgColor: "rgba(79, 70, 229, 0.15)" },
    lam_jalalah_tarqeeq: { color: "#6366f1", bgColor: "rgba(99, 102, 241, 0.15)" },

    // Sifaat - Indigo tones
    istila: { color: "#4338ca", bgColor: "rgba(67, 56, 202, 0.15)" },
    istifal: { color: "#4f46e5", bgColor: "rgba(79, 70, 229, 0.15)" },

    // Special States - Gray tones
    silent: { color: "#64748b", bgColor: "rgba(100, 116, 139, 0.1)" },
    normal: { color: "inherit", bgColor: "transparent" },
  },

  // Deuteranopia (green-blind) - Use blue-purple-yellow spectrum
  deuteranopia: {
    // Similar to protanopia but with adjusted hues
    ghunnah: { color: "#0284c7", bgColor: "rgba(2, 132, 199, 0.15)" },
    ikhfa: { color: "#0ea5e9", bgColor: "rgba(14, 165, 233, 0.15)" },
    idgham: { color: "#7c3aed", bgColor: "rgba(124, 58, 237, 0.15)" },
    idgham_with_ghunnah: { color: "#8b5cf6", bgColor: "rgba(139, 92, 246, 0.15)" },
    idgham_without_ghunnah: { color: "#9333ea", bgColor: "rgba(147, 51, 234, 0.15)" },
    iqlab: { color: "#06b6d4", bgColor: "rgba(6, 182, 212, 0.15)" },
    izhar: { color: "#6366f1", bgColor: "rgba(99, 102, 241, 0.15)" },
    izhar_halqi: { color: "#818cf8", bgColor: "rgba(129, 140, 248, 0.15)" },
    ikhfa_haqiqi: { color: "#38bdf8", bgColor: "rgba(56, 189, 248, 0.15)" },

    ikhfa_shafawi: { color: "#a855f7", bgColor: "rgba(168, 85, 247, 0.15)" },
    idgham_shafawi: { color: "#c026d3", bgColor: "rgba(192, 38, 211, 0.15)" },
    izhar_shafawi: { color: "#d946ef", bgColor: "rgba(217, 70, 239, 0.15)" },

    qalqalah: { color: "#1e40af", bgColor: "rgba(30, 64, 175, 0.15)" },
    qalqalah_sughra: { color: "#2563eb", bgColor: "rgba(37, 99, 235, 0.15)" },
    qalqalah_kubra: { color: "#1d4ed8", bgColor: "rgba(29, 78, 216, 0.15)" },

    madd: { color: "#b45309", bgColor: "rgba(180, 83, 9, 0.15)" },
    madd_tabii: { color: "#d97706", bgColor: "rgba(217, 119, 6, 0.15)" },
    madd_lazim: { color: "#78350f", bgColor: "rgba(120, 53, 15, 0.15)" },
    madd_muttasil: { color: "#92400e", bgColor: "rgba(146, 64, 14, 0.15)" },
    madd_munfasil: { color: "#a16207", bgColor: "rgba(161, 98, 7, 0.15)" },
    madd_badal: { color: "#ca8a04", bgColor: "rgba(202, 138, 4, 0.15)" },
    madd_arid: { color: "#eab308", bgColor: "rgba(234, 179, 8, 0.15)" },
    madd_leen: { color: "#facc15", bgColor: "rgba(250, 204, 21, 0.15)" },
    madd_silah_sughra: { color: "#fde047", bgColor: "rgba(253, 224, 71, 0.15)" },
    madd_silah_kubra: { color: "#fef08a", bgColor: "rgba(254, 240, 138, 0.15)" },
    madd_iwad: { color: "#fef9c3", bgColor: "rgba(254, 249, 195, 0.15)" },
    madd_tamkeen: { color: "#854d0e", bgColor: "rgba(133, 77, 14, 0.15)" },
    madd_farq: { color: "#713f12", bgColor: "rgba(113, 63, 18, 0.15)" },

    tafkheem: { color: "#0e7490", bgColor: "rgba(14, 116, 144, 0.15)" },
    tarqeeq: { color: "#22d3ee", bgColor: "rgba(34, 211, 238, 0.15)" },

    lam_shamsiyyah: { color: "#4f46e5", bgColor: "rgba(79, 70, 229, 0.15)" },
    lam_qamariyyah: { color: "#6366f1", bgColor: "rgba(99, 102, 241, 0.15)" },
    lam_jalalah_tafkheem: { color: "#4338ca", bgColor: "rgba(67, 56, 202, 0.15)" },
    lam_jalalah_tarqeeq: { color: "#818cf8", bgColor: "rgba(129, 140, 248, 0.15)" },

    istila: { color: "#3730a3", bgColor: "rgba(55, 48, 163, 0.15)" },
    istifal: { color: "#4338ca", bgColor: "rgba(67, 56, 202, 0.15)" },

    silent: { color: "#64748b", bgColor: "rgba(100, 116, 139, 0.1)" },
    normal: { color: "inherit", bgColor: "transparent" },
  },

  // Tritanopia (blue-blind) - Use red-green-purple spectrum
  tritanopia: {
    // Use warm colors and avoid blue
    ghunnah: { color: "#16a34a", bgColor: "rgba(22, 163, 74, 0.15)" },
    ikhfa: { color: "#ea580c", bgColor: "rgba(234, 88, 12, 0.15)" },
    idgham: { color: "#9333ea", bgColor: "rgba(147, 51, 234, 0.15)" },
    idgham_with_ghunnah: { color: "#a855f7", bgColor: "rgba(168, 85, 247, 0.15)" },
    idgham_without_ghunnah: { color: "#7c3aed", bgColor: "rgba(124, 58, 237, 0.15)" },
    iqlab: { color: "#059669", bgColor: "rgba(5, 150, 105, 0.15)" },
    izhar: { color: "#65a30d", bgColor: "rgba(101, 163, 13, 0.15)" },
    izhar_halqi: { color: "#84cc16", bgColor: "rgba(132, 204, 22, 0.15)" },
    ikhfa_haqiqi: { color: "#f97316", bgColor: "rgba(249, 115, 22, 0.15)" },

    ikhfa_shafawi: { color: "#fb923c", bgColor: "rgba(251, 146, 60, 0.15)" },
    idgham_shafawi: { color: "#c026d3", bgColor: "rgba(192, 38, 211, 0.15)" },
    izhar_shafawi: { color: "#a3e635", bgColor: "rgba(163, 230, 53, 0.15)" },

    qalqalah: { color: "#dc2626", bgColor: "rgba(220, 38, 38, 0.15)" },
    qalqalah_sughra: { color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.15)" },
    qalqalah_kubra: { color: "#b91c1c", bgColor: "rgba(185, 28, 28, 0.15)" },

    madd: { color: "#dc2626", bgColor: "rgba(220, 38, 38, 0.15)" },
    madd_tabii: { color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.15)" },
    madd_lazim: { color: "#be123c", bgColor: "rgba(190, 18, 60, 0.15)" },
    madd_muttasil: { color: "#e11d48", bgColor: "rgba(225, 29, 72, 0.15)" },
    madd_munfasil: { color: "#f43f5e", bgColor: "rgba(244, 63, 94, 0.15)" },
    madd_badal: { color: "#fb7185", bgColor: "rgba(251, 113, 133, 0.15)" },
    madd_arid: { color: "#fda4af", bgColor: "rgba(253, 164, 175, 0.15)" },
    madd_leen: { color: "#fecdd3", bgColor: "rgba(254, 205, 211, 0.15)" },
    madd_silah_sughra: { color: "#f87171", bgColor: "rgba(248, 113, 113, 0.15)" },
    madd_silah_kubra: { color: "#dc2626", bgColor: "rgba(220, 38, 38, 0.2)" },
    madd_iwad: { color: "#fca5a5", bgColor: "rgba(252, 165, 165, 0.15)" },
    madd_tamkeen: { color: "#b91c1c", bgColor: "rgba(185, 28, 28, 0.15)" },
    madd_farq: { color: "#991b1b", bgColor: "rgba(153, 27, 27, 0.15)" },

    tafkheem: { color: "#b45309", bgColor: "rgba(180, 83, 9, 0.15)" },
    tarqeeq: { color: "#10b981", bgColor: "rgba(16, 185, 129, 0.15)" },

    lam_shamsiyyah: { color: "#ca8a04", bgColor: "rgba(202, 138, 4, 0.15)" },
    lam_qamariyyah: { color: "#059669", bgColor: "rgba(5, 150, 105, 0.15)" },
    lam_jalalah_tafkheem: { color: "#92400e", bgColor: "rgba(146, 64, 14, 0.15)" },
    lam_jalalah_tarqeeq: { color: "#047857", bgColor: "rgba(4, 120, 87, 0.15)" },

    istila: { color: "#d97706", bgColor: "rgba(217, 119, 6, 0.15)" },
    istifal: { color: "#10b981", bgColor: "rgba(16, 185, 129, 0.15)" },

    silent: { color: "#64748b", bgColor: "rgba(100, 116, 139, 0.1)" },
    normal: { color: "inherit", bgColor: "transparent" },
  },
}

/**
 * Pattern overlays for additional visual distinction
 * These can be applied as CSS background patterns
 */
export const PATTERN_OVERLAYS: Record<string, string> = {
  dots: "radial-gradient(circle, currentColor 1px, transparent 1px)",
  stripes: "repeating-linear-gradient(45deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)",
  grid: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
  waves: "repeating-radial-gradient(circle at 0 0, transparent 0, currentColor 2px, transparent 4px)",
  crosshatch:
    "repeating-linear-gradient(45deg, transparent, transparent 2px, currentColor 2px, currentColor 3px), repeating-linear-gradient(-45deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)",
}

/**
 * Get colorblind-friendly colors for a Tajweed rule
 */
export function getColorblindColors(
  rule: TajweedRule,
  mode: ColorblindMode
): { color: string; bgColor: string } {
  return COLORBLIND_PALETTES[mode][rule]
}

/**
 * Apply pattern overlay to a Tajweed element
 */
export function applyPatternOverlay(
  rule: TajweedRule,
  usePatterns: boolean
): React.CSSProperties {
  if (!usePatterns) return {}

  // Assign different patterns to different rule categories
  const ruleInfo = TAJWEED_RULES[rule]
  const colorFamily = ruleInfo.colorFamily || ""

  let pattern = ""
  if (colorFamily.includes("ghunnah") || colorFamily.includes("izhar")) {
    pattern = PATTERN_OVERLAYS.dots
  } else if (colorFamily.includes("idgham") || colorFamily.includes("ikhfa")) {
    pattern = PATTERN_OVERLAYS.stripes
  } else if (colorFamily.includes("qalqalah")) {
    pattern = PATTERN_OVERLAYS.grid
  } else if (colorFamily.includes("madd")) {
    pattern = PATTERN_OVERLAYS.waves
  } else if (colorFamily.includes("lam") || colorFamily.includes("ra")) {
    pattern = PATTERN_OVERLAYS.crosshatch
  } else {
    pattern = PATTERN_OVERLAYS.dots
  }

  return {
    backgroundImage: pattern,
    backgroundSize: "4px 4px",
    backgroundPosition: "0 0",
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-contrast: high)").matches
}

/**
 * Get ARIA label for a Tajweed rule
 */
export function getTajweedAriaLabel(
  rule: TajweedRule,
  char: string,
  language: string = "ar"
): string {
  const ruleInfo = TAJWEED_RULES[rule]
  if (!ruleInfo || rule === "normal") return char

  const ruleName = ruleInfo.nameArabic
  const description = ruleInfo.description[language as "ar" | "en" | "ur"] || ruleInfo.description.ar

  return `${char} - ${ruleName}: ${description}`
}
