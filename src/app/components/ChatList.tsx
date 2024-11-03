import UserAvatar from './UserAvatar';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { logout } from '@/api/allApi';
import { getUserList } from '@/api/allApi';
import { useState, useEffect } from 'react';
import socketService from '@/lib/socketService';
interface chat {
  id: string;
  username: string;
  isOnline: boolean;
}

interface ChatListProps {
  setSelectedChat: (chat: chat) => void;
}

const ChatList: React.FC<ChatListProps> = ({ setSelectedChat }) => {
  const router = useRouter();
  // 处理退出登录
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

  // 从ChatContext中获取必要的状态和方法
  // chats: 聊天列表数组
  // setSelectedChat: 设置当前选中的聊天的方法
  // selectedChat: 当前选中的聊天
  const [chats, setChats] = useState<chat[]>([])
  const selectedChat = ''
  const onSetSelectedChat = (chat: chat) => {
    console.log('选择联系人')
    socketService.emit('message', { content: '开门，是我!', sender: chat.username, timestamp: new Date().toISOString() });
    setSelectedChat(chat)

  }
  const getUsersList = async () => {
    const { data } = await getUserList()
    setChats(data)
  }

  useEffect(() => {
    socketService.connect(`http://localhost:4000`, localStorage.getItem('token') || ''); //连接websocket

    // 组件挂载时调用getUsersList
    getUsersList();

  }, []);


  return (
    // 整体容器：占据1/4宽度，白色背景，右侧边框，阴影效果
    < div className="w-1/4 bg-white border-r border-gray-200 shadow-lg flex flex-col h-full" >
      {/* 顶部区域：包含标题、搜索框和操作按钮 */}
      < div className="p-4 border-b border-gray-200" >
        {/* 标题和更多操作按钮 */}
        <div className="flex items-center justify-between mb-4" >
          <h2 className="text-xl font-bold text-gray-800">聊天列表</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Icon icon="mdi:dots-vertical" className="text-gray-600" />
          </button>
        </div>
        {/* 搜索框区域 */}
        <div className="relative" >
          <input
            type="text"
            placeholder="搜索聊天..."
            className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {/* 搜索图标 */}
          <Icon icon="mdi:magnify" className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div >

      {/* 聊天列表主体区域：可滚动 */}
      <div className="flex-1 overflow-y-auto p-4" >
        {/* 使用map函数遍历渲染每个聊天项，排除当前用户 */}
        {
          chats && chats.filter(chat => chat.id !== JSON.parse(localStorage.getItem('userInfo') || '{}').id).map((chat) => (
            <div
              key={chat.id} // React需要的唯一key
              onClick={() => onSetSelectedChat(chat)} // 点击时切换选中的聊天
              className={`flex items-center cursor-pointer p-3 mb-2 rounded-lg 
              transition-all duration-200 border
              ${selectedChat === chat.id // 根据是否被选中显示不同样式
                  ? 'bg-blue-50 border-blue-200 shadow-sm' // 选中状态样式
                  : 'hover:bg-gray-100 border-transparent hover:border-gray-200 hover:shadow-sm' // 未选中状态样式
                }`}
            >
              {/* 用户头像和在线状态 */}
              <div className="relative">
                <UserAvatar username={chat.username} />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${chat.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              {/* 聊天信息区域 */}
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{chat.username}</span>
                  <span className={`text-xs ${chat.isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                    {chat.isOnline ? '在线' : '离线'}
                  </span>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      {/* 底部新建聊天按钮区域 */}
      < div className="p-4 border-t border-gray-200" >
        < button
          onClick={handleLogout}
          className="w-full  px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
        >
          <Icon icon="mdi:logout" />
          退出登录
        </button >
      </div >
    </div >
  );
};

// 导出ChatList组件供其他组件使用
export default ChatList;
