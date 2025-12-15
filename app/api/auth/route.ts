import { NextRequest, NextResponse } from "next/server"
import { getSDK } from "@/lib/sdk-instance"
import { cookies } from "next/headers"

// Helper to set auth cookie
async function setAuthCookie(token: string) {
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
    })
}

async function removeAuthCookie() {
    const cookieStore = await cookies()
    cookieStore.delete("auth-token")
}

export async function POST(req: NextRequest) {
    const sdk = getSDK()

    try {
        const body = await req.json()
        const { action, email, password, name } = body

        if (action === "login") {
            const result = await sdk.login(email, password)

            if ('otpRequired' in result) {
                return NextResponse.json({ otpRequired: true })
            }

            await setAuthCookie(result.token)
            return NextResponse.json({ success: true, user: result.user })
        }

        if (action === "register") {
            const user = await sdk.register(email, password, { name })
            // Auto login after register
            try {
                const result = await sdk.login(email, password)
                if (!('otpRequired' in result)) {
                    await setAuthCookie(result.token)
                }
            } catch (e) {
                // Ignore auto-login error
            }
            return NextResponse.json({ success: true, user })
        }

        if (action === "logout") {
            // Ideally we also call sdk.destroySession(token) but we need to read the cookie first
            // For now, just clearing cookie is effective enough for client
            await removeAuthCookie()
            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 })

    } catch (error: any) {
        console.error("Auth Error:", error)
        return NextResponse.json(
            { error: error.message || "Authentication failed" },
            { status: 401 }
        )
    }
}

export async function GET(req: NextRequest) {
    const sdk = getSDK()
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
        return NextResponse.json({ user: null }, { status: 401 })
    }

    try {
        const user = await sdk.getCurrentUser(token)
        if (!user) {
            return NextResponse.json({ user: null }, { status: 401 })
        }
        return NextResponse.json({ user })
    } catch (error) {
        return NextResponse.json({ user: null }, { status: 401 })
    }
}
