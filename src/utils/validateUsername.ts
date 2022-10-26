import { Dispatch } from 'react';

export const validateUsername = (
    username: string,
    setErrror: Dispatch<boolean>,
    setErrorMessage: Dispatch<string>,
) => {
    if (username.length < 3) {
        setErrror(true);
        setErrorMessage('Username should contains minimum 3 characters');
        return;
    }
    if (parseInt(username[0])) {
        setErrror(true);
        setErrorMessage('Username should start with characters');
        return;
    }
    setErrror(false);
};
