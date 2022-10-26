import { Box } from '@chakra-ui/react';
import { ChatsList } from '../../components/chats-list/ChatsList';
import { createContext, Dispatch, useEffect, useState } from 'react';
import { ActiveChat } from '../../components/active-chat/ActiveChat';
import { useAuth } from '../../hooks/useAuth';
import { HttpClient } from '../../api/HttpClient';
import { io } from 'socket.io-client';

export type ChatContextApi = {
    listOfChats: ChatItem[];
    selectedChat: null | ChatItem;
    setSelectedChat: null | Dispatch<ChatItem>;
    setListOfChats: null | Dispatch<ChatItem[]>;
    socketSendMessage: any;
};

export const ChatsContext = createContext<ChatContextApi>({
    listOfChats: [],
    selectedChat: null,
    setSelectedChat: null,
    setListOfChats: null,
    socketSendMessage: null,
});

export const ChatsPage = () => {
    const { userId } = useAuth();

    const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
    const [listOfChats, setListOfChats] = useState<ChatItem[]>([]);

    useEffect(() => {
        let mounted = true;
        userId &&
            HttpClient.getChats(userId).then((res) => {
                console.log(res.userChats);
                mounted && setListOfChats(res.userChats);
            });
        return () => {
            mounted = false;
        };
    }, []);

    const socket = io('http://localhost:3001');

    const socketSendMessage = (
        newMessage: string,
        chatName: string,
        userId: string,
    ) => {
        socket.emit(
            'new message',
            {
                message: newMessage,
                userId,
                chatName,
            },
            (response: any) => {
                console.log(response.status); // ok
            },
        );
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '80vw',
                height: '100vh',
                justifyContent: 'space-around',
            }}
        >
            <ChatsContext.Provider
                value={{
                    selectedChat,
                    setSelectedChat,
                    listOfChats,
                    setListOfChats,
                    socketSendMessage,
                }}
            >
                <ChatsList />
                <ActiveChat />
            </ChatsContext.Provider>
        </Box>
    );
};

export const mockedChats = [
    {
        id: 1,
        chatName: 'Headless project',
        participants: [1, 2],
        messages: [
            {
                body: 'Hello',
                timestamp: Date.now(),
                author: 1,
                isRead: [2],
            },
            { body: 'Hi', timestamp: Date.now(), author: 2, isRead: [] },
        ],
    },
    {
        id: 2,
        chatName: 'Outcomes',
        participants: [1, 3],
        messages: [
            {
                body: 'Are you here?',
                timestamp: Date.now(),
                author: 1,
                isRead: [3],
            },
            {
                body: 'Yes, I am',
                timestamp: Date.now(),
                author: 3,
                isRead: [1],
            },
        ],
    },
];

export type ChatItem = {
    _id: string;
    chatName: string;
    participants: string[];
    messages: Message[];
};

export type Message = {
    body: string;
    timestamp: number;
    author: number;
    isRead: number[];
};
