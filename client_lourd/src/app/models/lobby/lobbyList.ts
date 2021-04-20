import { Lobby } from './lobby';
export class LobbyList {
    lobbies : Lobby[];

    constructor(lobbies : Lobby[]) {
        this.lobbies = lobbies;
    }

    addLobby(lobby : Lobby) : void {
        this.lobbies.push(lobby);
    }

    //Removes the lobby with the given id 
    removeLobby(id : number) : void {
        let i = this.indexOf(id);
        this.lobbies.splice(i,1);
    }

    getLobbies() : Lobby[] {
        return this.lobbies;
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
}