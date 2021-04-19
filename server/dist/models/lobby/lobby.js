"use strict";
// Objet lobby pour utilisation sur le serveur 
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lobby = void 0;
//TODO: Ajouter connexion avec le chat 
class Lobby {
    // Creation d'un lobby
    constructor(difficulty, gamemode) {
        this.id = Lobby.counter++;
        this.gamemode = gamemode;
        this.difficulty = difficulty;
        this.players = new Array();
        this.isActive = false;
    }
    addPlayer(user) {
        this.players.push(user);
    }
    removePlayer(username) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].name == username)
                this.players.splice(i, 1);
        }
    }
    getNumberOfPlayers() {
        return this.players.length;
    }
    getId() {
        return this.id;
    }
    removeAllPlayers() {
        this.players = [];
    }
}
exports.Lobby = Lobby;
Lobby.counter = 0; // Pour genere
