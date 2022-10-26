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
        <Box sx={{ overflowY: 'auto' }}>
            {usersList.map((user) => {
                const isSelectedUser = selectedUsers.some(
                    (item) => item.username === user.username,
                );
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            backgroundColor: isSelectedUser
                                ? 'cyan.500'
                                : 'white',
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
