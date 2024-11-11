// src/contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import socketService from '@/lib/socketService'; // 调整路径以匹配您的项目结构

interface SocketContextType {
    socket: typeof socketService | null;
    selectedChat: ChatData | null; // 根据您的需求调整类型
    setSelectedChat: React.Dispatch<React.SetStateAction<ChatData | null>>; // 根据您的需求调整类型
    conversationList: MessageData[];
    setConversationList: React.Dispatch<React.SetStateAction<MessageData[]>>;
}

const SocketContext = createContext<SocketContextType | null>(null);
interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> =({ children }) => {
    const [socket, setSocket] = useState<typeof socketService | null>(null); // socket实例
    const [selectedChat, setSelectedChat] = useState<ChatData | null>(null); // 当前选中的聊天对象
    // 聊天记录
    const [conversationList, setConversationList] = useState<MessageData[]>([]);

    console.log('创建上下文=>>>>>>>>SocketProvider')
    useEffect(() => {
        socketService.connect('http://localhost:4000/chat', {
            token: localStorage.getItem('token') || '',
            userId: JSON.parse(localStorage.getItem('userInfo') || '{}').id
        });
        setSocket(socketService);

        return () => {
            socketService.disconnect();
        };
    }, []);

    // 返回SocketContext.Provider，提供socket, selectedChat, setSelectedChat, conversationList, setConversationList这些属性
    return (
        <SocketContext.Provider value={{ socket, selectedChat, setSelectedChat, conversationList, setConversationList }}>
            {children}
        </SocketContext.Provider>
    );
}
export const useSocket = (): SocketContextType | null => useContext(SocketContext);