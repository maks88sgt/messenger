import { useContext } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { HttpClient } from '../../api/HttpClient';
import { Box, CloseButton } from '@chakra-ui/react';
import { ChatsContext } from '../chats-context/ChatsContext';

export const ChatListItem = ({
    chatName,
    unreadMessagesCount,
    onClick,
}: {
    chatName: string;
    unreadMessagesCount: number;
    onClick: () => void;
    chatId: string;
}) => {
    const { setListOfChats } = useContext(ChatsContext);

    const { userId } = useAuth();

    const handleChatDelete = async () => {
        const res = await HttpClient.deleteChat(chatName);
        if (res.deletedCount && userId) {
            const updatedChats = await HttpClient.getChats(userId);
            setListOfChats && setListOfChats(updatedChats.userChats);
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}
            onClick={onClick}
        >
            <Box>{chatName}</Box>
            <Box>{unreadMessagesCount}</Box>
            <CloseButton
                onClick={async () => {
                    await handleChatDelete();
                }}
            />
        </Box>
    );
};
