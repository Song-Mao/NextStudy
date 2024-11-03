// 导入必要的依赖
import React, { useState } from 'react';
import Message from './Message';
import { Icon } from '@iconify/react';
interface Chat {
  id?: string;
  username?: string;
  messages?: Array<{ id: string; content: string; timestamp: string; sender: string }>;
}
interface ChatWindowProps {
  selectedChat: Chat;
}

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
const ChatWindow: React.FC<ChatWindowProps> = ({ selectedChat }) => {

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
      <MessageInput />
    </main>
  );
};

export default ChatWindow;
