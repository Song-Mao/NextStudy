interface ChatData {
    id: string;
    username: string;
    isOnline: boolean;
}

interface MessageData {
    content: string;
    timestamp: string;
    to?: string;
    from?: string;
}