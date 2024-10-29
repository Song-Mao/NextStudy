"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';

const HomePage = () => {
  const router = useRouter();
  
  useEffect(() => {
    console.log('我执行了');
    // 模拟用户未登录状态
    const isLoggedIn = false; // 这里可以替换为实际的登录状态检查
    if (!isLoggedIn) {
      console.log('用户未登录，重定向到登录页');
      router.push('/login'); // 重定向到登录页
    }
  }, [router]);

  return (
    <div className="flex h-screen">
      <ChatList />
      <ChatWindow />
    </div>
  );
};

export default HomePage;