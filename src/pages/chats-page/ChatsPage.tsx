import { Box } from '@chakra-ui/react';
import { ChatsList } from '../../components/chats-list/ChatsList';
import { createContext, Dispatch, useEffect, useState } from 'react';
import { ActiveChat } from '../../components/active-chat/ActiveChat';
import { useAuth } from '../../hooks/useAuth';
import { HttpClient } from '../../api/HttpClient';
import { io } from 'socket.io-client';

//TODO: check naming
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
    socketReadNewMessages?:(userId: string, chatId: string) => void;
};

export const ChatsContext = createContext<ChatContextApi>({
    listOfChats: [],
    selectedChat: null,
    setSelectedChat: null,
    setListOfChats: null,
});

export const ChatsPage = () => {
    const { userId } = useAuth();

    const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
    const [listOfChats, setListOfChats] = useState<ChatItem[]>([]);

    const socket = io('http://localhost:3001');

    socket.on('update_chat_messages', (data) => {
        const newChat = listOfChats.find(
            (chat) => chat.chatName === data.chatName,
        );
        if (newChat) {
            newChat.messages = data.messages;
            const updatedListOfChats = [
                ...listOfChats.filter(
                    (chat) => chat.chatName !== data.chatName,
                ),
                newChat,
            ];
            setListOfChats(updatedListOfChats);
            if (data.chatName === selectedChat?.chatName) {
                setSelectedChat({
                    ...selectedChat,
                    messages: data.messages,
                } as ChatItem);
            }
        }
    });

    useEffect(() => {
        let mounted = true;
        userId &&
            HttpClient.getChats(userId).then((res) => {
                mounted && setListOfChats(res.userChats);
            });
        return () => {
            mounted = false;
        };
    }, []);

    const socketSendMessage = (
        newMessage: string,
        chatName: string,
        username: string,
    ) => {
        socket.emit('new_message', {
            message: newMessage,
            username,
            chatName,
        });
    };

    const socketAddToRoom = (username: string, chatName: string) => {
        socket.emit('add_to_room', {
            username,
            chatName,
        });
    };

    const socketReadNewMessages = (chatName: string, username: string) =>{
            socket.emit('read_new_messages', {
                username,
                chatName,
            });
    }

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
                    socketAddToRoom,
                    socketReadNewMessages
                }}
            >
                <ChatsList />
                <ActiveChat />
            </ChatsContext.Provider>
        </Box>
    );
};

export type ChatItem = {
    _id: string;
    chatName: string;
    chatUsers: string[];
    messages: Message[];
};

export type Message = {
    body: string;
    timestamp: number;
    author: string;
    isRead: string[];
};
