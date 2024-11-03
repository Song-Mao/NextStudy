"use client"; // 确保这个文件是客户端组件

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SocketProvider } from '@/app/context/SocketContext';
import '@/styles/globals.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token,'token=>>>>>>>>>>>>')
    if (!token) {
      router.push('/login'); // 如果没有token，重定向到登录页
    }
  }, [router]);

  return (
    <html lang="zh">
      <body>
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
};

export default Layout;
