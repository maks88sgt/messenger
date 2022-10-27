import { useRouteError } from 'react-router-dom';
import { Box, Center, Heading } from '@chakra-ui/react';

export const ErrorPage = () => {
    const error = useRouteError() as {
        statusText: string;
        message: string;
        status: number;
    };
    console.error(error);

    return (
        <Center h="100vh" sx={{ display: 'flex', flexDirection: 'column' }}>
            <Heading as="h1">Oops!</Heading>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '30%',
                    gap: '20px',
                }}
            >
                <p>Sorry, an unexpected error has occurred.</p>
                <p>
                    <i>{error.status}</i>
                    <i>{error.statusText || error.message}</i>
                </p>
            </Box>
        </Center>
    );
};
