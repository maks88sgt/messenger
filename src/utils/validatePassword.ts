import { Dispatch } from 'react';

export const validatePassword = (
    password: string,
    setErrror: Dispatch<boolean>,
    setErrorMessage: Dispatch<string>,
) => {
    if (password.length < 4) {
        setErrror(true);
        setErrorMessage('Password should contain more than 4 characters');
        return;
    }
    setErrror(false);
};
