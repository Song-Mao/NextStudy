// 导入必要的依赖
"use client";
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setConversationList, setConversationId } from '@/store/chatSlice';
import Message from './Message';
import MessageInput from './MessageInput';
import { conversation, getCurrentConversationList } from '@/api/allApi';

interface ChatWindowProps {
  selectedChat?: ChatData;
}


// ChatWindow组件: 显示聊天窗口的主要组件
const ChatWindow: React.FC<ChatWindowProps> = () => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state: RootState) => state.chat.selectedChat);
  const conversationList = useSelector((state: RootState) => state.chat.conversationList);
  const getConversation = async () => {
    const { id: currentUserId } = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const { data } = await conversation({
      currentUserId,
      targetUserId: selectedChat?.id as string
    });
    dispatch(setConversationId(data.id));
    const { data: conversationList } = await getCurrentConversationList(data.id);
    dispatch(setConversationList(conversationList));
    console.log(conversationList, '消息记录=>>>>>>>>>>>>');
  };

  useEffect(() => {
    if (selectedChat?.id) {
      console.log(selectedChat, 'selectedChat=>>>>>>>>>>>>');
      console.log('ChatWindow');
      getConversation();
    }
  }, [selectedChat]);

  return (
    <main className="flex-1 bg-white p-6 h-full flex flex-col shadow-lg">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {selectedChat?.username}
        </h2>
      </div>
      <div className="flex-1 border border-gray-200 rounded-lg p-6 overflow-y-auto bg-gray-50">
        {conversationList.length > 0 && conversationList.map((message: MessageData,index:number) => (
          <Message
            key={index}
            content={message.content}
            timestamp={message.timestamp || ''}
            sender={message.sender}
            receiver={message.receiver}
          />
        ))}
      </div>
      <MessageInput />
    </main>
  );
};

export default ChatWindow;
