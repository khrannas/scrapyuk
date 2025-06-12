import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/projects'];

// Routes that should redirect to dashboard if authenticated
const AUTH_ROUTES = ['/login'];

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // For now, let client-side handle authentication checks
  // Middleware will handle basic routing logic
  
  // Handle root route redirect - always go to login first, client will redirect if authenticated
  if (pathname === '/') {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};