interface ChatData {
    id: string;
    username: string;
    isOnline: boolean;
}

interface MessageData {
    content: string;
    timestamp?: ChatData;
    sender?: ChatData;
    receiver?: ChatData;
}