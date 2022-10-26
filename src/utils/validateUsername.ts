import { Dispatch } from 'react';

export const validateUsername = (
    username: string,
    setError: Dispatch<boolean>,
    setErrorMessage: Dispatch<string>,
) => {
    if (username.length < 3) {
        setError(true);
        setErrorMessage('Username should contains minimum 3 characters');
        return;
    }
    if (parseInt(username[0], 10)) {
        setError(true);
        setErrorMessage('Username should start with characters');
        return;
    }
    setError(false);
};
