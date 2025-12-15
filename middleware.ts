import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// Middleware to protect admin routes

export function middleware(request: NextRequest) {
    // Check if accessing admin route
    if (request.nextUrl.pathname.startsWith("/admin")) {
        const token = request.cookies.get("auth-token")

        if (!token) {
            // Redirect to login if no token
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*"],
}
