import React from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

const UserAvatar: React.FC<{ username: string }> = ({ username }) => {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    // <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
    //   {username[0]}
    // </div>
  );
};

export default UserAvatar;
