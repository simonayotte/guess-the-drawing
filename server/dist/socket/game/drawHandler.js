"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (io, socket) => {
    const LOBBY_PREFIX = "channel-Lobby ";
    /*
    emit to --> firstPoint
    {
        "thickness": 2,
        "point": [12.5 , 12.9],
        "color": #45GHJS,
        "room": 5
    }
    */
    const firstPointEventHandler = (data) => {
        const lobbyId = JSON.parse(data).room;
        socket.broadcast.to(LOBBY_PREFIX + lobbyId).emit('firstPoint', data);
    };
    /*
    emit to --> middlePoint
    {
        "point": [13.4, 13.5],
        "room": 5
    }
    */
    const middlePointEventHandler = (data) => {
        const lobbyId = JSON.parse(data).room;
        socket.broadcast.to(LOBBY_PREFIX + lobbyId).emit('middlePoint', data);
    };
    /*
    emit to --> lastPoint
    {
        "point": [15.6, 16.3],
        "room": 5
    }
    */
    const lastPointEventHandler = (data) => {
        const lobbyId = JSON.parse(data).room;
        socket.broadcast.to(LOBBY_PREFIX + lobbyId).emit('lastPoint', data);
    };
    /*
    emit to --> erasePath
    {
        "pathId": 2,
        "room" : 2
    }
    */
    const eraserEventHandler = (data) => {
        const lobbyId = JSON.parse(data).room;
        socket.broadcast.to(LOBBY_PREFIX + lobbyId).emit('erasePath', data);
    };
    /*
    emit to --> undo
    {
        "room" : 2
    }
    */
    const UndoEventHandler = (data) => {
        const lobbyId = JSON.parse(data).room;
        socket.broadcast.to(LOBBY_PREFIX + lobbyId).emit('undo');
    };
    /*
    emit to --> redo
    {
        "room" : 2
    }
    */
    const RedoEventHandler = (data) => {
        const lobbyId = JSON.parse(data).room;
        socket.broadcast.to(LOBBY_PREFIX + lobbyId).emit('redo');
    };
    socket.on('firstPoint', firstPointEventHandler);
    socket.on('middlePoint', middlePointEventHandler);
    socket.on('lastPoint', lastPointEventHandler);
    socket.on('erasePath', eraserEventHandler);
    socket.on('undo', UndoEventHandler);
    socket.on('redo', RedoEventHandler);
};
