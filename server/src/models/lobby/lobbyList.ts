import { Lobby } from './lobby';
export class LobbyList {
    lobbies : Array<Lobby>;

    constructor() {
        this.lobbies = [];
    }

    addLobby(lobby : Lobby) : void {
        this.lobbies.push(lobby);
    }

    //Removes the lobby with the given id 
    removeLobby(id : number) : void {
        let i = this.indexOf(id);
        this.lobbies.splice(i,1);
    }

    getLobbies() : Array<Lobby> {
        return this.lobbies.filter( it => !it.isActive);
    }

    // Returns the index where the lobby id is found
    indexOf(id : number) : number {
        for(let i = 0; i < this.lobbies.length; i++) {
            if(this.lobbies[i].getId() == id)
                return i;
        }
        return -1;
    }

    getLobby(index : number) {
        return this.lobbies[index];
    }

    removePlayer(username : string) {
        for (let i = 0; i < this.lobbies.length; i++) {
           this.lobbies[i].removePlayer(username);
        }
    }

    removeAllPlayers(lobbyId: number) {
        const lobbyIndex = this.indexOf(lobbyId)
        this.getLobby(lobbyIndex).removeAllPlayers()
    }

    getActiveLobby(username : string) {
        for (let i = 0; i < this.lobbies.length; i++) {
            for(let j = 0; j < this.lobbies[i].players.length; j++){
                if(this.lobbies[i].players[j].name == username)
                    return this.lobbies[i].getId()
            }
           
        }
        return -1;
    }

    lobbyGameStarted(lobbyId : number) {
        const index = this.indexOf(lobbyId)
        this.getLobby(index).isActive = true
    }

    lobbyGameEnded(lobbyId : number) {
        const index = this.indexOf(lobbyId)
        this.getLobby(index).isActive = false
    }
}