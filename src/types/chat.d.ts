interface ChatData {
    id?: string;
    username: string;
    isOnline: boolean;
    password: string;
    isOnline: boolean;
    isPrivate: boolean;
    token: string;
    createTime: string;

}

interface MessageData extends ChatData {
    id?: string;
    content: string;
    timestamp?: string;
    sender: ChatData;
    lastMessage?: {
        content: string;
    };
    receiver: {
        username: string;
        isOnline: boolean;
    };
}


interface SocketContextType {
    socket: typeof socketService | null;
    selectedChat?: ChatData
    setSelectedChat: React.Dispatch<React.SetStateAction<ChatData | undefined>>;
    conversationList: MessageData[];
    setConversationList: React.Dispatch<React.SetStateAction<MessageData[]>>;
  }
  