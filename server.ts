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

// @ts-ignore
app.post("/sign-in", jsonParser, (request, response)=>{
  const { username, password } = request.body;
  response.send(JSON.stringify("Some token"));
});

// @ts-ignore
app.post("/sign-up", jsonParser, (request, response)=>{
  const { username, email, password } = request.body;
  response.send(JSON.stringify("Some token"));
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
