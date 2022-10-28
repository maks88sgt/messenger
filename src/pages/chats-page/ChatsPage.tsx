import { Box } from '@chakra-ui/react';
import { ChatsListContainer } from '../../components/chats-list-container/ChatsListContainer';
import { ActiveChat } from '../../components/active-chat/ActiveChat';
import { ChatContextProvider } from '../../components/chats-context/ChatContextProvider';

export const ChatsPage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '80vw',
                height: '100vh',
                justifyContent: 'space-around',
                m: '0 auto',
                border: 'solid 1px teal',
            }}
        >
            <ChatContextProvider>
                <>
                    <ChatsListContainer />
                    <ActiveChat />
                </>
            </ChatContextProvider>
        </Box>
    );
};
