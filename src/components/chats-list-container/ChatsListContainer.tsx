import { Box, Button, Input } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { NewChat } from '../new-chat/NewChat';
import { ChatsList } from '../chats-list/ChatsList';
import { ChatsContext } from '../chats-context/ChatsContext';

export const ChatsListContainer = () => {
    const { listOfChats } = useContext(ChatsContext);

    const [search, setSearch] = useState('');
    const [filteredChats, setFilteredChats] = useState([...listOfChats]);

    useEffect(() => {
        if (search) {
            setFilteredChats(
                listOfChats.filter((item) =>
                    item.chatName.toLowerCase().includes(search.toLowerCase()),
                ),
            );
        } else {
            setFilteredChats([...listOfChats]);
        }
    }, [search, listOfChats]);

    const [modalIsOpen, setModalIsOpen] = useState(false);

    return (
        <Box sx={{ width: '33%', border: '1px solid black' }}>
            <Input
                value={search}
                onChange={(ev) => setSearch(ev.target.value)}
            />
            <ChatsList chats={filteredChats} />
            <Button onClick={() => setModalIsOpen(true)}>Add new chat</Button>
            <NewChat
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
            />
        </Box>
    );
};
