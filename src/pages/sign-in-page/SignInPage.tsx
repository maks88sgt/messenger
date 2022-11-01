import { Box, Button, Center, Heading, Link, Text } from '@chakra-ui/react';
import { FormInput } from '../../components/form-input/FormInput';
import { useEffect, useState } from 'react';
import { validateUsername } from '../../utils/validateUsername';
import { HttpClient } from '../../api/HttpClient';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

export const SignInPage = () => {
    const { token, handleSignIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/chats');
        }
    }, [token]);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState(
        'Username or email is incorrect',
    );

    return (
        <Center h="100vh" sx={{ display: 'flex', flexDirection: 'column' }}>
            <Heading as="h1">Sign in</Heading>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '30%',
                    gap: '20px',
                }}
            >
                <FormInput
                    label={'Username'}
                    helperText={'Enter your username'}
                    errorMessage={usernameErrorMessage}
                    value={username}
                    isError={usernameError}
                    onChange={(event) => {
                        setUsernameError(false);
                        setUsername(event.target.value);
                    }}
                    onBlur={() => {
                        validateUsername(
                            username,
                            setUsernameError,
                            setUsernameErrorMessage,
                        );
                    }}
                />
                <FormInput
                    label={'Password'}
                    type={"password"}
                    helperText={'Enter your password'}
                    errorMessage={'Password is incorrect'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <Button
                    colorScheme={'teal'}
                    onClick={async () => {
                        if (!usernameError) {
                            const {
                                token,
                                userId,
                                username: fetchedUsername,
                            } = await HttpClient.signIn({
                                username,
                                password,
                            });
                            if (userId && token && fetchedUsername) {
                                handleSignIn &&
                                    handleSignIn(
                                        token,
                                        fetchedUsername,
                                        userId,
                                    );
                            }
                        }
                    }}
                >
                    Submit
                </Button>
                <Text align={'center'}>
                    Don&apos;t have an account.{' '}
                    <Link as={RouterLink} to={'/sign-up'}>
                        Sign up please
                    </Link>
                </Text>
            </Box>
        </Center>
    );
};
