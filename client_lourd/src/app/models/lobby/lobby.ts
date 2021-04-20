import { getMaxPlayers } from "./gameModes";
import { UserInfo } from "./userInfo";

export class Lobby {
    id: number;
    difficulty: string;
    gamemode: string;
    players: UserInfo[]

    constructor(id: number, difficulty: string, gamemode: string, players: UserInfo[]) {
        this.id = id;
        this.gamemode = gamemode;
        this.difficulty = difficulty;
        this.players = players;
    }

    getNumberOfPlayers() : number {
        return this.players.length;
    }

    getId() : number {
        return this.id;
    }

    getGamemode() : string {
        return this.gamemode;
    }

    getDifficulty() : string {
        return this.difficulty;
    }

    getMaxPlayers(): number {
        return getMaxPlayers(this.gamemode);
    }

}