// 导入必要的依赖
"use client";
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setConversationList, setConversationId } from '@/store/chatSlice';
import Message from './Message';
import MessageInput from './MessageInput';
import { conversation, getCurrentConversationList } from '@/api/allApi';
import { ScrollArea } from "@/components/ui/scroll-area"
interface ChatWindowProps {
  selectedChat?: ChatData;
}


// ChatWindow组件: 显示聊天窗口的主要组件
const ChatWindow: React.FC<ChatWindowProps> = () => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state: RootState) => state.chat.selectedChat);
  const conversationList = useSelector((state: RootState) => state.chat.conversationList);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (scrollAreaRef.current) {
      // 使用 setTimeout 确保 DOM 更新完成后再执行滚动
      scrollAreaRef.current.scrollTop = scrollAreaRef.current?.scrollHeight;
      console.log('scrollAreaRef.current.scrollTop=>>>>>>>>>>>>', scrollAreaRef.current?.scrollHeight);
    }
  }, [scrollAreaRef.current?.scrollHeight]);
  return (
    <>
      {selectedChat ? (
        <main className="flex-1 bg-white p-6 h-full flex flex-col shadow-lg">
          <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4 ">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedChat.username}
            </h2>
          </div>
          <ScrollArea ref={scrollAreaRef} className="flex-1 pr-2 bg-white">
            {conversationList.length > 0 ? (
              conversationList.map((message: MessageData, index: number) => (
                <Message
                  key={index}
                  content={message.content}
                  timestamp={message.timestamp || ''}
                  sender={message.sender}
                  receiver={message.receiver}
                />
              ))
            ) : (
              <div className="text-center text-gray-500">没有选中的聊天</div>
            )}

          </ScrollArea>
          <MessageInput />

        </main>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 bg-[#FFF]">
          请选择一个聊天
        </div>
      )}
    </>
  );
};

export default ChatWindow;
