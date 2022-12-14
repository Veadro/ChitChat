var fs = require("fs");
var http = require("http");
var https = require("https");
var privateKey = fs.readFileSync("sslcert/server.key", "utf8");
var certificate = fs.readFileSync("sslcert/server.crt", "utf8");

var credentials = { key: privateKey, cert: certificate };
var express = require("express");
var app = express();

//load the chatlog.json file as a json object
var chatlog = JSON.parse(fs.readFileSync("./json/chatlog.json", "utf8"));

// your express configuration here

var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);

httpServer.listen(8000, function () {
  console.log("HTTP Server listening on port 8000");
});
//httpsServer.listen(8443);

const { Server } = require("socket.io");
const io = new Server(httpServer);
const discord = require("discord.js");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/web/senditnow/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });
});
io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    //safe the message to a chatlog.json file
    //add the message to chatlog
    //get the current time
    //add the time to the message
    //add the message to the chatlog
    //send the message to the client
    var time = new Date();
    var timeString = time.toLocaleString();
    var message = {
      message: msg,
      time: timeString,
    };
    chatlog.messages.push(message);

    //save the chatlog to a json file
    fs.writeFileSync("./json/chatlog.json", JSON.stringify(chatlog));
    //send the message to discord
    io.emit("chat message", msg);
  });
});

global.config = JSON.parse(fs.readFileSync("./json/config.json", "utf8"));
/*
client
  .on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
  })
  .on("message", (msg) => {
    if (msg.content === "ping") {
      msg.reply("pong");
    }
  });

*/
//client.login(config.token);
