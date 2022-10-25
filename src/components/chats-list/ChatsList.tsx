import {
  Box,
  Button,
  Input,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { ChatItem, ChatsContext } from '../../pages/chats-page/ChatsPage';
import { NewChat } from '../new-chat/NewChat';

export const ChatsList = () => {

  const { listOfChats } = useContext(ChatsContext);

  const [search, setSearch] = useState('');
  const [filteredChats, setFilteredChats] = useState(listOfChats);

  useEffect(() => {
    if (search) {
      setFilteredChats(listOfChats.filter((item) => item.chatName.toLowerCase().includes(search.toLowerCase())));
    } else {
      setFilteredChats(listOfChats);
    }
  }, [search]);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  return <Box sx={{ width: '33%', border: '1px solid black' }}>
    <Input value={search} onChange={(ev) => setSearch(ev.target.value)} />
    <ListOfChats chats={filteredChats} />
    <Button onClick={() => setModalIsOpen(true)}>Add new chat</Button>
    <NewChat modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen}/>
  </Box>;
};

const ListOfChats = ({ chats }: { chats: ChatItem[] }) => {
  const { setSelectedChat } = useContext(ChatsContext);
  return <>{chats.map((item) => {
    const unreadMessagesCount = item.messages.filter((message) => message.author != 1).filter((message) => message.isRead.some((it) => it == 1)).length;
    return <Chat key={item._id}
                 chatName={item.chatName}
                 unreadMessagesCount={unreadMessagesCount}
                 onClick={() => setSelectedChat && setSelectedChat(item)} />;
  })}</>;
};

const Chat = ({
                chatName,
                unreadMessagesCount,
                onClick,
              }: { chatName: string, unreadMessagesCount: number, onClick: () => void }) => {
  return <Box sx={{
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }} onClick={onClick}>
    <Box>{chatName}</Box>
    <Box>{unreadMessagesCount}</Box>
  </Box>;
};


