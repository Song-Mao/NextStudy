"use client"; // 确保这个文件是客户端组件

import React from 'react';
import { ChatProvider } from './contexts/ChatContext'; // 导入 ChatProvider
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from 'next/navigation'

import '@/styles/globals.css'
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'
  return (
    <html lang="zh">
      <body>
        {isLoginPage ? children : (
          <ChatProvider>
            {children}
          </ChatProvider>
        )}
           <Toaster />
      </body>
    </html>
  );
};

export default Layout;
