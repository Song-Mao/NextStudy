import React, { createContext, useContext, useState } from 'react';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: string;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: Message;
  messages: Message[];
  isGroup: boolean;
  members?: string[];
}

interface ChatContextType {
  chats: Chat[];
  selectedChat: string;
  setSelectedChat: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState<string>('1');
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      name: '张三',
      avatar: '/avatars/zhangsan.jpg',
      isGroup: false,
      messages: [
        {
          id: '1',
          content: '你好，最近在忙什么呢？',
          timestamp: '2024-01-10 09:30',
          sender: '张三'
        },
        {
          id: '2', 
          content: '我在处理新项目的需求分析',
          timestamp: '2024-01-10 09:35',
          sender: 'me'
        }
      ]
    },
    {
      id: '2',
      name: '技术部群',
      avatar: '/avatars/tech-group.jpg',
      isGroup: true,
      members: ['张三', '李四', '王五', '赵六'],
      messages: [
        {
          id: '1',
          content: '下午3点开技术评审会议',
          timestamp: '2024-01-10 10:00',
          sender: '李四'
        },
        {
          id: '2',
          content: '好的，我准时参加',
          timestamp: '2024-01-10 10:05',
          sender: '王五'
        }
      ]
    },
    {
      id: '3',
      name: '李四',
      avatar: '/avatars/lisi.jpg',
      isGroup: false,
      messages: [
        {
          id: '1',
          content: '代码审查通过了吗？',
          timestamp: '2024-01-09 16:30',
          sender: '李四'
        }
      ]
    }
  ]);

  return (
    <ChatContext.Provider value={{ chats, selectedChat, setSelectedChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
