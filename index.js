const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const db = require('./db');

// подключаемся к бд, если всё ок, слушаем сервер
db.connect('mongodb://localhost:27017/chat', function (err) {
    if (err) {
        return console.log(err);
    }
    server.listen(3000, function () {
        console.log('API testSocketIO started');
    });
});

app.get('/', function (req,res) {
    res.sendFile(__dirname + '/index.html')
});

users = [];
connections = [];

io.sockets.on('connection', function (socket) {
    console.log('успешное соединение');
    connections.push(socket);
    socket.on('disconnect', function (data) {
        connections.splice(connections.indexOf(socket),1);
        console.log('отключились');
    });

    socket.on('send mess', function (data) {
        io.sockets.emit('add mess', {mess: data.mess, name: data.name, className: data.className});
    });
})