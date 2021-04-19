"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLobbyBattleRoyal = exports.MAX_LIVES = void 0;
const __1 = require("../..");
const AbsGameLobby_1 = require("./AbsGameLobby");
const playerinfo_1 = require("./playerinfo");
exports.MAX_LIVES = 3;
class GameLobbyBattleRoyal extends AbsGameLobby_1.AbsGameLobby {
    constructor(id, playerIds, difficulty) {
        super(id, playerIds, difficulty);
        this.maxLives = 5;
        switch (difficulty) {
            case "Intermédiaire": {
                this.maxLives = 3;
                break;
            }
            case "Difficile": {
                this.maxLives = 1;
            }
        }
        this.playerLives = new Map();
        this.playerWordGuessed = new Map();
        this.playersIds[0] = __1.virtualPlayerService.newPlayer(playerIds[0]);
        this.playerStatus.set(this.playersIds[0], true);
        this.firstTeam = [this.playersIds[0]];
        this.secondTeam = [];
        this.playersAlive = 0;
        for (const player of playerIds) {
            this.playersIds.push(player);
            this.playerStatus.set(player, false);
            this.firstTeam.push(player);
            this.playersAlive++;
        }
        this.playersAlive--;
        this.initPlayers();
        this.initPlayerScore();
        this.artist = this.playersIds[0];
        this.time = 60000;
    }
    initPlayers() {
        for (const id of this.playersIds) {
            this.playerLives.set(id, this.maxLives);
            this.playerWordGuessed.set(id, false);
            if (id < 999) {
                this.playerScores.set(id, 0);
            }
        }
    }
    resetGuesses() {
        for (const player of this.playerWordGuessed) {
            this.playerWordGuessed.set(player[0], false);
        }
    }
    getPlayerInfo(users) {
        let players = [];
        for (const user of users) {
            let player = {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                team: this.getUserTeamNumber(user.id),
                score: this.playerScores.get(user.id),
                role: this.getRole(user.id)
            };
            players.push(player);
        }
        const virtualPlayer = {
            id: this.getArtistPureId(),
            name: __1.virtualPlayerService.getName(this.artist),
            avatar: __1.virtualPlayerService.getAvatar(this.artist).toString(),
            team: 1,
            score: this.playerScores.get(this.getArtistPureId()),
            role: playerinfo_1.RoleType.Drawing
        };
        players.push(virtualPlayer);
        return players;
    }
    getRole(userId) {
        const team = this.getUserTeamNumber(userId);
        if (team === 1) {
            return playerinfo_1.RoleType.Guessing;
        }
        else {
            return playerinfo_1.RoleType.Watching;
        }
    }
    correctGuess(idPlayer) {
        this.playerWordGuessed.set(idPlayer, true);
        let correctGuessCount = 0;
        let wrongPlayer = 0;
        for (const player of this.playerWordGuessed) {
            if (player[1]) {
                correctGuessCount++;
            }
            else {
                wrongPlayer = player[0];
            }
        }
        this.playerScores.set(idPlayer, (this.playerScores.get(idPlayer) || 0) + 3 - correctGuessCount);
        if (this.playersAlive === 0) {
            this.round = 5;
        }
        if (correctGuessCount === this.playersAlive) {
            let playerLives = this.playerLives.get(wrongPlayer);
            if (playerLives === 1) {
                this.playerWordGuessed.delete(wrongPlayer);
                this.playersAlive--;
                this.firstTeam.splice(this.firstTeam.indexOf(wrongPlayer), 1);
                this.secondTeam.push(wrongPlayer);
                playerLives--;
                this.playerLives.set(wrongPlayer, playerLives);
            }
            else if (playerLives !== undefined) {
                playerLives--;
                this.playerLives.set(wrongPlayer, playerLives);
            }
            this.state = AbsGameLobby_1.LobbyState.foundRightWord;
        }
    }
    newWrongGuess() {
        // to implement
    }
    getGamemode() {
        return "battleRoyal";
    }
    getVirtualPlayers() {
        const virtualPlayers = [];
        virtualPlayers.push(this.playersIds[0]);
        return virtualPlayers;
    }
    getMaxLives() {
        return this.maxLives;
    }
    givePoints() {
        this.playerScores.set(this.getArtistPureId(), (this.playerScores.get(this.getArtistPureId()) || 0) + 1);
        const players = [];
        const scores = [];
        for (const player of this.playerScores) {
            if (player[0] < 1000) {
                players.push(player[0]);
                scores.push(player[1]);
            }
        }
        const model = {
            players: players,
            scores: scores
        };
        return model;
    }
    async nextRound() {
        if (this.playersAlive === 0) {
            this.round = 5;
            this.state = AbsGameLobby_1.LobbyState.gameHasEnded;
        }
        else {
            this.state = AbsGameLobby_1.LobbyState.guessing;
        }
        this.resetGuesses();
        this.hintNumber = 0;
        await this.genWord();
    }
    isWinner(idPlayer) {
        return idPlayer === this.firstTeam[1];
    }
    getPlayerLives() {
        let players = [];
        let lives = [];
        for (let player of this.playerLives) {
            players.push(player[0]);
            lives.push(player[1]);
        }
        const model = {
            players: players,
            lives: lives
        };
        return model;
    }
    getNumberOfRound() {
        return this.round;
    }
}
exports.GameLobbyBattleRoyal = GameLobbyBattleRoyal;
