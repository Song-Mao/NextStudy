"use client"; // 确保这个文件是客户端组件

import React from 'react';
import { ChatProvider } from './contexts/ChatContext'; // 导入 ChatProvider
import '@/styles/globals.css'
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="zh">
      <body>
        <ChatProvider>
          {children}
        </ChatProvider>
      </body>
    </html>
  );
};

export default Layout;
