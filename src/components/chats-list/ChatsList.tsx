import { useAuth } from '../../hooks/useAuth';
import { useContext } from 'react';
import { ChatListItem } from '../chat-list-item/ChatListItem';
import { ChatItem } from '../../types';
import { ChatsContext } from '../chats-context/ChatsContext';

export const ChatsList = ({ chats }: { chats: ChatItem[] }) => {
    const { username } = useAuth();
    const { setSelectedChat, socketAddToRoom, socketReadNewMessages } =
        useContext(ChatsContext);

    return (
        <>
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
        </>
    );
};
