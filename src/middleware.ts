import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Retrieve the Firebase auth token from cookies
  const token = req.cookies.get("firebase-auth")?.value;

  // Define protected routes (pages that require authentication)
  const protectedRoutes = ["/", "/company"];

  // If user is NOT authenticated and is accessing a protected route, redirect to login
  if (
    !token &&
    protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next(); // Allow the request to continue
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/", "/company/:path*"], // List of protected routes
};
