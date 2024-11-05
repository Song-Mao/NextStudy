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
interface ChatListProps {}

const ChatList: React.FC<ChatListProps> = () => {

  const { socket} = useSocket() as SocketContextType
  console.log('ChatList');
  const dispatch = useDispatch();
  const conversationList = useSelector((state: RootState) => state.chat.conversationList);
  const selectedChat = useSelector((state: RootState) => state.chat.selectedChat);

  useEffect(() => {
    socket?.on('message', (data:MessageData) => {
      dispatch(addConversation(data));
      console.log(conversationList, '更新后的历史消息')
      console.log(data, '收到消息')
    })
    socket?.on('heartbeat', (data:MessageData) => {
      console.log(data, '心跳')
    })
  }, [socket])
  // useEffect(() => {
  //   if (socketService) {
  //     socketService.on('message', (data: MessageData) => {
  //       dispatch(addConversation(data));
  //       console.log(conversationList, '更新后的历史消息');
  //       console.log(data, '收到消息');
  //     });

  //     socketService.on('heartbeat', (data: MessageData) => {
  //       console.log(data, '心跳');
  //     });

  //     return () => {
  //       socketService.disconnect();
  //     };
  //   }
  // }, [socketService, dispatch, conversationList]);

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
    <div className="w-1/4 bg-white border-r border-gray-200 shadow-lg flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">聊天列表</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Icon icon="mdi:dots-vertical" className="text-gray-600" />
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="搜索聊天..."
            className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Icon icon="mdi:magnify" className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {chats && chats.filter(chat => chat.id !== JSON.parse(localStorage.getItem('userInfo') || '{}').id).map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSetSelectedChat(chat)}
            className={`flex items-center cursor-pointer p-3 mb-2 rounded-lg 
              transition-all duration-200 border
              ${selectedChat?.id === chat.id
                ? 'bg-blue-50 border-blue-200 shadow-sm'
                : 'hover:bg-gray-100 border-transparent hover:border-gray-200 hover:shadow-sm'
              }`}
          >
            <div className="relative">
              <UserAvatar username={chat.username} />
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${chat.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{chat.username}</span>
                <span className={`text-xs ${chat.isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                  {chat.isOnline ? '在线' : '离线'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
        >
          <Icon icon="mdi:logout" />
          退出登录
        </button>
      </div>
    </div>
  );
}

export default ChatList;