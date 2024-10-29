import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthenticated = !!request.cookies.get('auth-token'); // 检查 cookies 中的 auth-token

  // 检查是否访问受保护的路由
  if (path === '/' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url)); // 重定向到登录页
  }

  return NextResponse.next(); // 继续处理请求
}

// 配置中间件应用的路径
export const config = {
  matcher: ['/', '/login'], // 只对这些路径应用中间件
};
