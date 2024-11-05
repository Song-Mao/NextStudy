"use client";
import UserAvatar from './UserAvatar';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { logout } from '@/api/allApi';
import { getUserList } from '@/api/allApi';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addConversation, setSelectedChat } from '@/store/chatSlice';
import React from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Button } from '@/components/ui/button';
const ChatList: React.FC = () => {
  const { socket } = useSocket() as SocketContextType
  const dispatch = useDispatch();
  const selectedChat = useSelector((state: RootState) => state.chat.selectedChat);

  useEffect(() => {
    socket?.on('message', (data: MessageData) => {
      dispatch(addConversation(data));
    })
    socket?.on('heartbeat', (data: MessageData) => {
      console.log(data, '心跳')
    })
  }, [socket])
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      await logout(userInfo.id);
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
      router.push('/login');
    } catch (error) {
      console.error('退出登录失败:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
      router.push('/login');
    }
  };

  const [chats, setChats] = useState<ChatData[]>([]);

  const getUsersList = async () => {
    const { data } = await getUserList();
    setChats(data);
  };

  useEffect(() => {
    getUsersList();
  }, []);

  const onSetSelectedChat = (chat: ChatData) => {
    dispatch(setSelectedChat(chat));
  };

  return (
    <div className="w-1/4 bg-white border-r border[#eee]  flex flex-col h-full">
      <div className="p-4 border-b border[red]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">你好,{JSON.parse(localStorage.getItem('userInfo') || '{}').username}</h2>
          {/* <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <Icon icon="mdi:dots-vertical" className="text-gray-500" />
          </button> */}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="搜索聊天..."
            className="w-full px-4 py-2 pl-10 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <Icon icon="mdi:magnify" className="absolute left-3 top-3 text-gray-500" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {chats && chats.filter(chat => chat.id !== JSON.parse(localStorage.getItem('userInfo') || '{}').id).map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSetSelectedChat(chat)}
            className={`flex items-center cursor-pointer px-1 py-2 mb-2 rounded-md 
              transition-all duration-200 border
              ${selectedChat?.id === chat.id
                ? ' border-black shadow-inner'
                : 'hover:bg-gray-200 border-transparent hover:border-gray-300 hover:shadow-inner'
              }`}
          >
            <div className="relative">
              <UserAvatar username={chat.username} />
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${chat.isOnline ? 'bg-green-400' : 'bg-gray-500'}`} />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">{chat.username}</span>
                <span className={`text-xs ${chat.isOnline ? 'text-green-400' : 'text-gray-500'}`}>
                  {chat.isOnline ? '在线' : '离线'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-300">
        <Button
          onClick={handleLogout}
          className="w-full px-3 py-1 text-white rounded-md transition-colors flex items-center gap-1"
        >
          <Icon icon="mdi:logout" />
          退出登录
        </Button>
      </div>
    </div>
  );
}

export default ChatList;