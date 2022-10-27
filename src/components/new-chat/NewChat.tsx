import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react';
import { FormInput } from '../form-input/FormInput';
import { UsersList } from '../users-list/UsersList';
import { Dispatch, useContext, useState } from 'react';
import { HttpClient, UserDTO } from '../../api/HttpClient';
import { useAuth } from '../../hooks/useAuth';
import { ChatsContext } from '../chats-context/ChatsContext';

type NewChatProps = {
    modalIsOpen: boolean;
    setModalIsOpen: Dispatch<boolean>;
};

export const NewChat = ({ modalIsOpen, setModalIsOpen }: NewChatProps) => {
    const { userId, username } = useAuth();

    const { setListOfChats } = useContext(ChatsContext);

    const [newChatName, setNewChatName] = useState('');

    const [selectedUsers, setSelectedUsers] = useState<UserDTO[]>([]);

    const addUser = (newUser: UserDTO) => {
        setSelectedUsers([
            ...selectedUsers.filter((it) => it.username !== newUser.username),
            newUser,
        ]);
    };

    const deleteUser = (user: UserDTO) => {
        setSelectedUsers([
            ...selectedUsers.filter((it) => it.username !== user.username),
        ]);
    };

    const [chatNameError, setChatNameError] = useState(false);
    const [chatNameErrorMessage, setChatNameErrorMessage] = useState('');

    return (
        <Modal isOpen={modalIsOpen} onClose={() => null}>
            <ModalOverlay />
            <ModalContent sx={{ width: '40vw', height: '50vh' }}>
                <ModalHeader>Add new chat</ModalHeader>
                <ModalCloseButton onClick={() => setModalIsOpen(false)} />
                <ModalBody>
                    <FormInput
                        value={newChatName}
                        helperText={'Enter new chat name'}
                        errorMessage={chatNameErrorMessage}
                        label={''}
                        isError={chatNameError}
                        onChange={(ev) => {
                            chatNameError && setChatNameError(false);
                            setNewChatName(ev.target.value);
                        }}
                    />
                    <UsersList
                        addUser={addUser}
                        deleteUser={deleteUser}
                        selectedUsers={selectedUsers}
                    />
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme="cyan"
                        variant={'outline'}
                        mr={3}
                        onClick={() => setModalIsOpen(false)}
                    >
                        Close
                    </Button>
                    <Button
                        colorScheme="cyan"
                        onClick={async () => {
                            if (selectedUsers.length && newChatName) {
                                const result = await HttpClient.createChat({
                                    chatName: newChatName,
                                    chatUsers: [
                                        username,
                                        ...selectedUsers.map(
                                            (user) => user.username,
                                        ),
                                    ],
                                });
                                if (result.chatId && userId) {
                                    const updatedChats =
                                        await HttpClient.getChats(userId);
                                    setListOfChats &&
                                        setListOfChats(updatedChats.userChats);
                                    setNewChatName('');
                                    setSelectedUsers([]);
                                    setModalIsOpen(false);
                                } else {
                                    setChatNameError(true);
                                    setChatNameErrorMessage(result.message);
                                }
                            } else {
                                setChatNameError(true);
                                setChatNameErrorMessage(
                                    "Chat name and list of users shouldn't be empty",
                                );
                            }
                        }}
                    >
                        Add chat
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
