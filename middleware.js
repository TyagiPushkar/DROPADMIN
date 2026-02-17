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
  const publicRoutes = ["/", "/login","/add-rider","/about","/privacy","/services", "/terms","/add-vendor"];
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Not logged in → redirect home
  if (!user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

 
  if (user.UserType === "SuperAdmin") {
    const superAdminAllowed = [
      "/analytics",
      "/orders",
      "/settings",
      "/vendors",
      "/riders",
      "/rides",
      "/rider-ledger",
      "/rider-directory",
      "/fares",
      "/transactions"
    ];

    // Customer must stay inside allowed routes
    const isAllowed = superAdminAllowed.some((route) =>
      path.startsWith(route)
    );

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/settings", request.url));
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
