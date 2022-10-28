import { Message } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { Box } from '@chakra-ui/react';

export const MessageItem = ({ body, author, timestamp }: Partial<Message>) => {
    const { username } = useAuth();

    const date = new Date(timestamp as number).toLocaleString();

    return (
        <Box sx={{ mx: '30px' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: author === username ? 'flex-end' : 'flex-start',
                    px: '30px',
                    py: '5px',
                }}
            >
                <Box
                    sx={{
                        width: '45%',
                        border: '1px solid teal',
                        borderRadius:
                            author === username
                                ? '8px 8px 0px 8px'
                                : '8px 8px 8px 0px',
                        p: '5px',
                        backgroundColor:
                            author === username ? 'teal.200' : 'teal.100',
                    }}
                >
                    <Box sx={{ fontSize: '18px' }}>{body}</Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            fontSize: '10px',
                        }}
                    >
                        <Box sx={{ float: 'left' }}>{date}</Box>
                    </Box>
                </Box>
                <Box>{author === username ? 'you' : author}</Box>
            </Box>
        </Box>
    );
};
