"use client";
import React from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { SocketProvider } from '../../contexts/SocketContext';
const ChatPage: React.FC = () => {
    console.log('ChatPage')
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