import { useAuth } from '../../hooks/useAuth';
import { Box, Button } from '@chakra-ui/react';

export const UserInfo = () => {
    const { username, handleSignOut } = useAuth();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                p: '10px',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <Box sx={{ fontSize: '25px', fonWeight: 'bold' }}>{username}</Box>
            <Button
                colorScheme={'teal'}
                onClick={() => handleSignOut && handleSignOut()}
            >
                Sign out
            </Button>
        </Box>
    );
};
