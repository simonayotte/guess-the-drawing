"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLobbyClassic = void 0;
const __1 = require("../..");
const AbsGameLobby_1 = require("./AbsGameLobby");
class GameLobbyClassic extends AbsGameLobby_1.AbsGameLobby {
    constructor(id, playerIds, difficulty) {
        //TODO: check si t'as tes 4 joueurs
        //TODO: si t'as des joueurs virtuels tu dois set true dès mtn son status
        super(id, playerIds, difficulty);
        this.playersIds = playerIds;
        this.initPlayerStatus();
        if (this.playersIds.length === 3) {
            this.playersIds[3] = __1.virtualPlayerService.newPlayer(this.playersIds[0]);
            this.playerStatus.set(this.playersIds[3], true);
        }
        if (this.playersIds.length === 2) {
            this.playersIds[2] = __1.virtualPlayerService.newPlayer(this.playersIds[0]);
            this.playerStatus.set(this.playersIds[2], true);
            this.playersIds[3] = __1.virtualPlayerService.newPlayer(this.playersIds[1], __1.virtualPlayerService.getIdPlayer(this.playersIds[2]) - 11);
            this.playerStatus.set(this.playersIds[3], true);
        }
        this.initPlayerScore();
        this.firstTeam = [this.playersIds[0], this.playersIds[2]];
        this.secondTeam = [this.playersIds[1], this.playersIds[3]];
        this.artist = this.playersIds[2];
    }
    getGamemode() {
        return "classic";
    }
    getMaxGuess() {
        return this.maxGuess + 1;
    }
    getMaxRound() {
        return AbsGameLobby_1.MAX_ROUND;
    }
    getNumberOfRound() {
        return this.round;
    }
}
exports.GameLobbyClassic = GameLobbyClassic;
