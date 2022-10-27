export type Message = {
    body: string;
    timestamp: number;
    author: string;
    isRead: string[];
};

export type ChatItem = {
    _id: string;
    chatName: string;
    chatUsers: string[];
    messages: Message[];
};


