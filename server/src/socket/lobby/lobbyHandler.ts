// Gestion des connections et des interactions entre le client et le gameLobby
import { Server, Socket } from 'socket.io';
import { Lobby } from '../../models/lobby/lobby';
import { lobbyList } from '../../index';
import { createChannelLobby, joinChannel, joinChannelLobby, leaveChannelLobby } from '../../database/channel';
import { UserInfo } from '../../models/lobby/userInfo';

module.exports = (io : Server, socket : Socket) => {

    // Creation d'un lobby (voir lobby.ts dans models)
    /*
        {
            gamemode : "Sprint Solo", (voir dans client_lourd/models/lobby pour les string),
            difficulty : "Facile" (voir dans client_lourd/models/lobby pour les string)
        }

    */
    const lobbyCreatedEventHandler = async (data: any) => {
        let lobby = new Lobby(data.difficulty, data.gamemode); 
        lobbyList.addLobby(lobby);
        let lobbyName: string = "Lobby " + lobby.id;
        try {
            await createChannelLobby(lobbyName);
        } catch(err) {
            console.log(err);
        }
        let list = lobbyList.getLobbies();
        io.emit('lobbyListRequested', list);
    }    

    // Suppression d'un lobby (se fait automatiquement en debut de partie)
    /*
        Data contains the lobby id 
        data = { id : 1}
    */

    const lobbyDeletedEventHandler = (data : any) => {
        lobbyList.removeLobby(data.id);
        let list = lobbyList.getLobbies();
        io.emit('lobbyListRequested', list); 
    }

    // Joindre un lobby
    /*
       data = {
           lobbyId: 1,
           userId: 6,
           username: "jaykot",
           avatar: "2"
        } 
    */
    const lobbyPlayerJoinedEventHandler = async (data : any) => {
        let index = lobbyList.indexOf(data.lobbyId);
        let lobby = lobbyList.getLobby(index);
        const user: UserInfo = {id: data.userId, name: data.username, avatar: data.avatar}
        if (lobby.getNumberOfPlayers() < 4){
            lobby.addPlayer(user);
        }
        let lobbyName: string = "Lobby " + lobby.id;
        socket.emit('joinChannelLobby', {channelName: lobbyName})
        await joinChannelLobby(lobbyName, data.username)
        let list = lobbyList.getLobbies();
        io.emit('lobbyListRequested', list); 
        
    }

    // Quitter un lobby
    /*
       data = {
           id: 1,
           username: "jaykot"
        } 
    */
    const lobbyPlayerLeftEventHandler = async (data : any) => {
        if(data.id !== -1 ){
            let index = lobbyList.indexOf(data.id);
            let lobby = lobbyList.getLobby(index);
            lobby.removePlayer(data.username);
            let lobbyName: string = "Lobby " + lobby.id;
            socket.emit('leaveChannelLobby', {channelName: lobbyName})
            await leaveChannelLobby(lobbyName, data.username)
            let list = lobbyList.getLobbies();
            io.emit('lobbyListRequested', list);
        }
    }

    // Reception des lobbies
    const lobbyListRequestedEventHandler = () => {
        let list = lobbyList.getLobbies();
        io.emit('lobbyListRequested', list);
    }
     
    socket.on('lobbyCreated', lobbyCreatedEventHandler);
    socket.on('lobbyDeleted', lobbyDeletedEventHandler);
    socket.on('lobbyPlayerJoined', lobbyPlayerJoinedEventHandler);
    socket.on('lobbyPlayerLeft', lobbyPlayerLeftEventHandler);
    socket.on('lobbyListRequested', lobbyListRequestedEventHandler);
    
}