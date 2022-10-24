import { createContext, useEffect, useState } from 'react';

const initialAuthContext = {
  token: null,
  handleSignIn: null,
  handleSignOut: null,
  userId: null,
};
export const AuthContext = createContext<{
  token: null | undefined | string;
  userId: null | undefined | string;
  handleSignIn: null | ((token: string, userId: string) => void);
  handleSignOut: null | (() => void);
}>(initialAuthContext);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  let savedToken;
  let savedUserId;



  useEffect(()=>{
    try {
      savedToken = window.localStorage.getItem('authToken');
      savedUserId = window.localStorage.getItem('userId');
      setToken(savedToken);
      setUserId(savedUserId);
    } catch (err) {
      console.error(err);
    }
  },[])

  const [token, setToken] = useState<null | undefined | string>(savedToken);
  const [userId, setUserId] = useState<null | undefined | string>(savedUserId);
  const handleSignIn = (token: string, userId: string) => {
    setToken(token);
    setUserId(userId);
    try {
      window.localStorage.setItem('authToken', token);
      window.localStorage.setItem('userId', userId);
    } catch (err) {
      console.error(err);
    }

  };

  const handleSignOut = () => {
    setToken(null);
    setUserId(null);
    try {
      window.localStorage.clear();
    } catch (err) {
      console.error(err);
    }
  };

  const value = {
    token,
    userId,
    handleSignIn,
    handleSignOut,
  };

  return <AuthContext.Provider
    value={value}>{children}</AuthContext.Provider>;
};
