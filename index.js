var app = require('express')();
const express = require("express");
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const dateTime = require("simple-datetime-formater");
const bodyParser = require("body-parser");

//database connection
const  Chat  = require("./models/chatschema");
const  connect  = require("./dbconnection");
const chatRouter = require("./route/chatroute");
//bodyparser middleware
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));
app.use("/chats", chatRouter);
io.on('connection', (socket)=>{
    socket.broadcast.emit("hi");
    console.log('user connected');
    socket.on('chat message',(msg)=>{
        io.emit('chat message',  msg);
    });
    socket.on('disconnect',()=>{
        console.log("user disconnected");
    });
    //save chat to the database
    connect.then(db  =>  {
        console.log("connected correctly to the server");
    
        let  chatMessage  =  new Chat({ message: msg, sender: "Anonymous"});
        chatMessage.save();
    });
});

  
http.listen(3000,()=>{
    console.log("listen on 3000");
});