"use client"; // 确保这个文件是客户端组件

import React from 'react';
// import { SocketProvider } from '@/app/context/SocketContext';
import '@/styles/globals.css';
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 
  return (
    <html lang="zh">
      <body>
          {children}
      </body>
    </html>
  );
};

export default Layout;
