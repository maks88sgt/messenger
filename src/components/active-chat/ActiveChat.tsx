import { Box, Button, Center, Input, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ChatsContext } from '../chats-context/ChatsContext';
import { MessageItem } from '../message-item/MessageItem';

export const ActiveChat = () => {
    const { username } = useAuth();
    const { selectedChat, socketSendMessage } = useContext(ChatsContext);
    const [newMessage, setNewMessage] = useState('');

    return (
        <Box
            sx={{
                width: '100%',
                maxHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                p: '20px',
                alignItems: 'center',
                backgroundColor: 'teal.50',
              position: "relative"
            }}
        >
            {selectedChat ? (
                <>
                    <Text
                        sx={{ fontSize: '30px' }}
                    >{`Chat name: ${selectedChat.chatName}`}</Text>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '10px',
                            fontSize: '20px',
                            justifyContent: 'flex-start',
                            width: '100%',
                        }}
                    >
                        <Box>Participants: </Box>
                        {selectedChat?.chatUsers.map((user) => (
                            <Box
                                sx={{
                                    backgroundColor: 'teal.100',
                                    borderRadius: 'full',
                                    border: '1px solid teal',
                                    px: '20px',
                                    textAlign: 'center',
                                }}
                                key={user}
                            >
                                {user}
                            </Box>
                        ))}
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            overflowY: 'auto',
                            scrollbarColor: 'teal',
                            '&::-webkit-scrollbar': { width: '3px' },
                            '&::-webkit-scrollbar-thumb': {
                                background: 'teal.900',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: 'teal.400',
                            },
                            maxHeight: '80vh',
                            width: '100%',
                        }}
                    >
                        {selectedChat.messages?.map((message) => {
                            return (
                                <MessageItem
                                    key={message.author + message.timestamp}
                                    body={message.body}
                                    author={message.author}
                                    timestamp={message.timestamp}
                                />
                            );
                        })}
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'grid',
                            gridTemplateColumns: '4fr 1fr',
                            gap: '10px',
                          position: "absolute",
                          bottom: 0,
                          right: 0, p: "20px"
                        }}
                    >
                        <Input
                            sx={{ px: '10px', backgroundColor: 'white' }}
                            value={newMessage}
                            placeholder={'Enter your message'}
                            onChange={(ev) => setNewMessage(ev.target.value)}
                        />
                        <Button
                            colorScheme={'teal'}
                            sx={{ px: '10px' }}
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
                    </Box>
                </>
            ) : (
                <Center w={'100%'}>Select a chat in the left side</Center>
            )}
        </Box>
    );
};
