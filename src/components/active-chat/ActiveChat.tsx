import { Box, Button, Center, Input } from '@chakra-ui/react';
import { ChatsContext, Message } from '../../pages/chats-page/ChatsPage';
import { useContext, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const ActiveChat = () => {
    const { userId } = useAuth();
    const { selectedChat, socketSendMessage } = useContext(ChatsContext);
    const [newMessage, setNewMessage] = useState('');

    return (
        <Box sx={{ width: '100%' }}>
            {selectedChat ? (
                <>
                    {selectedChat.messages.map((message) => {
                        return (
                            <MessageItem
                                key={message.body}
                                body={message.body}
                                author={message.author}
                                timestamp={message.timestamp}
                            />
                        );
                    })}
                </>
            ) : (
                <Center w={'100%'}>Select a chat in the left side</Center>
            )}
            <Input
                value={newMessage}
                onChange={(ev) => setNewMessage(ev.target.value)}
            />
            <Button
                onClick={() => {
                    if (newMessage && selectedChat && userId) {
                        socketSendMessage(
                            newMessage,
                            selectedChat.chatName,
                            userId,
                        );
                        setNewMessage('');
                    }
                }}
            >
                Send message
            </Button>
        </Box>
    );
};

const MessageItem = ({ body, author, timestamp }: Partial<Message>) => {
    return (
        <Box
            sx={{
                border: '1px solid red',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: author === 1 ? 'flex-end' : 'flex-start',
            }}
        >
            <Box>{body}</Box>
            <Box>{author}</Box>
            <Box>{timestamp}</Box>
        </Box>
    );
};
