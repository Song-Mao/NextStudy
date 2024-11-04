"use client";
import React, { useEffect, useState } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import socketService from "@/lib/socketService";
import { SocketProvider } from '../../contexts/SocketContext';
const ChatPage: React.FC = () => {
    console.log('ChatPage')
    // // 当前选中的聊天
    // const [selectedChat, setSelectedChat] = useState({});
    // // socket实例
    // const socket: typeof socketService = socketService;
    // useEffect(() => {
    //     const token = localStorage.getItem('token') || '';
    //     socket.connect('http://localhost:4000/chat', {
    //         token,
    //         userId: JSON.parse(localStorage.getItem('userInfo') || '{}').id
    //     })

    //     // 监听'message'事件以接收消息
    //     socket.on('message', (message) => {
    //         console.log('Received message 来自服务端:', message);
    //     });
    //     return () => {
    //         socket.disconnect()
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])
    return (
        <SocketProvider>
            <div className="flex w-full h-screen">
                <ChatList ></ChatList>
                <ChatWindow ></ChatWindow>
            </div>
        </SocketProvider>
    )

}

export default ChatPage;