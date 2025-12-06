// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Register API Route

import { type NextRequest, NextResponse } from "next/server"
import { getSDK } from "@/lib/sdk-instance"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const sdk = getSDK()
    const user = await sdk.register(email, password, { name })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Registration failed" }, { status: 400 })
  }
}
