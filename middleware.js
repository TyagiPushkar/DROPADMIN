import { NextResponse } from "next/server"

export function middleware(request) {
  const user = request.cookies.get("user")?.value || null

  const protectedRoutes = ["/analytics", "/vendors", "/orders"]

  if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}
