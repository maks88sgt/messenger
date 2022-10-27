import { useAuth } from '../../hooks/useAuth';
import { useContext } from 'react';
import { ChatListItem } from '../chat-list-item/ChatListItem';
import { ChatItem } from '../../types';
import { ChatsContext } from '../chats-context/ChatsContext';
import { Box } from '@chakra-ui/react';

export const ChatsList = ({ chats }: { chats: ChatItem[] }) => {
    const { username } = useAuth();
    const { setSelectedChat, socketAddToRoom, socketReadNewMessages } =
        useContext(ChatsContext);

    return (
        <Box
            sx={{
                my: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                overflowY: 'auto',
                maxHeight: '80vh',
                scrollbarColor: 'teal',
                '&::-webkit-scrollbar': { width: '3px' },
                '&::-webkit-scrollbar-thumb': { background: "teal.900" },
                '&::-webkit-scrollbar-track': { background: "teal.400" },
              pl: "10px"
            }}
        >
            {chats.map((item) => {
                username &&
                    socketAddToRoom &&
                    socketAddToRoom(username, item.chatName);
                const unreadMessagesCount = item.messages.filter((message) => {
                    return !message?.isRead?.includes(username as string);
                }).length;
                return (
                    <ChatListItem
                        key={item._id}
                        chatId={item._id}
                        chatName={item.chatName}
                        unreadMessagesCount={unreadMessagesCount}
                        onClick={() => {
                            socketReadNewMessages &&
                                socketReadNewMessages(
                                    item.chatName,
                                    username as string,
                                );
                            setSelectedChat && setSelectedChat(item);
                        }}
                    />
                );
            })}
        </Box>
    );
};
