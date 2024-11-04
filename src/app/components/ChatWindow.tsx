// 导入必要的依赖
"use client";
import React, { useState, useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import Message from './Message';
import socketService from '@/lib/socketService';
import MessageInput from './MessageInput';
import { conversation, createConversation } from '@/api/allApi';
interface Chat {
  id?: string;
  username?: string;
  messages?: Array<{ id: string; content: string; timestamp: string; sender: string }>;
  to?: string;
  from?: string;
}
interface ChatWindowProps {
  selectedChat?: Chat;
}

interface SocketContextType {
  socket: typeof socketService | null;
  selectedChat?: Chat
}



// ChatWindow组件: 显示聊天窗口的主要组件
const ChatWindow: React.FC<ChatWindowProps> = () => {
  const { selectedChat } = useSocket() as SocketContextType
  const [conversationId, setConversationId] = useState('')
  const getConversation = async () => {
    const { data } = await conversation(selectedChat?.id || '')
    console.log(data, 'data=>>>>>>>>>>>>')
    if(!data){
      // 创建会话
      const data = {
        type: 'private',
      }
      const {data: resData} = await createConversation({...data})
      setConversationId(resData.id)
      // console.log(resData, 'resData=>>>>>>>>>>>>')
      
    }

  }

  useEffect(() => {
    if (selectedChat?.id) {
      console.log(selectedChat, 'selectedChat=>>>>>>>>>>>>')
      console.log('ChatWindow')
      getConversation()
    }
  }, [selectedChat])
  return (
    <main className="flex-1 bg-white p-6 h-full flex flex-col shadow-lg">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {selectedChat?.username}
        </h2>

      </div>
      <div className="flex-1 border border-gray-200 rounded-lg p-6 overflow-y-auto bg-gray-50">
        {selectedChat?.messages && selectedChat?.messages.map(message => (
          <Message
            key={message.id}
            content={message.content}
            timestamp={message.timestamp}
            sender={message.sender}
          />
        ))}
      </div>
      <MessageInput conversationId={conversationId} />
    </main>
  );
};

export default ChatWindow;
