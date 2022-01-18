const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

let cors = require('cors')

app.use(cors())

const PORT = 5000;

io.on('connection', (socket) => {



    const id = socket.id ;
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });


    socket.on('init', ( { layers } ) => {
        console.log('user init');

        if( !layers.length ) {
            return;
        }

        for (const layer of layers) {
            socket.join( layer.id + layer.name );
        }

        socket.on('startDraw', ( message ) => {
            console.log(new Date().toISOString(),  ': user: startDraw');
            let response = { ...message, socketId: id };

            socket.to(message.layer.id + message.layer.name).emit("broadcast:startDraw", response );
        });

        socket.on('addGraph', ( message ) => {
            console.log(new Date().toISOString(),  ': user: addGraph');
            let response = { ...message, socketId: id };
            socket.to(message.layer.id + message.layer.name).emit("broadcast:addGraph", response );
        });

    });

    console.log( new Date().toISOString(), ': a user connected');
});

server.listen(PORT, () => {
    console.log(`listening on *:${ PORT }`);
});
