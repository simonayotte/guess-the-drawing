"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLobby = exports.MAX_HINT = exports.MAX_ROUND = exports.MAX_GUESS = exports.LobbyState = void 0;
const game_1 = require("../../database/game");
const login_1 = require("../../database/login");
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
exports.MAX_ROUND = 3;
exports.MAX_HINT = 3;
class GameLobby {
    constructor(id, playerIds) {
        //TODO: check si t'as tes 4 joueurs
        //TODO: si t'as des joueurs virtuels tu dois set true dès mtn son status
        this.gameLobbyId = id;
        this.playersIds = playerIds;
        this.firstTeam = [this.playersIds[0], this.playersIds[1]];
        this.secondTeam = [this.playersIds[2], this.playersIds[3]];
        this.artist = this.playersIds[0];
        this.playerStatus = new Map();
        this.initPlayerStatus();
        this.word = { idDrawing: 0,
            drawingName: "",
            indice: ["Botty Crocker"],
            isRandom: true };
        this.lastArtistFirstTeam = 0;
        this.lastArtistSecondTeam = 0;
        this.state = LobbyState.default;
        this.round = 1;
        this.difficulty = 1;
        this.hintNumber = 0;
        this.isArtistTeamGuessing = true;
        this.activeGuess = 1;
        this.scoreFirstTeam = 0;
        this.scoreSecondTeam = 0;
        this.gameStartedTime = new Date();
    }
    containsPlayer(playerId) {
        return this.playersIds.includes(playerId);
    }
    initPlayerStatus() {
        for (let id of this.playersIds) {
            this.playerStatus.set(id, false);
        }
    }
    isReadyToStart() {
        return Array.from(this.playerStatus.values()).every(it => it === true);
    }
    getArtist() {
        return this.artist;
    }
    getArtistSocket() {
        return Promise.resolve(login_1.getIdSocket(this.artist));
    }
    getWord() {
        return this.word.drawingName;
    }
    getWordHint() {
        const hintsLenght = this.word.indice.length;
        let hint = "";
        if (this.hintNumber < hintsLenght - 1) {
            hint = this.word.indice[this.hintNumber];
            this.hintNumber++;
        }
        else {
            hint = this.word.indice[hintsLenght - 1];
        }
        return hint;
    }
    getDifficulty() {
        return this.difficulty;
    }
    setPlayerStatus(playerId, status) {
        this.playerStatus.set(playerId, status);
    }
    getUserTeamNumber(userId) {
        return this.firstTeam.includes(userId) ? 1 : 2;
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
            const newArtistPosition = this.lastArtistSecondTeam == 0 ? 1 : 0;
            this.artist = this.secondTeam[newArtistPosition];
            this.lastArtistSecondTeam = newArtistPosition;
        }
        else if (lastArtistTeam == 2) {
            const newArtistPosition = this.lastArtistFirstTeam == 0 ? 1 : 0;
            this.artist = this.firstTeam[newArtistPosition];
            this.lastArtistFirstTeam = newArtistPosition;
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
        if (this.activeGuess > exports.MAX_GUESS) {
            this.state = LobbyState.MaxGuessReached;
        }
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
        return this.round;
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
            this.scoreFirstTeam += 4;
        }
        else {
            this.scoreSecondTeam += 4;
        }
        const givePoints = {
            teamNumber: teamNumber,
            score: teamNumber == 1 ? this.scoreFirstTeam : this.scoreSecondTeam
        };
        return givePoints;
    }
    teamHasVirtualPlayer(teamNumber) {
        //TODO: checker le ID si > 1000
        return true;
    }
    getPlayersId() {
        return this.playersIds;
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
        let result = 0;
        for (const player of this.firstTeam) {
            if (player === idPlayer) {
                result = this.scoreFirstTeam;
            }
        }
        for (const player of this.secondTeam) {
            if (player === idPlayer) {
                result = this.scoreSecondTeam;
            }
        }
        return result;
    }
}
exports.GameLobby = GameLobby;
