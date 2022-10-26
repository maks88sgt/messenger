const express= require('express');

const app = express();
const path = require('path');
const cors = require('cors');
const {Server} = require("socket.io");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;

app.use(express.static(__dirname + '/build'));
app.use(cors());

const jsonParser = bodyParser.json();

// @ts-ignore
app.get('/', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});



const { MongoClient, Collection } = require('mongodb');
const client = new MongoClient(`mongodb://localhost:27017/`);

let users;
let chats;

const server = app.listen(PORT, async () => {
  try {
    await client.connect();
    users = client.db('newMongoDb').collection('users');
    console.log('Database connected, and contains ', await users.count(), ' user records');
    console.log(`Example app listening on port ${PORT}!`);
    chats = client.db('newMongoDb').collection('chats');
  } catch (e) {
    console.error(e);
  }
});

const socket = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

socket.on("connect", (socket)=>{
  socket.on("add_to_room", async (data)=>{
    socket.join(data.chatName);
  })

  socket.on("new_message", async (data)=>{
    try {
      const timestamp = Date.now();
      const res = await chats.updateOne ({ chatName: data?.chatName }, { $push: { messages: {body: data?.message, author: data?.userId, timestamp} } });
      const updatedChat = await chats.findOne ({ chatName: data?.chatName });
      socket.to(data.chatName).emit("update_chat_messages", {messages: updatedChat.messages, chatName: updatedChat.chatName})
    } catch (e) {
      console.log(e);
    }
  })
})




app.get('/users', async (request, response) => {
  try {

    const cursor = await users.find({});
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
    let existingUser = await users.findOne({ $or: [{ username: { $eq: username } }, { email: { $eq: email } }] });
    if (existingUser) {
      response.status(409).send(JSON.stringify({ message: 'User already exists' }));
    }
  } catch (e) {
    response.status(500).send({ message: e.message });
  }

  try {
    await users.insertOne(data);
    response.status(201).send(JSON.stringify({
      token: 'Sign-up token',
      username: data.username,
      userId: data._id,
    }));
  } catch (e) {
    response.status(500).send({ message: e.message });
  }
});

//Sign-in endpoint
app.post('/sign-in', jsonParser, async (request, response) => {
  const { username, password } = request.body;

  try {
    let existingUser = await users.findOne({ $and: [{ username: { $eq: username } }, { password: { $eq: password } }] });
    if (existingUser) {
      response.status(200).send({
        message: 'Authorized',
        username: existingUser.username,
        userId: existingUser._id,
        token: 'Sign-in token',
      });
    } else {
      response.status(401).send({ message: 'Username or password is incorrect' });
    }
  } catch (e) {
    response.status(500).send({ message: e.message });
  }
});

app.post('/create-chat', jsonParser, async (request, response) => {
  const { chatName, chatUsers } = request.body;
  const newChat = {chatName, chatUsers, messages: []}

  try {
    let existingChat = await chats.findOne({ chatName: { $eq: chatName }});
    if (!existingChat) {
      await chats.insertOne(newChat)
      response.status(200).send({
        message: 'New chat created',
        chatId: newChat._id,
      });
    } else {
      response.status(409).send({ message: 'Chat with name already exists, select another name' });
    }
  } catch (e) {
    response.status(500).send({ message: e.message });
  }
});


app.get('/chats', async (request, response) => {
  try {
    const cursor = await chats.find({ userId: { $eq: request.params?.userId }});
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

app.delete('/delete-chat', jsonParser ,async (request, response) => {
  try {
    const result = await chats.deleteOne({ chatName: { $eq: request.body.chatName }});
    if (result.deletedCount) {
      response.status(200).send({
        message: 'Chat deleted',
        deletedCount: result.deletedCount
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
