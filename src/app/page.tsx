"use client";

import React, { useState } from 'react';
import ChatList from '@/app/components/ChatList';
import ChatWindow from '@/app/components/ChatWindow';
const HomePage = () => {
  const [selectedChat, setSelectedChat] = useState({});

  return (
    <div className="flex h-screen">
      <ChatList setSelectedChat={setSelectedChat} />
      <ChatWindow selectedChat={selectedChat} />
    </div>
  );
};

export default HomePage;