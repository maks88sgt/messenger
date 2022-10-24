import { createContext, useState } from 'react';

const initialAuthContext = {
  token: null,
  handleSignIn: null,
  handleSignOut: null,
};
export const AuthContext = createContext<{
  token: null | undefined | string;
  handleSignIn: null | ((token: string) => void);
  handleSignOut: null | (() => void);
}>(initialAuthContext);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  let savedToken;

  try {
    savedToken = window.localStorage.getItem('authToken');
  } catch (err) {
    console.error(err);
  }

  const [token, setToken] = useState<null | undefined | string>(savedToken);
  const handleSignIn = (token: string) => {
    setToken(token);
    try {
      window.localStorage.setItem('authToken', token);
    } catch (err) {
      console.error(err);
    }

  };

  const handleSignOut = () => {
    setToken(null);
    try {
      window.localStorage.clear();
    } catch (err) {
      console.error(err);
    }
  };

  const value = {
    token,
    handleSignIn,
    handleSignOut,
  };

  return <AuthContext.Provider
    value={value}>{children}</AuthContext.Provider>;
};
