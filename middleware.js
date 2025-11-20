import { NextResponse } from "next/server";

export function middleware(request) {
  const cookie = request.cookies.get("user")?.value;
  const user = cookie ? JSON.parse(cookie) : null;

  const path = request.nextUrl.pathname;

  // Skip internal assets/api
  if (
    path.startsWith("/_next") ||
    path.startsWith("/favicon") ||
    path.startsWith("/icons") ||
    path.startsWith("/images") ||
    path.startsWith("/sounds") ||
    path.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Public routes
  const publicRoutes = ["/", "/add-vendor", "/login"];
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Not logged in → redirect home
  if (!user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // --------------------
  // CUSTOMER ACCESS
  // --------------------
  if (user.UserType === "Customer") {
    // They can only access /analytics
    if (!path.startsWith("/analytics")) {
      return NextResponse.redirect(new URL("/analytics", request.url));
    }
    return NextResponse.next();
  }

  // --------------------
  // RESTAURANT ACCESS
  // --------------------
  if (user.UserType === "Restaurant") {
    const vendorPath = `/vendor-dashboard/${user.UserId}`;

    // Only allow this restaurant’s own dashboard
    if (!path.startsWith(vendorPath)) {
      return NextResponse.redirect(new URL(vendorPath, request.url));
    }
    return NextResponse.next();
  }

  // --------------------
  // RIDER ACCESS
  // --------------------
  if (user.UserType === "Rider") {
    // Decide rider landing page (example)
    const riderHome = `/rider-dashboard/${user.UserId}`;
    if (!path.startsWith(riderHome)) {
      return NextResponse.redirect(new URL(riderHome, request.url));
    }
    return NextResponse.next();
  }

  // Unknown role → logout
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|icons|images |sounds).*)"],
};
