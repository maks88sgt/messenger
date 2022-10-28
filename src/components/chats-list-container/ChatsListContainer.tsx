import { Box, Button, Input } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { NewChat } from '../new-chat/NewChat';
import { ChatsList } from '../chats-list/ChatsList';
import { ChatsContext } from '../chats-context/ChatsContext';
import { UserInfo } from '../user-info/UserInfo';

export const ChatsListContainer = () => {
    const { listOfChats } = useContext(ChatsContext);

    const [search, setSearch] = useState('');
    const [filteredChats, setFilteredChats] = useState(listOfChats);

    useEffect(() => {
        if (search) {
            setFilteredChats(
                listOfChats?.filter((item) =>
                    item.chatName.toLowerCase().includes(search.toLowerCase()),
                ),
            );
        } else {
            setFilteredChats(listOfChats);
        }
    }, [search, listOfChats]);

    const [modalIsOpen, setModalIsOpen] = useState(false);

    return (
        <Box
            sx={{
                width: '40%',
                backgroundColor: 'cyan.50',
                p: '20px',
                position: 'relative',
            }}
        >
            <UserInfo />

            <Input
                sx={{ px: '10px', backgroundColor: 'white' }}
                value={search}
                onChange={(ev) => setSearch(ev.target.value)}
                placeholder={'Search chat by name'}
            />
            <ChatsList chats={filteredChats} />
            <Button
                colorScheme={'teal'}
                sx={{ position: 'absolute', bottom: '20px', right: '20px' }}
                onClick={() => setModalIsOpen(true)}
            >
                Add new chat
            </Button>
            <NewChat
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
            />
        </Box>
    );
};
