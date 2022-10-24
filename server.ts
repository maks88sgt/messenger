// @ts-ignore
const express = require("express");

const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;

app.use(express.static(__dirname + "/build"));
app.use(cors());

const jsonParser = bodyParser.json()

// @ts-ignore
app.get("*", (request, response) => {
  response.sendFile(path.resolve(__dirname, "build", "index.html"));
});

const {MongoClient, Collection} = require("mongodb");
const client = new MongoClient(`mongodb://localhost:27017/`);

// @ts-ignore
let users;

app.listen(PORT, async () => {
  try {
    await client.connect();
    users = client.db("newMongoDb").collection("users");
    console.log("Database connected, and contains ", await users.count(), " user records");
    console.log(`Example app listening on port ${PORT}!`);
  } catch (e) {
    console.error(e);
  }
});

//Sign-up endpoint
// @ts-ignore
app.post("/sign-up", jsonParser, async (request, response)=>{

  const { username, email, password } = request.body;

  const data = { username, email, password, _id: null };

  try {
    // @ts-ignore
    let existingUser = await users.findOne({ $or: [{username: { $eq: username } }, {email: { $eq: email } }]});
    if(existingUser) {
      response.status(409).send(JSON.stringify({message: "User already exists" }));
      return;
    }
  } catch (e) {
    // @ts-ignore
    response.status(500).send({ message: e.message });
  }

  try {
    // @ts-ignore
    await users.insertOne(data);
    response.status(201).send(JSON.stringify({ token: 'Sign-up token', userId: data._id }));
    return;
  } catch (e) {
    // @ts-ignore
    response.status(500).send({ message: e.message });
  }
});

//Sign-in endpoint
// @ts-ignore
app.post("/sign-in", jsonParser, async (request, response)=>{
  const { username, password } = request.body;

  try {
    // @ts-ignore
    let existingUser = await users.findOne({ $and: [{username: { $eq: username } }, {password: { $eq: password } }]});
    if(existingUser) {
      response.status(200).send({message: "Authorized", userId: existingUser._id, token: "Sign-in token" });
      return;
    } else {
      response.status(401).send(JSON.stringify({message: "Username or password is incorrect" }));
      return;
    }
  } catch (e) {
    // @ts-ignore
    response.status(500).send({ message: e.message });
  }
});

// @ts-ignore
app.get("/chats", async (request, response) => {
  try {
    // @ts-ignore
    let result = await collection.findOne({ "_id": request.query.room });
    response.send(result);
  } catch (e) {
    // @ts-ignore
    response.status(500).send({ message: e.message });
  }
});
