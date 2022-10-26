import { Dispatch } from 'react';

export const validateEmail = (
    email: string,
    setErrror: Dispatch<boolean>,
    setErrorMessage: Dispatch<string>,
) => {
    if (!email.includes('@') || !email.includes('.')) {
        setErrror(true);
        setErrorMessage('Provide a correct email');
        return;
    }
    setErrror(false);
};
