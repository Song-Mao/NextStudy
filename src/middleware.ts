import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('middleware');
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = !!token;


  if (path === '/' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  // if(path === '/login' && isAuthenticated){
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login'],
};
