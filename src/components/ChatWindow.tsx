// 导入必要的依赖
import React, { useState } from 'react';
import { useChat } from '../app/contexts/ChatContext';
import Message from './Message';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation'


// MessageInput组件: 消息输入框组件
const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // TODO: 实现发送消息的逻辑
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="输入消息..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
      >
        <Icon icon="mdi:send" />
        发送
      </button>
    </form>
  );
};

// ChatWindow组件: 显示聊天窗口的主要组件
const ChatWindow: React.FC = () => {
  const router = useRouter();
  // 从ChatContext中获取当前选中的聊天ID和所有聊天列表
  const { selectedChat, chats } = useChat();
  // 根据选中的聊天ID查找当前聊天对象
  const currentChat = chats.find(chat => chat.id === selectedChat);

  // 处理退出登录
  const handleLogout = () => {
    // 清除本地存储的token
    localStorage.removeItem('token');
    // 跳转到登录页面
    router.push('/login');
  };

  // 如果没有选中的聊天，显示提示信息
  if (!currentChat) {
    return <div>未选择聊天</div>;
  }

  return (
    // 聊天窗口主容器：占据剩余空间，白色背景，内边距，阴影效果
    <main className="flex-1 bg-white p-6 h-full flex flex-col shadow-lg">
      {/* 聊天标题区域：包含标题和退出按钮 */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {currentChat.name}
        </h2>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
        >
          <Icon icon="mdi:logout" />
          退出登录
        </button>
      </div>
      {/* 消息列表容器：可滚动，带边框和背景色 */}
      <div className="flex-1 border border-gray-200 rounded-lg p-6 overflow-y-auto bg-gray-50">
        {/* 遍历渲染每条消息 */}
        {currentChat.messages.map(message => (
          <Message
            key={message.id}
            content={message.content}
            timestamp={message.timestamp}
            sender={message.sender}
          />
        ))}
      </div>
      {/* 添加消息输入框组件 */}
      <MessageInput />
    </main>
  );
};

export default ChatWindow;
