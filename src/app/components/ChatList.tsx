"use client";
import UserAvatar from './UserAvatar';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { logout } from '@/api/allApi';
import { getUserList, conversationAll } from '@/api/allApi';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addConversation, setSelectedChat, clearChatState } from '@/store/chatSlice';
import React from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ChatList: React.FC = () => {
  const { socket } = useSocket() as SocketContextType
  const dispatch = useDispatch();
  const selectedChat = useSelector((state: RootState) => state.chat.selectedChat);
  const [conversations, setconversations] = useState<MessageData[]>([]);

  const getConversation = async () => {
    const { data } = await conversationAll();
    setconversations(data as MessageData[]);
    console.log(data, '会话记录=>>>>>>>>>>>>');
  };
  useEffect(() => {
    socket?.on('message', (data: MessageData) => {
      dispatch(addConversation(data));

      getUsersList();
    })
    socket?.on('heartbeat', (data: MessageData) => {
      console.log(data, '心跳')
    })
  }, [socket])
  const router = useRouter();

  // 退出登录
  const handleLogout = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      await logout(userInfo.id);
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
      dispatch(clearChatState()); // 清除store中的聊天状态
      router.push('/login');
    } catch (error) {
      console.error('退出登录失败:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
      dispatch(clearChatState()); // 清除store中的聊天状态
      router.push('/login');
    }
  };

  const [chats, setChats] = useState<MessageData[]>([]);
  // 获取用户列表
  const getUsersList = async () => {
    const { data } = await getUserList();
    setChats(data);
  };

  useEffect(() => {
    getUsersList();
  }, []);
  const [tabActive, setTabActive] = useState('allUser')
  // 设置选中聊天
  const onSetSelectedChat = (chat: MessageData[], type: string) => {
    if (type === 'allUser') {
      setTabActive('recent')
      getConversation()
    }
    dispatch(setSelectedChat(chat));
  };

  // 使用useState来存储userInfo，确保只在客户端设置
  const [userInfo, setUserInfo] = useState<{ username?: string }>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserInfo(JSON.parse(localStorage.getItem('userInfo') || '{}'));
    }
  }, []);

  return (
    <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg">
      <div className="p-4 border-b border-gray-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">你好, {userInfo.username}</h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="搜索聊天..."
            className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Icon icon="mdi:magnify" className="absolute left-3 top-3 text-gray-500" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <Tabs defaultValue='allUser' value={tabActive} className="w-full">
          <TabsList className='w-full'>
            <TabsTrigger value="allUser" className='w-1/2' onClick={() => setTabActive('allUser')}>所有用户</TabsTrigger>
            <TabsTrigger value="recent" className='w-1/2' onClick={() => { setTabActive('recent'); getConversation(); }}>最近聊天</TabsTrigger>
          </TabsList>
          <TabsContent value={tabActive}>
            {(tabActive === 'allUser' ? chats : conversations).map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSetSelectedChat(tabActive === 'allUser' ? chat : chat.receiver, tabActive)}
                className={`flex items-center cursor-pointer px-3 py-2 mb-2 rounded-lg 
                  transition-all duration-200 border
                  ${selectedChat?.id === (tabActive === 'allUser' ? chat.id : chat.receiver.id)
                    ? 'border-black shadow-md'
                    : 'hover:bg-gray-100 border-transparent hover:border-gray-300 hover:shadow-sm'
                  }`}
              >
                <div className="relative">
                  <UserAvatar username={tabActive === 'allUser' ? chat.username : chat.receiver.username} />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${(tabActive === 'allUser' ? chat.isOnline : chat.receiver.isOnline) ? 'bg-green-400' : 'bg-gray-500'
                    }`} />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex flex-col justify-between">
                    <span className="font-medium text-gray-800">{tabActive === 'allUser' ? chat.username : chat.receiver.username}</span>
                    {tabActive === 'recent' && <span className="text-xs text-gray-600">{chat.lastMessage?.content}</span>}
                    <span className={`text-xs ${(tabActive === 'allUser' ? chat.isOnline : chat.receiver.isOnline) ? 'text-green-400' : 'text-gray-500'
                      }`}>
                      {(tabActive === 'allUser' ? chat.isOnline : chat.receiver.isOnline) ? '在线' : '离线'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-4 border-t border-gray-300">
        <Button
          onClick={handleLogout}
          className="w-full px-3 py-2 text-white bg-black rounded-md transition-colors hover:bg-gray-800 flex items-center gap-1"
        >
          <Icon icon="mdi:logout" />
          退出登录
        </Button>
      </div>
    </div>
  );
}
export default ChatList;