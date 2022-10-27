import { Box, Button, Center, Input } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ChatsContext } from '../chats-context/ChatsContext';
import { Message } from '../../types';

export const ActiveChat = () => {
    const { username } = useAuth();
    const { selectedChat, socketSendMessage } = useContext(ChatsContext);
    const [newMessage, setNewMessage] = useState('');

    return (
        <Box sx={{ width: '100%' }}>
            {selectedChat ? (
                <>
                    <Box>{selectedChat.chatName}</Box>
                    <Box>
                        {selectedChat?.chatUsers
                            ?.filter((user) => user !== username)
                            .map((user) => (
                                <Box key={user}>{user}</Box>
                            ))}
                    </Box>
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
                    <Input
                        value={newMessage}
                        onChange={(ev) => setNewMessage(ev.target.value)}
                    />
                    <Button
                        onClick={() => {
                            if (
                                newMessage &&
                                selectedChat &&
                                username &&
                                socketSendMessage
                            ) {
                                socketSendMessage(
                                    newMessage,
                                    selectedChat.chatName,
                                    username,
                                );
                                setNewMessage('');
                            }
                        }}
                    >
                        Send message
                    </Button>
                </>
            ) : (
                <Center w={'100%'}>Select a chat in the left side</Center>
            )}
        </Box>
    );
};

const MessageItem = ({ body, author, timestamp }: Partial<Message>) => {
    const { username } = useAuth();

    return (
        <Box
            sx={{
                border: '1px solid red',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: author === username ? 'flex-end' : 'flex-start',
            }}
        >
            <Box>{body}</Box>
            <Box>{author}</Box>
            <Box>{timestamp}</Box>
        </Box>
    );
};
