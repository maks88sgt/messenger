import { useAuth } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { HttpClient } from '../../api/HttpClient';
import { ChatsContext } from './ChatsContext';
import { ChatItem, Message } from '../../types';

export const ChatContextProvider = ({
    children,
}: {
    children: JSX.Element;
}) => {
    const { userId, username } = useAuth();

    const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
    const [listOfChats, setListOfChats] = useState<ChatItem[]>([]);

    const socket = io('http://localhost:3001');

    socket.on('update_chat_messages', (data) => {
        const newChatIndex = listOfChats.findIndex(
            (chat) => chat.chatName === data.chatName,
        );
        if (newChatIndex !== -1) {
            let messages = data.messages;
            if (data.chatName === selectedChat?.chatName) {
                messages = data.messages?.map((message: Message) => {
                    if (!message.isRead?.includes(username as string)) {
                        message.isRead?.push(username as string);
                    }
                    return message;
                });
                setSelectedChat({
                    ...selectedChat,
                    messages,
                } as ChatItem);
            }
            listOfChats[newChatIndex].messages = messages;
            setListOfChats([...listOfChats]);
        }
    });

    socket.on('new_chat_created', (data) => {
        if (data.chatUsers.includes(username)) {
            userId &&
                HttpClient.getChats(userId).then((res) => {
                    setListOfChats(res.userChats);
                });
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

    const socketReadNewMessages = (chatName: string, username: string) => {
        socket.emit('read_new_messages', {
            username,
            chatName,
        });
    };

    return (
        <ChatsContext.Provider
            value={{
                selectedChat,
                setSelectedChat,
                listOfChats,
                setListOfChats,
                socketSendMessage,
                socketAddToRoom,
                socketReadNewMessages,
            }}
        >
            {children}
        </ChatsContext.Provider>
    );
};
