"use client"; // 确保这个文件是客户端组件

import React from 'react';
// import { SocketProvider } from '@/app/context/SocketContext';
import '@/styles/globals.css';
import { Provider } from 'react-redux';
import store from '@/store';
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  return (
    <html lang="zh">
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
};

export default Layout;
