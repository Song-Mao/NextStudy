import React, { createContext, useContext, useEffect, useState } from 'react';
import socketService from '@/lib/socketService';

interface SocketContextProps {
    socketService: typeof socketService;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            console.log(token,'token=>>>>>>>>>>>>')
            socketService.connect('http://localhost:4000', token);
            return () => {
                socketService.disconnect();
            };
        }
    }, [token]);

    return (
        <SocketContext.Provider value={{ socketService }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = (): SocketContextProps => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}; 