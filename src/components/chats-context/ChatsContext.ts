import { createContext, Dispatch } from 'react';
import { ChatItem } from '../../types';

export type ChatContextApi = {
    listOfChats: ChatItem[];
    selectedChat: null | ChatItem;
    setSelectedChat: null | Dispatch<ChatItem>;
    setListOfChats: null | Dispatch<ChatItem[]>;
    socketSendMessage?: (
        message: string,
        userId: string,
        chatId: string,
    ) => void;
    socketAddToRoom?: (userId: string, chatId: string) => void;
    socketReadNewMessages?: (userId: string, chatId: string) => void;
};

export const ChatsContext = createContext<ChatContextApi>({
    listOfChats: [],
    selectedChat: null,
    setSelectedChat: null,
    setListOfChats: null,
});
