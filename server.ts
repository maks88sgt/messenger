const express = require("express");

const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/build"));

app.get("*", (request, response)  => {
    response.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});
