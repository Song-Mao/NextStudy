import React from 'react';
import UserAvatar from './UserAvatar';



const Message: React.FC<MessageData> = ({ content, timestamp, sender }) => {
  const { id: currentUserId } = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const isMe = sender?.id === currentUserId;
  return (
    <div className={`flex items-start gap-3 mb-4 ${isMe ? 'flex-row-reverse' : ''}`}>
      <UserAvatar username={sender.username} />
      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
        <div className={`px-2 py-2 rounded-lg  ${
          isMe 
            ? 'bg-blue-500 text-white rounded-tr-none' 
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`}>
          {content}
        </div>
        <span className="text-xs text-gray-500 mt-1">{timestamp}</span>
      </div>
    </div>
  );
};

export default Message;
