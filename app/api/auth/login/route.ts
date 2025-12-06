// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Login API Route

import { type NextRequest, NextResponse } from "next/server"
import { getSDK } from "@/lib/sdk-instance"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const sdk = getSDK()
    const result = await sdk.login(email, password)

    if ("otpRequired" in result) {
      return NextResponse.json({ otpRequired: true })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Login failed" }, { status: 401 })
  }
}
