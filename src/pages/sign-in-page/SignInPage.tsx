import { Box, Button, Center } from '@chakra-ui/react';
import { FormInput } from '../../components/form-input/FormInput';
import { useEffect, useState } from 'react';
import { validateUsername } from '../../utils/validateUsername';
import { HttpClient } from '../../api/HttpClient';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router';

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
        <Center bg="tomato" h="100vh" color="white">
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <h1>Sign in</h1>
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
                    helperText={'Enter your password'}
                    errorMessage={'Password is incorrect'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <Button
                    onClick={async () => {
                        if (!usernameError) {
                            const { token, userId, message } =
                                await HttpClient.signIn({
                                    username,
                                    password,
                                });
                            console.log(message);
                            if (userId && token) {
                                handleSignIn && handleSignIn(token, userId);
                            }
                        }
                    }}
                >
                    Submit
                </Button>
            </Box>
        </Center>
    );
};
