import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserList } from '@/lib/request/api/allApi';
// 定义消息对象的接口
interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: string;
}

// 定义聊天对象的接口
interface Chat {
  id: string;
  username: string;
  avatar: string;
  lastMessage?: Message;
  messages: Message[];
  isGroup: boolean;
  members?: string[];
}

// 定义聊天上下文的类型
interface ChatContextType {
  chats: Chat[];
  selectedChat: string;
  setSelectedChat: (chatId: string) => void;
}

// 创建聊天上下文
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// 定义聊天提供者组件
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 初始化选中的聊天ID
  const [selectedChat, setSelectedChat] = useState<string>('1');
  // 初始化聊天列表
  const [chats, setChats] = useState<Chat[]>([]);
  console.log('我执行了')
  // 使用useEffect加载用户列表
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await getUserList(); // 使用fetch调用API
       // 解析JSON数据
        console.log('response', response)
        setChats(response.users); // 假设返回的数据是直接的聊天列表
      } catch (error) {
        setChats([])
        console.error('Failed to fetch chats:', error);
      }
    };

    fetchChats();
  }, []); // 空依赖数组表示这个effect仅在组件挂载时运行一次

  // 渲染聊天提供者
  return (
    <ChatContext.Provider value={{ chats, selectedChat, setSelectedChat }}>
      {children}
    </ChatContext.Provider>
  );
};

// 定义使用聊天上下文的Hook
export const useChat = () => {
  // 从上下文中获取聊天数据
  const context = useContext(ChatContext);
  // 如果上下文不存在，抛出错误
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  // 返回聊天上下文
  return context;
};
