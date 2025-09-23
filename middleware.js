import { NextResponse } from "next/server"

export function middleware(request) {
  const token = request.cookies.get("token")?.value || null

  const protectedRoutes = ["/analytics", "/vendors", "/orders"]

  if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}
