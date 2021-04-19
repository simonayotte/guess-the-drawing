"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLobbyCoop = void 0;
const __1 = require("../..");
const AbsGameLobby_1 = require("./AbsGameLobby");
class GameLobbyCoop extends AbsGameLobby_1.AbsGameLobby {
    constructor(id, playerIds, difficulty) {
        super(id, playerIds, difficulty);
        this.playersIds[0] = __1.virtualPlayerService.newPlayer(playerIds[0]);
        this.playerStatus.set(this.playersIds[0], true);
        this.firstTeam = [this.playersIds[0]];
        this.secondTeam = [];
        for (const player of playerIds) {
            this.playersIds.push(player);
            this.playerStatus.set(player, false);
            this.firstTeam.push(player);
        }
        this.initPlayerScore();
        this.artist = this.playersIds[0];
        this.round = 4;
    }
    getVirtualPlayers() {
        const virtualPlayers = [];
        virtualPlayers.push(this.playersIds[0]);
        return virtualPlayers;
    }
    getGamemode() {
        return "coop";
    }
    newWrongGuess() {
        this.activeGuess += 1;
        if (this.activeGuess > this.maxGuess) {
            this.state = AbsGameLobby_1.LobbyState.failedRightOfReply;
        }
    }
    async nextRound() {
        this.state = AbsGameLobby_1.LobbyState.guessing;
        this.activeGuess = 0;
        this.round = this.time === 0 ? 5 : 4;
        this.hintNumber = 0;
        await this.genWord();
    }
    givePoints() {
        this.playerScores.set(this.getArtistPureId(), (this.playerScores.get(this.getArtistPureId()) || 0) + 4 - this.hintNumber);
        for (const playerId of this.playersIds) {
            if (playerId < 1000) {
                this.playerScores.set(playerId, (this.playerScores.get(playerId) || 0) + 4 - this.hintNumber);
            }
        }
        const players = [];
        const scores = [];
        for (const player of this.playerScores) {
            players.push(player[0]);
            scores.push(player[1]);
        }
        const model = {
            players: players,
            scores: scores
        };
        return model;
    }
    getMaxGuess() {
        return this.maxGuess + 1;
    }
    getNumberOfRound() {
        return this.round;
    }
}
exports.GameLobbyCoop = GameLobbyCoop;
