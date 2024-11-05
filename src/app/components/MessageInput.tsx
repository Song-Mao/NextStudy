// MessageInput组件: 消息输入框组件
import { useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Icon } from '@iconify/react';
import { createConversation } from '@/api/allApi';
interface Chat {
  id: string;
  username: string;
}
interface ChatWindowProps {
  selectedChat?: Chat;
  conversationId: string | number
}


const MessageInput: React.FC<ChatWindowProps> = ({ conversationId }) => {
  const { socket, selectedChat,setConversationList, conversationList } = useSocket() as SocketContextType
  const [message, setMessage] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // 实现发送消息的逻辑
      const senderInfo = localStorage.getItem('userInfo');
      const sender = senderInfo ? JSON.parse(senderInfo) : undefined;

      let currentConversationId = conversationId; // 使用局部变量来处理会话ID

      if (!conversationId) {
        // 创建会话
        const { data } = await createConversation({
          type: 'private',
          currentUserId: sender.id,
          targetUserId: selectedChat?.id as string
        });
        currentConversationId = data.id; // 更新局部变量为新的会话ID
        console.log(data, '创建会话data=>>>>>>>>>>>>');
      } else {
        console.log('conversationId', conversationId);
      }

      const messageData = JSON.stringify({
        conversationId: currentConversationId, // 使用局部变量发送消息
        content: message,
        sender: sender,
        receiver: selectedChat,
      });
      socket?.emit('message', messageData);
      setConversationList([...conversationList, JSON.parse(messageData)]);
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