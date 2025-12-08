import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

/**
 * NextAuth middleware to protect routes
 * 
 * Protected routes:
 * - /gallery (and all sub-routes)
 * - /api/photos (and all sub-routes)
 * - /api/upload
 * 
 * Public routes:
 * - /login
 * - /api/auth
 * - Static assets
 */
export default withAuth(
  function middleware() {
    // Allow the request to continue
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow public routes
        if (
          pathname.startsWith('/login') ||
          pathname.startsWith('/api/auth') ||
          pathname === '/' ||
          pathname.startsWith('/_next') ||
          pathname.startsWith('/favicon') ||
          pathname.includes('.')
        ) {
          return true;
        }
        
        // Require authentication for protected routes
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

/**
 * Matcher configuration
 * 
 * Applies middleware to these paths:
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

