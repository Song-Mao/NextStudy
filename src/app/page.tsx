"use client";

import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';

const HomePage = () => {

  return (
    <div className="flex h-screen">
      <ChatList />
      <ChatWindow />
    </div>
  );
};

export default HomePage;