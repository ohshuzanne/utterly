import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';


const publicRoutes = [
  '/login', 
  '/register', 
  '/api/auth', 
  '/forgot-password', 
  '/reset-password',
  '/api/auth/verify-token',
  '/api/auth/test-email',
  '/api/auth/debug-reset'
];

export async function middleware(request: NextRequest) {
//checking if path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // retrieving the token from the request
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // if there's no token, redirect to login page
  if (!token) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)',
  ],
}; 