// Objet lobby pour utilisation sur le serveur 

import { UserInfo } from "./userInfo";

//TODO: Ajouter connexion avec le chat 
export class Lobby {
    static counter : number = 0; // Pour genere
    id: number;
    difficulty: string; 
    gamemode: string;
    players: Array<UserInfo> // Contains the player username
    isActive: boolean

    // Creation d'un lobby
    constructor(difficulty: string, gamemode: string) {
        this.id = Lobby.counter++; 
        this.gamemode = gamemode;
        this.difficulty = difficulty;
        this.players = new Array<UserInfo>();
        this.isActive = false
    }

    addPlayer(user: UserInfo) : void {
        this.players.push(user);
    }

    removePlayer(username: string) : void {
        for(let i = 0; i < this.players.length; i++) {
            if(this.players[i].name == username)
                 this.players.splice(i,1);
        }
    }

    getNumberOfPlayers() : number {
        return this.players.length;
    }

    getId() : number {
        return this.id;
    }
    
    removeAllPlayers() {
        this.players = []
    }
}