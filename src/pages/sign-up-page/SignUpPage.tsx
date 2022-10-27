import { useEffect, useState } from 'react';
import { Box, Button, Center, Heading, Link, Text } from '@chakra-ui/react';
import { FormInput } from '../../components/form-input/FormInput';
import { validateUsername } from '../../utils/validateUsername';
import { validateEmail } from '../../utils/validateEmail';
import { validatePassword } from '../../utils/validatePassword';
import { HttpClient } from '../../api/HttpClient';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

export const SignUpPage = () => {
    const { token, handleSignIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/chats');
        }
    }, [token]);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState(
        'Username is incorrect',
    );

    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] =
        useState('Email is incorrect');

    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState(
        'Password is incorrect',
    );

    const [confirmationPasswordError, setConfirmationPasswordError] =
        useState(false);

    return (
        <Center h="100vh" sx={{ display: 'flex', flexDirection: 'column' }}>
            <Heading as="h1">Sign up</Heading>
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
                    onBlur={() =>
                        validateUsername(
                            username,
                            setUsernameError,
                            setUsernameErrorMessage,
                        )
                    }
                />
                <FormInput
                    label={'Email'}
                    helperText={'Enter your email'}
                    errorMessage={emailErrorMessage}
                    value={email}
                    isError={emailError}
                    type={'email'}
                    onChange={(event) => {
                        setEmailError(false);
                        setEmail(event.target.value);
                    }}
                    onBlur={() =>
                        validateEmail(
                            email,
                            setEmailError,
                            setEmailErrorMessage,
                        )
                    }
                />
                <FormInput
                    label={'Password'}
                    helperText={'Enter your password'}
                    errorMessage={passwordErrorMessage}
                    value={password}
                    isError={passwordError}
                    type={'password'}
                    onChange={(event) => {
                        setPasswordError(false);
                        setPassword(event.target.value);
                    }}
                    onBlur={() =>
                        validatePassword(
                            password,
                            setPasswordError,
                            setPasswordErrorMessage,
                        )
                    }
                />
                <FormInput
                    label={'Repeat password'}
                    helperText={'Repeat your password'}
                    errorMessage={'Passwords is not equal'}
                    value={confirmPassword}
                    isError={confirmationPasswordError}
                    type={'password'}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    onBlur={() =>
                        setConfirmationPasswordError(
                            password !== confirmPassword,
                        )
                    }
                />
                <Button
                    colorScheme={'teal'}
                    onClick={async () => {
                        if (
                            !confirmationPasswordError &&
                            !usernameError &&
                            !emailError &&
                            !passwordError
                        ) {
                            const {
                                token,
                                userId,
                                username: createdUsername,
                            } = await HttpClient.signUp({
                                username,
                                password,
                                email,
                            });
                            if (userId && token) {
                                handleSignIn &&
                                    handleSignIn(
                                        token,
                                        createdUsername,
                                        userId,
                                    );
                            }
                        }
                    }}
                >
                    Submit
                </Button>
                <Text align={'center'}>
                    Already have an account.{' '}
                    <Link as={RouterLink} to={'/sign-in'}>
                        Sign in please
                    </Link>
                </Text>
            </Box>
        </Center>
    );
};
