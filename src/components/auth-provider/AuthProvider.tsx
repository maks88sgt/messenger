import { useNavigate } from "react-router-dom";
import {createContext, useState} from "react";

const initialAuthContext = {token: null, handleSignIn: null, handleSignOut: null};
export const AuthContext =
    createContext<{ token: null | string, handleSignIn: null | ((token: string) => void), handleSignOut: null | (() => void) }>(initialAuthContext);


export const AuthProvider = ({ children }:{children: JSX.Element}) => {
    const [token, setToken] = useState<null | string>(null);
    const handleSignIn = (token: string) => {
        setToken(token);
    }

    const handleSignOut = () => {
        setToken(null);
    }


    const value = {
        token,
        handleSignIn,
        handleSignOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
