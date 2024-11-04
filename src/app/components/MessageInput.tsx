// MessageInput组件: 消息输入框组件
import { useState, useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Icon } from '@iconify/react';
import socketService from '@/lib/socketService';
interface Chat {
  id: string;
  username: string;
}
interface ChatWindowProps {
    selectedChat?: Chat;
  }
  
interface SocketContextType {
  socket: typeof socketService | null;
  selectedChat?: Chat
}
interface SocketContextType {
    socket: typeof socketService | null;
    selectedChat?: Chat
  }
  
const MessageInput: React.FC<ChatWindowProps> = ({conversationId}) => {
    const { socket, selectedChat } = useSocket() as SocketContextType
  
    const [message, setMessage] = useState('');
    const [userInfo, setUserInfo] = useState({}); // 使用状态来管理用户信息
  
    useEffect(() => {
      // 确保只在客户端执行此代码
      if (typeof window !== 'undefined') {
        const storedUserInfo = localStorage.getItem('userInfo') ;
        if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
        }
      }
    }, []);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (message.trim()) {
        // 实现发送消息的逻辑
        const senderInfo = localStorage.getItem('userInfo');
        const sender = senderInfo ? JSON.parse(senderInfo) : undefined;

        socket?.emit('message', JSON.stringify({
            conversationId,
            content: message,
            sender,
            receiver: selectedChat
          }))
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


  export default MessageInput