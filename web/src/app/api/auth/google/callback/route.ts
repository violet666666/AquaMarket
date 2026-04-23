import { NextRequest, NextResponse } from "next/server"
import { setAuthToken } from "@lib/data/cookies"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  if (!code) {
    return NextResponse.redirect(new URL("/id/account", req.url))
  }

  // Exchange the code for a token via Medusa backend
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  
  try {
    const res = await fetch(
      `${backendUrl}/auth/customer/google/callback?code=${code}&state=${state}`,
      { method: "GET" }
    )

    if (!res.ok) {
      console.error("Google auth callback failed:", await res.text())
      return NextResponse.redirect(new URL("/id/account?error=auth_failed", req.url))
    }

    const data = await res.json()
    
    if (data.token) {
      await setAuthToken(data.token)
    }

    return NextResponse.redirect(new URL("/id/account", req.url))
  } catch (err) {
    console.error("Google auth error:", err)
    return NextResponse.redirect(new URL("/id/account?error=auth_failed", req.url))
  }
}
