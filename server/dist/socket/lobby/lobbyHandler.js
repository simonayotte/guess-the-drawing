"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lobby_1 = require("../../models/lobby/lobby");
const index_1 = require("../../index");
const channel_1 = require("../../database/channel");
module.exports = (io, socket) => {
    // Creation d'un lobby (voir lobby.ts dans models)
    /*
        {
            gamemode : "Sprint Solo", (voir dans client_lourd/models/lobby pour les string),
            difficulty : "Facile" (voir dans client_lourd/models/lobby pour les string)
        }

    */
    const lobbyCreatedEventHandler = async (data) => {
        let lobby = new lobby_1.Lobby(data.difficulty, data.gamemode);
        index_1.lobbyList.addLobby(lobby);
        let lobbyName = "Lobby " + lobby.id;
        try {
            await channel_1.createChannelLobby(lobbyName);
        }
        catch (err) {
            console.log(err);
        }
        let list = index_1.lobbyList.getLobbies();
        io.emit('lobbyListRequested', list);
    };
    // Suppression d'un lobby (se fait automatiquement en debut de partie)
    /*
        Data contains the lobby id
        data = { id : 1}
    */
    const lobbyDeletedEventHandler = (data) => {
        index_1.lobbyList.removeLobby(data.id);
        let list = index_1.lobbyList.getLobbies();
        io.emit('lobbyListRequested', list);
    };
    // Joindre un lobby
    /*
       data = {
           lobbyId: 1,
           userId: 6,
           username: "jaykot",
           avatar: "2"
        }
    */
    const lobbyPlayerJoinedEventHandler = async (data) => {
        let index = index_1.lobbyList.indexOf(data.lobbyId);
        let lobby = index_1.lobbyList.getLobby(index);
        const user = { id: data.userId, name: data.username, avatar: data.avatar };
        if (lobby.getNumberOfPlayers() < 4) {
            lobby.addPlayer(user);
        }
        let lobbyName = "Lobby " + lobby.id;
        socket.emit('joinChannelLobby', { channelName: lobbyName });
        await channel_1.joinChannelLobby(lobbyName, data.username);
        let list = index_1.lobbyList.getLobbies();
        io.emit('lobbyListRequested', list);
    };
    // Quitter un lobby
    /*
       data = {
           id: 1,
           username: "jaykot"
        }
    */
    const lobbyPlayerLeftEventHandler = async (data) => {
        if (data.id !== -1) {
            let index = index_1.lobbyList.indexOf(data.id);
            let lobby = index_1.lobbyList.getLobby(index);
            lobby.removePlayer(data.username);
            let lobbyName = "Lobby " + lobby.id;
            socket.emit('leaveChannelLobby', { channelName: lobbyName });
            await channel_1.leaveChannelLobby(lobbyName, data.username);
            let list = index_1.lobbyList.getLobbies();
            io.emit('lobbyListRequested', list);
        }
    };
    // Reception des lobbies
    const lobbyListRequestedEventHandler = () => {
        let list = index_1.lobbyList.getLobbies();
        io.emit('lobbyListRequested', list);
    };
    socket.on('lobbyCreated', lobbyCreatedEventHandler);
    socket.on('lobbyDeleted', lobbyDeletedEventHandler);
    socket.on('lobbyPlayerJoined', lobbyPlayerJoinedEventHandler);
    socket.on('lobbyPlayerLeft', lobbyPlayerLeftEventHandler);
    socket.on('lobbyListRequested', lobbyListRequestedEventHandler);
};
