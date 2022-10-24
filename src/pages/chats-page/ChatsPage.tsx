import { Box } from '@chakra-ui/react';
import { ChatsList } from '../../components/chats-list/ChatsList';
import { createContext, Dispatch, useEffect, useState } from 'react';
import { ActiveChat } from '../../components/active-chat/ActiveChat';

export type ChatContextApi = {
  listOfChats: ChatItem[]; selectedChat: null | ChatItem; setSelectedChat: null | Dispatch<ChatItem>
}

export const ChatsContext = createContext<ChatContextApi>({
  listOfChats: [],
  selectedChat: null,
  setSelectedChat: null,
});

export const ChatsPage = () => {

  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [listOfChats, setListOfChats] = useState<ChatItem[]>(mockedChats);

  /*useEffect(() => {
    setListOfChats(mockedChats);
    console.log(listOfChats)
  }, []);*/


  return <Box sx={{
    display: 'flex',
    flexDirection: 'row',
    width: '80vw',
    height: '100vh',
    justifyContent: 'space-around',
  }}>
    <ChatsContext.Provider
      value={{ selectedChat, setSelectedChat, listOfChats }}>
      <ChatsList />
      <ActiveChat />
    </ChatsContext.Provider>

  </Box>;
};

export const mockedChats = [
    {
      id: 1,
      chatName: 'Headless project',
      participants: [1, 2],
      messages: [{
        body: 'Hello',
        timestamp: Date.now(),
        author: 1,
        isRead: [2],
      }, { body: 'Hi', timestamp: Date.now(), author: 2, isRead: [] }],
    },
    {
      id: 2,
      chatName: 'Outcomes',
      participants: [1, 3],
      messages: [{
        body:
          'Are you here?',
        timestamp: Date
          .now(), author: 1, isRead: [3],
      }, {
        body:
          'Yes, I am',
        timestamp: Date
          .now(), author: 3, isRead: [1],
      }],
    },
  ]
;


export type ChatItem = {
  id: number;
  chatName: string;
  participants: number[];
  messages: Message[];
}

export type Message = {
  body:
    string;
  timestamp: number; author: number; isRead: number[];
}
