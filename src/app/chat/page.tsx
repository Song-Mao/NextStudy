"use client";
import React, { useEffect } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { SocketProvider } from '../../contexts/SocketContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { initializeSocket, addConversation } from '@/store/chatSlice';

const ChatPage: React.FC = () => {
    const dispatch = useDispatch();
    const socketService = useSelector((state: RootState) => state.chat.socketService);

    // useEffect(() => {
    //     if (!socketService) {
    //         dispatch(initializeSocket({
    //             url: 'http://localhost:4000/chat',
    //             token: localStorage.getItem('token') || '',
    //             userId: JSON.parse(localStorage.getItem('userInfo') || '{}').id,
    //         }));
    //     }

    //     if (socketService) {
    //         socketService.on('message', (messageData) => {
    //             dispatch(addConversation(messageData));
    //         });
    //     }
    // }, [dispatch, socketService]);

    return (
        <SocketProvider>
            <div className="flex w-full h-screen">
                <ChatList />
                <ChatWindow />
            </div>
        </SocketProvider>
    );
};

export default ChatPage; 