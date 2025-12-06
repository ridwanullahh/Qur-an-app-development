// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Logout API Route

import { type NextRequest, NextResponse } from "next/server"
import { getSDK } from "@/lib/sdk-instance"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (token) {
      const sdk = getSDK()
      sdk.destroySession(token)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
