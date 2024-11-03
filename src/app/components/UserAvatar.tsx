import React from 'react';

const UserAvatar: React.FC<{ username: string }> = ({ username }) => {
  return (
    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
      {username[0]}
    </div>
  );
};

export default UserAvatar;
