import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This is a simple middleware to handle authentication
// In a real app, you would verify JWT tokens or session cookies
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" || path.startsWith("/api/login") || path.startsWith("/api/register") || path.startsWith("/api/query")

  // Check if the request is for a protected API route
  const isProtectedApiRoute =
    path.startsWith("/api/repositories") || path.startsWith("/api/ingest") || path.startsWith("/api/get-user-repos")

  // Get the token from the request headers
  const token = request.headers.get("authorization")?.replace("Bearer ", "")

  // For protected API routes, check for the token in the Authorization header
  if (isProtectedApiRoute && !token) {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 })
  }

  // For protected pages, check for the token in cookies
  // and redirect to login if not authenticated
  const authCookie = request.cookies.get("auth-token")?.value

  if (!isPublicPath && !authCookie) {
    // For demo purposes, we'll skip this check to make testing easier
    // In a real app, you would redirect to login
    // return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Protected routes
    "/dashboard/:path*",

    // Protected API routes
    "/api/repositories/:path*",
    "/api/ingest/:path*",
    "/api/get-user-repos/:path*",
  ],
}
