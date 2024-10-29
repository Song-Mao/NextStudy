"use client"; // 确保这个文件是客户端组件

import React from 'react';
import { ChatProvider } from './contexts/ChatContext'; // 导入 ChatProvider
import { Toaster } from "@/components/ui/toaster"

import '@/styles/globals.css'
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="zh">
      <body>
        <ChatProvider>
          {children}
          <Toaster />

        </ChatProvider>
      </body>
    </html>
  );
};

export default Layout;
