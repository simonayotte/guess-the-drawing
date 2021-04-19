import { Server, Socket } from 'socket.io';
import { FirstPointModel } from '../../models/Path/firstPointModel'
import { MiddlePointModel } from '../../models/Path/middlePointModel'
import { LastPointModel } from '../../models/Path/lastPointModel'
import { UndoRedoModel } from '../../models/Path/undoRedoModel'
import { PathToEraseModel } from '../../models/Path/pathToEraseModel'
module.exports = (io : Server, socket : Socket) => {
    const LOBBY_PREFIX = "channel-Lobby "
    /*
    emit to --> firstPoint
    {
        "thickness": 2,
        "point": [12.5 , 12.9],
        "color": #45GHJS,
        "room": 5
    }
    */

    const firstPointEventHandler = (data : any) => {
        const lobbyId = (JSON.parse(data) as FirstPointModel).room
        socket.broadcast.to(LOBBY_PREFIX + lobbyId).emit('firstPoint', data); 
    };

    /*
    emit to --> middlePoint
    {
        "point": [13.4, 13.5],
        "room": 5
    }
    */

    const middlePointEventHandler = (data : any) => {
        const lobbyId = (JSON.parse(data) as MiddlePointModel).room
        socket.broadcast.to(LOBBY_PREFIX + lobbyId).emit('middlePoint', data);
    };

    /*
    emit to --> lastPoint
    {
        "point": [15.6, 16.3],
        "room": 5
    }
    */

    const lastPointEventHandler = (data : any) => {
        const lobbyId = (JSON.parse(data) as LastPointModel).room
        socket.broadcast.to(LOBBY_PREFIX + lobbyId).emit('lastPoint', data);
    };

    /*
    emit to --> erasePath
    {
        "pathId": 2,
        "room" : 2
    }
    */

    const eraserEventHandler = (data : any) => {
        const lobbyId = (JSON.parse(data) as PathToEraseModel).room
        socket.broadcast.to(LOBBY_PREFIX + lobbyId).emit('erasePath', data);
    };

    /*
    emit to --> undo
    {
        "room" : 2
    }
    */

    const UndoEventHandler = (data : any ) => {
        const lobbyId = (JSON.parse(data) as UndoRedoModel).room
        socket.broadcast.to(LOBBY_PREFIX + lobbyId).emit('undo');
    };

    /*
    emit to --> redo
    {
        "room" : 2
    }
    */

    const RedoEventHandler = (data : any) => {
        const lobbyId =  (JSON.parse(data) as UndoRedoModel).room
        socket.broadcast.to(LOBBY_PREFIX + lobbyId).emit('redo');
    };


    socket.on('firstPoint', firstPointEventHandler);
    socket.on('middlePoint', middlePointEventHandler);
    socket.on('lastPoint', lastPointEventHandler);
    socket.on('erasePath', eraserEventHandler);
    socket.on('undo', UndoEventHandler);
    socket.on('redo', RedoEventHandler);

};