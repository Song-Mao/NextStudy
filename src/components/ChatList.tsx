// 导入必要的依赖
// useChat: 自定义Hook，用于访问聊天相关的上下文数据
import { useChat } from '@/app/contexts/ChatContext';
// UserAvatar: 用户头像组件
import UserAvatar from './UserAvatar';
// Icon: 图标组件，用于显示各种图标
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
// ChatList组件: 显示聊天列表的主要组件
// React.FC 表示这是一个函数组件(Function Component)
const ChatList: React.FC = () => {
  const router = useRouter();
  // 处理退出登录
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
    router.push('/login');
  };

  // 从ChatContext中获取必要的状态和方法
  // chats: 聊天列表数组
  // setSelectedChat: 设置当前选中的聊天的方法
  // selectedChat: 当前选中的聊天
  const { chats, setSelectedChat, selectedChat } = useChat();
  console.log('chats', chats)
  return (
    // 整体容器：占据1/4宽度，白色背景，右侧边框，阴影效果
    <div className="w-1/4 bg-white border-r border-gray-200 shadow-lg flex flex-col h-full">
      {/* 顶部区域：包含标题、搜索框和操作按钮 */}
      <div className="p-4 border-b border-gray-200">
        {/* 标题和更多操作按钮 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">聊天列表</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Icon icon="mdi:dots-vertical" className="text-gray-600" />
          </button>
        </div>
        {/* 搜索框区域 */}
        <div className="relative">
          <input
            type="text"
            placeholder="搜索聊天..."
            className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {/* 搜索图标 */}
          <Icon icon="mdi:magnify" className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* 聊天列表主体区域：可滚动 */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* 使用map函数遍历渲染每个聊天项，排除当前用户 */}
        {chats && chats.filter(chat => chat.id !== JSON.parse(localStorage.getItem('userInfo') || '{}').id).map((chat) => (
          <div
            key={chat.id} // React需要的唯一key
            onClick={() => setSelectedChat(chat.id)} // 点击时切换选中的聊天
            className={`flex items-center cursor-pointer p-3 mb-2 rounded-lg 
              transition-all duration-200 border
              ${selectedChat === chat.id // 根据是否被选中显示不同样式
                ? 'bg-blue-50 border-blue-200 shadow-sm' // 选中状态样式
                : 'hover:bg-gray-100 border-transparent hover:border-gray-200 hover:shadow-sm' // 未选中状态样式
              }`}
          >
            {/* 用户头像 */}
            <UserAvatar username={chat.username} />
            {/* 聊天信息区域 */}
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{chat.username}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部新建聊天按钮区域 */}
      <div className="p-4 border-t border-gray-200">
        {/* <button className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
          <Icon icon="mdi:plus" />
          <span>新建聊天</span>
        </button> */}
        <button
          onClick={handleLogout}
          className="w-full  px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
        >
          <Icon icon="mdi:logout" />
          退出登录
        </button>
      </div>
    </div>
  );
};

// 导出ChatList组件供其他组件使用
export default ChatList;
