import { useEffect, useState } from 'react';
import { Box, CloseButton } from '@chakra-ui/react';
import { HttpClient, UserDTO } from '../../api/HttpClient';
import { useAuth } from '../../hooks/useAuth';

type UsersListProps = {
    addUser: (user: UserDTO) => void;
    deleteUser: (user: UserDTO) => void;
    selectedUsers: UserDTO[];
};

export const UsersList = ({
    addUser,
    deleteUser,
    selectedUsers,
}: UsersListProps) => {
    const [usersList, setUsersList] = useState<UserDTO[]>([]);
    const { userId } = useAuth();

    useEffect(() => {
        HttpClient.getUsers().then((res) => {
            setUsersList(res.users?.filter((it) => it.userId !== userId) ?? []);
        });
    }, []);

    return (
        <Box
            sx={{
                overflowY: 'auto',
                scrollbarColor: 'teal',
                maxHeight: '25vh',
                '&::-webkit-scrollbar': { width: '3px' },
                '&::-webkit-scrollbar-thumb': { background: 'teal.900' },
                '&::-webkit-scrollbar-track': { background: 'teal.400' },
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
            }}
        >
            {usersList.map((user) => {
                const isSelectedUser = selectedUsers.some(
                    (item) => item.username === user.username,
                );
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            width: '100%',
                            height: '42px',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            p: '5px',
                            borderRadius: '6px',
                            border: '1px solid teal',
                            backgroundColor: isSelectedUser
                                ? 'teal.200'
                                : 'white',
                            alignItems: 'center',
                        }}
                        key={user.userId}
                        onClick={() => !isSelectedUser && addUser(user)}
                    >
                        <Box>{user.username}</Box>
                        {isSelectedUser ? (
                            <CloseButton
                                aria-label={'Delete user'}
                                onClick={() => {
                                    deleteUser(user);
                                }}
                            />
                        ) : null}
                    </Box>
                );
            })}
        </Box>
    );
};
