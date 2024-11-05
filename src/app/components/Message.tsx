import React from 'react';
import UserAvatar from './UserAvatar';
import { format } from 'date-fns';

const Message: React.FC<MessageData> = ({ content, timestamp, sender }) => {
  const { id: currentUserId } = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const isMe = sender?.id === currentUserId;
  const validTimestamp = timestamp ? new Date(timestamp) : new Date();
  const formattedTimestamp = format(validTimestamp, 'yyyy-MM-dd HH:mm');

  return (
    <div className={`flex items-start gap-3 mb-4 ${isMe ? 'flex-row-reverse' : ''}`}>
      <UserAvatar username={sender.username} />
      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
        <div className={`relative min-w-[30px] text-center px-2 py-2 rounded-lg ${
          isMe 
            ? 'bg-black text-white ' 
            : 'bg-white text-black  shadow-lg'
        }`} >
          {content}
          <div className={`absolute top-1/2 transform -translate-y-1/2 ${
            isMe ? 'right-[-8px]' : 'left-[-8px]'
          }`}>
            <div className={`w-0 h-0 border-t-8 border-b-8 ${
              isMe 
                ? 'border-l-8 border-l-black border-t-transparent border-b-transparent' 
                : 'border-r-8 border-r-white border-t-transparent border-b-transparent'
            }`}></div>
          </div>
        </div>
        <span className="text-xs text-gray-500 mt-1">{formattedTimestamp}</span>
      </div>
    </div>
  );
};

export default Message;
