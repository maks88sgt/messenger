require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { MongoClient } = require('mongodb');

const PORT = process.env.SERVER_PORT || 3001;

const app = express();
const client = new MongoClient(process.env.SERVER_DB_CONNECTION_STRING);

//Send static sources from /build
app.use(express.static(__dirname + '/build'));

//Enable CORS requests
app.use(cors());

//Send index page on first request
app.get('/', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// Users collection
let USERS;

//Chats collection
let CHATS;

//
const DB_NAME = process.env.DB_NAME;

//Server initialization, DB connection
const server = app.listen(PORT, async () => {
  try {
    await client.connect();
    USERS = client.db(DB_NAME).collection('users');
    console.log(
      'Database connected, and contains ',
      await USERS.count(),
      ' user records',
    );
    console.log(`Example app listening on port ${PORT}!`);
    CHATS = client.db(DB_NAME).collection('chats');
  } catch (e) {
    console.error(e);
  }
});


// REST part

//Get users endpoint
app.get('/users', async (request, response) => {
  try {
    const cursor = await USERS.find({});
    const usersList = [];
    await cursor.forEach((item) => {
      usersList.push({ userId: item._id, username: item.username });
    });

    response.status(200).send({ message: 'Success', users: usersList });
  } catch (e) {
    response.status(500).send({ message: e.message });
  }
});

//Sign-up endpoint
app.post('/sign-up', jsonParser, async (request, response) => {
  const { username, email, password } = request.body;

  const data = { username, email, password, _id: null };

  try {
    let existingUser = await USERS.findOne({
      $or: [{ username: { $eq: username } }, { email: { $eq: email } }],
    });
    if (existingUser) {
      response
        .status(409)
        .send(JSON.stringify({ message: 'User already exists' }));
      return;
    }
  } catch (e) {
    response.status(500).send({ message: e.message });
  }

  try {
    await USERS.insertOne(data);
    response.status(201).send(
      JSON.stringify({
        token: 'Sign-up token',
        username: data.username,
        userId: data._id,
      }),
    );
  } catch (e) {
    response.status(500).send({ message: e.message });
  }
});

//Sign-in endpoint
app.post('/sign-in', jsonParser, async (request, response) => {
  const { username, password } = request.body;

  try {
    let existingUser = await USERS.findOne({
      $and: [
        { username: { $eq: username } },
        { password: { $eq: password } },
      ],
    });
    if (existingUser) {
      response.status(200).send({
        message: 'Authorized',
        username: existingUser.username,
        userId: existingUser._id,
        token: 'Sign-in token',
      });
    } else {
      response
        .status(401)
        .send({ message: 'Username or password is incorrect' });
    }
  } catch (e) {
    response.status(500).send({ message: e.message });
  }
});

//Create chat endpoint
app.post('/create-chat', jsonParser, async (request, response) => {
  const { chatName, chatUsers } = request.body;
  const newChat = { chatName, chatUsers, messages: [] };

  try {
    let existingChat = await CHATS.findOne({ chatName: { $eq: chatName } });
    if (!existingChat) {
      await CHATS.insertOne(newChat);
      socket.emit("new_chat_created", {chatUsers});
      response.status(200).send({
        message: 'New chat created',
        chatId: newChat._id,
      });
    } else {
      response
        .status(409)
        .send({
          message:
            'Chat with name already exists, select another name',
        });
    }
  } catch (e) {
    response.status(500).send({ message: e.message });
  }
});

//Get chats endpoint
app.get('/chats', async (request, response) => {
  try {
    const cursor = await CHATS.find({
      userId: { $eq: request.params?.userId },
    });
    const userChats = [];
    await cursor.forEach((item) => {
      userChats.push(item);
    });
    response.status(200).send({
      message: 'Success',
      userChats: userChats,
    });
  } catch (e) {
    response.status(500).send({ message: e.message });
  }
});

//Delete chat endpoint
app.delete('/delete-chat', jsonParser, async (request, response) => {
  try {
    const result = await CHATS.deleteOne({
      chatName: { $eq: request.body.chatName },
    });
    if (result.deletedCount) {
      response.status(200).send({
        message: 'Chat deleted',
        deletedCount: result.deletedCount,
      });
    } else {
      response.status(404).send({
        message: 'Chat not found',
      });
    }
  } catch (e) {
    response.status(500).send({ message: e.message });
  }
});


//WS part

//WS server initialization
const socket = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

//Main socket handler
socket.on('connect', (socket) => {

  //Add new connected user to the room
  socket.on('add_to_room', async (data) => {
    socket.join(data.chatName);
  });

  //Handle new message
  socket.on('new_message', async (data) => {
    try {
      const timestamp = Date.now();
      await CHATS.updateOne(
        { chatName: data?.chatName },
        {
          $push: {
            messages: {
              body: data?.message,
              author: data?.username,
              timestamp,
              isRead: [data.username],
            },
          },
        },
      );
      const updatedChat = await CHATS.findOne({
        chatName: data?.chatName,
      });

      socket.in(updatedChat.chatName).emit('update_chat_messages', {
        messages: updatedChat.messages,
        chatName: updatedChat.chatName,
      });
    } catch (e) {
      console.log(e);
    }
  });

  //Handle recently viewed messages
  socket.on('read_new_messages', async (data) => {
    try {
      const chat = await CHATS.findOne({
        chatName: data?.chatName,
      });

      const updatedMessages = chat?.messages?.map((message) => {
        if (message?.isRead?.some(it => it === data.username)) {
          return message;
        } else {
          message?.isRead?.push(data.username);
          return message;
        }
      });

      await CHATS.updateOne(
        { chatName: data?.chatName },
        {
          $unset: {
            messages: 1,
          },
        },
      );
      await CHATS.updateOne(
        { chatName: data?.chatName },
        {
          $set: {
            messages: updatedMessages,
          },
        },
      );
      const updatedChat = await CHATS.findOne({
        chatName: data?.chatName,
      });

      socket.emit('update_chat_messages', {
        messages: updatedChat?.messages,
        chatName: updatedChat?.chatName,
      });
    } catch (e) {
      console.log(e);
    }
  });
});
