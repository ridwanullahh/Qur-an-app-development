// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// SDK Instance - Singleton for the application

import UniversalSDK from "./githubdb-sdk"

// Singleton instance
let sdkInstance: UniversalSDK | null = null

export function getSDK(): UniversalSDK {
  if (!sdkInstance) {
    const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || process.env.GITHUB_OWNER || ""
    const repo = process.env.NEXT_PUBLIC_GITHUB_REPO || process.env.GITHUB_REPO || ""
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.GITHUB_TOKEN || ""

    if (!owner || !repo || !token) {
      console.warn("GitHub credentials not fully configured. Some features may not work.")
    }

    sdkInstance = new UniversalSDK({
      owner,
      repo,
      token,
      branch: process.env.NEXT_PUBLIC_GITHUB_BRANCH || "main",
      basePath: "db",
      schemas: {
        users: {
          required: ["email"],
          types: {
            email: "string",
            password: "string",
            name: "string",
            verified: "boolean",
            roles: "array",
          },
        },
        surahs: {
          types: {
            number: "number",
            name: "string",
            nameArabic: "string",
            revelationType: "string",
            versesCount: "number",
          },
        },
        translations: {
          types: {
            surahNumber: "number",
            verseNumber: "number",
            language: "string",
            text: "string",
            translator: "string",
          },
        },
        transliterations: {
          types: {
            surahNumber: "number",
            verseNumber: "number",
            wordIndex: "number",
            text: "string",
          },
        },
        tafseer: {
          types: {
            surahNumber: "number",
            verseNumber: "number",
            language: "string",
            text: "string",
            scholar: "string",
          },
        },
        morphology: {
          types: {
            surahNumber: "number",
            verseNumber: "number",
            wordIndex: "number",
            root: "string",
            lemma: "string",
            pos: "string",
          },
        },
        bookmarks: {
          types: {
            userId: "string",
            surahNumber: "number",
            verseNumber: "number",
            note: "string",
          },
        },
        progress: {
          types: {
            userId: "string",
            surahNumber: "number",
            verseNumber: "number",
            status: "string",
            memorizedAt: "string",
          },
        },
        settings: {
          types: {
            userId: "string",
            theme: "string",
            fontSize: "number",
            fontFamily: "string",
            showTranslation: "boolean",
            showTransliteration: "boolean",
            reciter: "string",
          },
        },
      },
      auth: {
        requireEmailVerification: false,
        otpTriggers: [],
        sessionDuration: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    })
  }

  return sdkInstance
}

export function resetSDK(): void {
  sdkInstance = null
}
