import { createContext, useEffect, useState } from 'react';

const initialAuthContext = {
    token: null,
    handleSignIn: null,
    handleSignOut: null,
    userId: null,
    username: null,
};
export const AuthContext = createContext<{
    token: null | undefined | string;
    userId: null | undefined | string;
    username: null | undefined | string;
    handleSignIn:
        | null
        | ((token: string, username: string, userId: string) => void);
    handleSignOut: null | (() => void);
}>(initialAuthContext);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
    let savedToken;
    let savedUserId;
    let savedUsername;

    const [token, setToken] = useState<null | undefined | string>(savedToken);
    const [username, setUsername] = useState<null | undefined | string>(
        savedUsername,
    );
    const [userId, setUserId] = useState<null | undefined | string>(
        savedUserId,
    );

    useEffect(() => {
        try {
            savedToken = window.localStorage.getItem('authToken');
            savedUserId = window.localStorage.getItem('userId');
            savedUsername = window.localStorage.getItem('username');
            setToken(savedToken);
            setUserId(savedUserId);
            setUsername(savedUsername);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const handleSignIn = (token: string, username: string, userId: string) => {
        setToken(token);
        setUserId(userId);
        setUsername(username);
        try {
            window.localStorage.setItem('authToken', token);
            window.localStorage.setItem('userId', userId);
            window.localStorage.setItem('username', username);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSignOut = () => {
        setToken(null);
        setUserId(null);
        setUsername(null);
        try {
            window.localStorage.clear();
        } catch (err) {
            console.error(err);
        }
    };

    const value = {
        token,
        userId,
        username,
        handleSignIn,
        handleSignOut,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
