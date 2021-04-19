"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbsGameLobby = exports.MAX_HINT = exports.MAX_ROUND = exports.MAX_GUESS = exports.LobbyState = void 0;
const game_1 = require("../../database/game");
const login_1 = require("../../database/login");
const index_1 = require("../../index");
var LobbyState;
(function (LobbyState) {
    LobbyState["MaxGuessReached"] = "MaxGuessReached";
    LobbyState["rightOfReply"] = "RightOfReply";
    LobbyState["failedRightOfReply"] = "failedRightOfReply";
    LobbyState["default"] = "default";
    LobbyState["guessing"] = "guessing";
    LobbyState["foundRightWord"] = "foundRightWord";
    LobbyState["gameHasEnded"] = "gameHasEnded";
})(LobbyState = exports.LobbyState || (exports.LobbyState = {}));
//TODO : changer
exports.MAX_GUESS = 4;
exports.MAX_ROUND = 4;
exports.MAX_HINT = 3;
class AbsGameLobby {
    constructor(id, playerIds, difficulty) {
        this.gameLobbyId = id;
        this.playersIds = [];
        this.playerStatus = new Map();
        this.playerScores = new Map();
        this.initPlayerStatus();
        this.firstTeam = [];
        this.secondTeam = [];
        this.artist = -1;
        this.word = { idDrawing: 0,
            drawingName: "",
            indice: ["Botty Crocker"],
            isRandom: true };
        this.lastArtistFirstTeam = 1;
        this.lastArtistSecondTeam = 1;
        this.state = LobbyState.default;
        this.round = 1;
        this.difficulty = 1;
        this.time = 60000;
        this.maxGuess = 4;
        switch (difficulty) {
            case "Intermédiaire": {
                this.difficulty = 2;
                this.time = 40000;
                this.maxGuess = 2;
                break;
            }
            case "Difficile": {
                this.difficulty = 3;
                this.time = 20000;
                this.maxGuess = 0;
            }
        }
        this.hintNumber = 0;
        this.isArtistTeamGuessing = true;
        this.activeGuess = 0;
        this.scoreFirstTeam = 0;
        this.scoreSecondTeam = 0;
        this.gameStartedTime = new Date();
    }
    containsPlayer(playerId) {
        return this.playersIds.includes(playerId);
    }
    initPlayerStatus() {
        for (const id of this.playersIds) {
            this.playerStatus.set(id, false);
        }
    }
    initPlayerScore() {
        for (const id of this.playersIds) {
            if (id > 999) {
                this.playerScores.set(index_1.virtualPlayerService.getIdPlayer(id), 0);
            }
            else {
                this.playerScores.set(id, 0);
            }
        }
    }
    isReadyToStart() {
        console.log(this.playerStatus);
        return Array.from(this.playerStatus.values()).every(it => it === true);
    }
    getRoundGuess() {
        return this.maxGuess + 1;
    }
    getActiveGuess() {
        return this.activeGuess;
    }
    getPlayerLives() {
        const model = { players: [], lives: [] };
        return model;
    }
    getArtist() {
        return this.artist;
    }
    getArtistPureId() {
        if (this.artist > 999) {
            return index_1.virtualPlayerService.getIdPlayer(this.artist);
        }
        else {
            return this.artist;
        }
    }
    getArtistSocket() {
        return Promise.resolve(login_1.getIdSocket(this.artist));
    }
    getPlayersId() {
        return this.playersIds;
    }
    getPlayerInfo(users) {
        return [];
    }
    getVirtualPlayers() {
        const virtualPlayers = [];
        if (this.playersIds[2] > 999) {
            virtualPlayers.push(this.playersIds[2]);
        }
        if (this.playersIds[3] > 999) {
            virtualPlayers.push(this.playersIds[3]);
        }
        return virtualPlayers;
    }
    getWordID() {
        return this.word.idDrawing;
    }
    getIsBoolean() {
        return this.word.isRandom;
    }
    getWord() {
        return this.word.drawingName;
    }
    getWordHint() {
        if (this.hintNumber === exports.MAX_HINT) {
            return "Tous les indices utilisés";
        }
        const hintsLenght = this.word.indice.length;
        let hint = "";
        if (this.hintNumber < hintsLenght - 1) {
            hint = this.word.indice[this.hintNumber];
            this.hintNumber++;
        }
        else {
            hint = this.word.indice[hintsLenght - 1];
        }
        if (this.artist > 999) {
            return index_1.virtualPlayerService.getHint(this.artist) + hint;
        }
        else {
            return "Le prochain indice est: " + hint;
        }
    }
    getDifficulty() {
        return this.difficulty;
    }
    getTime() {
        return this.time;
    }
    setTime(time) {
        this.time = time;
    }
    setPlayerStatus(playerId, status) {
        this.playerStatus.set(playerId, status);
    }
    getUserTeamNumber(userId) {
        return this.firstTeam.includes(userId) ? 1 : 2;
    }
    getGamemode() {
        return "abstract";
    }
    getMaxLives() {
        return null;
    }
    async genWord() {
        this.word = await game_1.getNewWord(this.word.drawingName, this.difficulty);
    }
    async nextRound() {
        //Ajouter le check des joueurs virtuelles
        // TODO: Check si ton coequipier est virtuel si oui il peut pas deviner
        this.activeGuess = 0;
        this.state = LobbyState.guessing;
        const lastArtistTeam = this.getUserTeamNumber(this.artist);
        if (lastArtistTeam == 1) { // first team
            if (!this.teamHasVirtualPlayer(2)) {
                this.lastArtistSecondTeam = this.lastArtistSecondTeam == 0 ? 1 : 0;
            }
            this.artist = this.secondTeam[this.lastArtistSecondTeam];
            // this.lastArtistSecondTeam = newArtistPosition
        }
        else if (lastArtistTeam == 2) {
            if (!this.teamHasVirtualPlayer(1)) {
                this.lastArtistFirstTeam = this.lastArtistFirstTeam == 0 ? 1 : 0;
            }
            this.artist = this.firstTeam[this.lastArtistFirstTeam];
            // this.lastArtistFirstTeam = newArtistPosition
        }
        this.round += 1;
        this.isArtistTeamGuessing = true;
        this.hintNumber = 0;
        await this.genWord();
    }
    rightOfReply() {
        this.isArtistTeamGuessing = false;
        this.activeGuess = 0;
    }
    isWaitingForRightOfReply() {
        return !this.isArtistTeamGuessing;
    }
    newWrongGuess() {
        this.activeGuess += 1;
        if (this.activeGuess > this.maxGuess) {
            this.state = LobbyState.MaxGuessReached;
        }
    }
    correctGuess(idPlayer) {
        // to implement
    }
    getNumberOfGuess() {
        return this.activeGuess;
    }
    getSate() {
        return this.state;
    }
    setState(role) {
        this.state = role;
    }
    getNumberOfRound() {
        return null;
    }
    GetTeamNumberGuessing() {
        const artistTeam = this.getUserTeamNumber(this.artist);
        if (this.isArtistTeamGuessing) {
            return artistTeam;
        }
        else {
            return artistTeam == 1 ? 2 : 1;
        }
    }
    givePoints() {
        const teamNumber = this.GetTeamNumberGuessing();
        if (teamNumber == 1) {
            this.playerScores.set(this.firstTeam[0], (this.playerScores.get(this.firstTeam[0]) || 0) + 4 - this.hintNumber);
            if (this.firstTeam[1] > 999) {
                this.playerScores.set(index_1.virtualPlayerService.getIdPlayer(this.firstTeam[1]), (this.playerScores.get(index_1.virtualPlayerService.getIdPlayer(this.firstTeam[1])) || 0) + 4 - this.hintNumber);
            }
            else {
                this.playerScores.set(this.firstTeam[1], (this.playerScores.get(this.firstTeam[1]) || 0) + 4 - this.hintNumber);
            }
            this.scoreFirstTeam += 4 - this.hintNumber;
        }
        else {
            this.playerScores.set(this.secondTeam[0], (this.playerScores.get(this.secondTeam[0]) || 0) + 4 - this.hintNumber);
            if (this.secondTeam[1] > 999) {
                this.playerScores.set(index_1.virtualPlayerService.getIdPlayer(this.secondTeam[1]), (this.playerScores.get(index_1.virtualPlayerService.getIdPlayer(this.secondTeam[1])) || 0) + 4 - this.hintNumber);
            }
            else {
                this.playerScores.set(this.secondTeam[1], (this.playerScores.get(this.secondTeam[1]) || 0) + 4 - this.hintNumber);
            }
            this.scoreSecondTeam += 4 - this.hintNumber;
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
    teamHasVirtualPlayer(teamNumber) {
        if (teamNumber === 1) {
            return this.firstTeam[1] > 999 ? true : false;
        }
        else {
            return this.secondTeam[1] > 999 ? true : false;
        }
    }
    setGameStartedTime(startedTime) {
        this.gameStartedTime = startedTime;
    }
    getGameStartedTime() {
        return this.gameStartedTime;
    }
    isWinner(idPlayer) {
        let isWinner = true;
        for (const player of this.firstTeam) {
            if (player === idPlayer) {
                isWinner = (this.scoreFirstTeam >= this.scoreSecondTeam);
            }
        }
        for (const player of this.secondTeam) {
            if (player === idPlayer) {
                isWinner = (this.scoreFirstTeam <= this.scoreSecondTeam);
            }
        }
        return isWinner;
    }
    getResult(idPlayer) {
        return this.playerScores.get(idPlayer);
    }
    getMaxGuess() {
        return null;
    }
    getMaxRound() {
        return null;
    }
}
exports.AbsGameLobby = AbsGameLobby;
