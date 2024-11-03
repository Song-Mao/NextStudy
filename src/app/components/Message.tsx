import React from 'react';
import UserAvatar from './UserAvatar';

interface MessageProps {
  content: string;
  timestamp: string;
  sender: string;
}

const Message: React.FC<MessageProps> = ({ content, timestamp, sender }) => {
  const isMe = sender === 'me';

  return (
    <div className={`flex items-start gap-3 mb-4 ${isMe ? 'flex-row-reverse' : ''}`}>
      <UserAvatar username={sender} />
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
