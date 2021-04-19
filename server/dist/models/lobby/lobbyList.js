"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LobbyList = void 0;
class LobbyList {
    constructor() {
        this.lobbies = [];
    }
    addLobby(lobby) {
        this.lobbies.push(lobby);
    }
    //Removes the lobby with the given id 
    removeLobby(id) {
        let i = this.indexOf(id);
        this.lobbies.splice(i, 1);
    }
    getLobbies() {
        return this.lobbies.filter(it => !it.isActive);
    }
    // Returns the index where the lobby id is found
    indexOf(id) {
        for (let i = 0; i < this.lobbies.length; i++) {
            if (this.lobbies[i].getId() == id)
                return i;
        }
        return -1;
    }
    getLobby(index) {
        return this.lobbies[index];
    }
    removePlayer(username) {
        for (let i = 0; i < this.lobbies.length; i++) {
            this.lobbies[i].removePlayer(username);
        }
    }
    removeAllPlayers(lobbyId) {
        const lobbyIndex = this.indexOf(lobbyId);
        this.getLobby(lobbyIndex).removeAllPlayers();
    }
    getActiveLobby(username) {
        for (let i = 0; i < this.lobbies.length; i++) {
            for (let j = 0; j < this.lobbies[i].players.length; j++) {
                if (this.lobbies[i].players[j].name == username)
                    return this.lobbies[i].getId();
            }
        }
        return -1;
    }
    lobbyGameStarted(lobbyId) {
        const index = this.indexOf(lobbyId);
        this.getLobby(index).isActive = true;
    }
    lobbyGameEnded(lobbyId) {
        const index = this.indexOf(lobbyId);
        this.getLobby(index).isActive = false;
    }
}
exports.LobbyList = LobbyList;
