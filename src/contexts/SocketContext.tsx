// src/contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import socketService from '@/lib/socketService'; // 调整路径以匹配您的项目结构

interface SocketContextType {
    socket: typeof socketService | null;
    selectedChat: any; // 根据您的需求调整类型
    setSelectedChat: React.Dispatch<React.SetStateAction<any>>; // 根据您的需求调整类型
}

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> =React.memo( ({ children }) => {
    const [socket, setSocket] = useState<typeof socketService | null>(null);
    const [selectedChat, setSelectedChat] = useState<any>(null); // 添加新的状态和更新函数
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

    return (
        <SocketContext.Provider value={{ socket, selectedChat, setSelectedChat }}>
            {children}
        </SocketContext.Provider>
    );
})
SocketProvider.displayName = 'SocketProvider'
export const useSocket = (): SocketContextType | null => useContext(SocketContext);