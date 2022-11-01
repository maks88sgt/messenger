require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const PORT = process.env.SERVER_PORT || 3001;

const app = express();
const client = new MongoClient(process.env.SERVER_DB_CONNECTION_STRING);

// Users collection
let USERS;

//Chats collection
let CHATS;

app.listen(PORT, async () => {
  try {
    await client.connect();
    USERS = client.db('newMongoDb').collection('users');
    console.log(
      'Database connected'
    );
    CHATS = client.db('newMongoDb').collection('chats');
    await CHATS.deleteMany({});
    await USERS.deleteMany({});
    console.log(
      'Database is cleaned'
    );
    process.exit(0);
  } catch (e) {
    console.error(e);
  }
});
