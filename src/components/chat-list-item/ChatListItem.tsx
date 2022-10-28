import { useContext } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { HttpClient } from '../../api/HttpClient';
import { Box, CloseButton } from '@chakra-ui/react';
import { ChatsContext } from '../chats-context/ChatsContext';
import { ChatItem } from '../../types';

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
    const { setListOfChats, setSelectedChat, selectedChat } =
        useContext(ChatsContext);

    const { userId } = useAuth();

    const handleChatDelete = async () => {
        const res = await HttpClient.deleteChat(chatName);
        if (res.deletedCount && userId) {
            const updatedChats = await HttpClient.getChats(userId);
            setListOfChats && setListOfChats(updatedChats.userChats);
        }
    };

    return (
        <Box sx={{ mr: '10px' }}>
            <Box
                sx={{
                    width: '100%',
                    height: 'auto',
                    border: 'solid 1px teal',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    px: '10px',
                    backgroundColor:
                        selectedChat?.chatName === chatName ? 'teal.200' : '',
                    cursor: 'pointer',
                }}
                onClick={onClick}
            >
                <Box
                    sx={{ width: '70%', display: 'flex', flexWrap: 'no-wrap' }}
                >
                    {chatName}
                </Box>
                {unreadMessagesCount ? (
                    <Box
                        sx={{
                            minHeight: 'auto',
                            minWidth: '25px',
                            borderRadius: 'full',
                            backgroundColor: 'teal.500',
                            color: 'white',
                            fontWeight: 'bold',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {unreadMessagesCount}
                    </Box>
                ) : null}
                <CloseButton
                    onClick={async () => {
                        await handleChatDelete();
                        setSelectedChat &&
                            setSelectedChat(null as unknown as ChatItem);
                    }}
                />
            </Box>
        </Box>
    );
};
