// MessageInput组件: 消息输入框组件
import { useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Icon } from '@iconify/react';
import { createConversation } from '@/api/allApi';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addConversation } from '@/store/chatSlice';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
interface Chat {
  id: string;
  username: string;
}
interface ChatWindowProps {
  selectedChat?: Chat;
}
// selectedChat,setConversationList, conversationList

const MessageInput: React.FC<ChatWindowProps> = () => {
  const { socket } = useSocket() as SocketContextType
  const dispatch = useDispatch();
  const conversationId = useSelector((state: RootState) => state.chat.conversationId);
  const selectedChat = useSelector((state: RootState) => state.chat.selectedChat);
  const [message, setMessage] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // 实现发送消息的逻辑
      const senderInfo = localStorage.getItem('userInfo');
      const sender = senderInfo ? JSON.parse(senderInfo) : undefined;
      let currentConversationId = conversationId; // 使用局部变量来处理会话ID
      if (!currentConversationId) {
        // 创建会话
        const { data } = await createConversation({
          type: 'private',
          currentUserId: sender.id,
          targetUserId: selectedChat?.id as string
        });
        currentConversationId = data.id; // 更新局部变量为新的会话ID
      }
      const messageData = JSON.stringify({
        conversationId: currentConversationId, // 使用局部变量发送消息
        content: message,
        sender: sender,
        receiver: selectedChat,
      });
      socket?.emit('message', messageData);
      dispatch(addConversation(JSON.parse(messageData)));
      setMessage('');
    }
  };

  return (
    <form className="mt-4 flex gap-2">
      <Input value={message}
        onChange={(e) => setMessage(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" type="textarea" placeholder="Type your message here..." />
      <Button onClick={handleSubmit} type="submit"> <Icon icon="mdi:send" />Send</Button>
    </form>
  );
};

export default MessageInput