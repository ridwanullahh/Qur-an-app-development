// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Session API Route

import { type NextRequest, NextResponse } from "next/server"
import { getSDK } from "@/lib/sdk-instance"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const sdk = getSDK()
    const session = sdk.getSession(token)

    if (!session) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }

    // Refresh the session
    sdk.refreshSession(token)

    return NextResponse.json({
      user: session.user,
      session: {
        token: session.token,
        created: session.created,
        expires: session.expires,
      },
    })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ error: "Session check failed" }, { status: 500 })
  }
}
