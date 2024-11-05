interface ChatData {
    id?: string;
    username: string;
    isOnline: boolean;
}

interface MessageData {
    id?: string;
    content: string;
    timestamp?: string;
    sender: ChatData;
    receiver?: ChatData;
}


interface SocketContextType {
    socket: typeof socketService | null;
    selectedChat?: ChatData
    setSelectedChat: React.Dispatch<React.SetStateAction<ChatData | undefined>>;
    conversationList: MessageData[];
    setConversationList: React.Dispatch<React.SetStateAction<MessageData[]>>;
  }
  