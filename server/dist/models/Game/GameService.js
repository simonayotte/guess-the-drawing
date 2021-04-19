"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const channel_1 = require("../../database/channel");
const game_1 = require("../../database/game");
const AbsGameLobby_1 = require("./AbsGameLobby");
const GameLobbyBattleRoyal_1 = require("./GameLobbyBattleRoyal");
const GameLobbyClassic_1 = require("./GameLobbyClassic");
const GameLobbyCoop_1 = require("./GameLobbyCoop");
class GameService {
    constructor() {
        this.gameLobbies = new Map();
    }
    addLobby(lobbyId, playersId, difficulty, gamemode) {
        switch (gamemode) {
            case "Sprint Solo":
            case "Sprint Co-Op": {
                this.gameLobbies.set(lobbyId, new GameLobbyCoop_1.GameLobbyCoop(lobbyId, playersId, difficulty));
                console.log("Sprint Co-Op");
                break;
            }
            case "Classique": {
                this.gameLobbies.set(lobbyId, new GameLobbyClassic_1.GameLobbyClassic(lobbyId, playersId, difficulty));
                console.log("Classique");
                break;
            }
            case "Battle Royale": {
                this.gameLobbies.set(lobbyId, new GameLobbyBattleRoyal_1.GameLobbyBattleRoyal(lobbyId, playersId, difficulty));
                console.log("BR");
                break;
            }
        }
    }
    getUserLobby(userId) {
        for (const lobby of this.gameLobbies.values()) {
            if (lobby.containsPlayer(userId)) {
                return lobby.gameLobbyId;
            }
        }
        return null;
    }
    lobbyReadyToStart(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby !== undefined) {
            return lobby.isReadyToStart();
        }
        return false;
    }
    getGamemode(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby !== undefined) {
            return lobby.getGamemode();
        }
        else {
            return "error gamemode";
        }
    }
    getArtist(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby !== undefined) {
            return lobby.getArtist();
        }
        else {
            return -1;
        }
    }
    getArtistPureId(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby !== undefined) {
            return lobby.getArtistPureId();
        }
        else {
            return -1;
        }
    }
    getPlayersId(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby !== undefined) {
            return lobby.getPlayersId();
        }
        else {
            return [];
        }
    }
    getPlayerInfo(lobbyId, users) {
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby !== undefined) {
            return lobby.getPlayerInfo(users);
        }
        else {
            return [];
        }
    }
    getVirtualPlayers(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby !== undefined) {
            return lobby.getVirtualPlayers();
        }
        else {
            return [];
        }
    }
    async prepareLobbyForNewRound(lobbyid) {
        var _a;
        await ((_a = this.gameLobbies.get(lobbyid)) === null || _a === void 0 ? void 0 : _a.nextRound());
    }
    async genWord(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby !== undefined) {
            await lobby.genWord();
        }
    }
    getWord(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby !== undefined) {
            return lobby.getWord();
        }
        else {
            return "";
        }
    }
    getIsBoolean(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby !== undefined) {
            return lobby.getIsBoolean();
        }
        else {
            return false;
        }
    }
    getHint(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby !== undefined) {
            return lobby.getWordHint();
        }
        else {
            return "";
        }
    }
    getWordID(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby !== undefined) {
            return lobby.getWordID();
        }
        else {
            return 1;
        }
    }
    getDifficulty(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby !== undefined) {
            return lobby.getDifficulty();
        }
        else {
            return 1;
        }
    }
    getTime(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby !== undefined) {
            return lobby.getTime();
        }
        else {
            return 1;
        }
    }
    setTime(roomId, time) {
        var _a;
        (_a = this.gameLobbies.get(roomId)) === null || _a === void 0 ? void 0 : _a.setTime(time);
    }
    setPlayerStatus(roomId, artistId, status) {
        var _a;
        (_a = this.gameLobbies.get(roomId)) === null || _a === void 0 ? void 0 : _a.setPlayerStatus(artistId, status);
    }
    getUsersTeam(userId, lobbyId) {
        var _a;
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby !== undefined) {
            return (_a = this.gameLobbies.get(lobbyId)) === null || _a === void 0 ? void 0 : _a.getUserTeamNumber(userId);
        }
        return undefined;
    }
    rightOfReply(lobbyId) {
        var _a;
        (_a = this.gameLobbies.get(lobbyId)) === null || _a === void 0 ? void 0 : _a.rightOfReply();
    }
    guessIsARighOfReply(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        return lobby === null || lobby === void 0 ? void 0 : lobby.isWaitingForRightOfReply();
    }
    getNumberOfGuess(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        return lobby === null || lobby === void 0 ? void 0 : lobby.getNumberOfGuess();
    }
    correctGuess(lobbyId, playerId) {
        var _a;
        (_a = this.gameLobbies.get(lobbyId)) === null || _a === void 0 ? void 0 : _a.correctGuess(playerId);
    }
    newWrongGuess(lobbyId) {
        var _a;
        (_a = this.gameLobbies.get(lobbyId)) === null || _a === void 0 ? void 0 : _a.newWrongGuess();
    }
    async getArtistSocket(lobbyid) {
        const lobby = this.gameLobbies.get(lobbyid);
        if (lobby) {
            return await lobby.getArtistSocket();
        }
        else {
            return Promise.reject();
        }
    }
    getState(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        return lobby === null || lobby === void 0 ? void 0 : lobby.getSate();
    }
    setState(lobbyId, state) {
        var _a;
        (_a = this.gameLobbies.get(lobbyId)) === null || _a === void 0 ? void 0 : _a.setState(state);
    }
    lobbyHasNextRound(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby == undefined) {
            return undefined;
        }
        const nbOfRound = lobby.getNumberOfRound();
        return nbOfRound ? nbOfRound <= AbsGameLobby_1.MAX_ROUND : false;
    }
    getRoundNumber(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        return lobby ? lobby.getNumberOfRound() : null;
    }
    getActiveGuess(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        return lobby ? lobby.getActiveGuess() : null;
    }
    getRoundGuess(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        return lobby ? lobby.getRoundGuess() : null;
    }
    getPlayerLives(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        return lobby ? lobby.getPlayerLives() : null;
    }
    getMaxGuess(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        return lobby ? lobby.getMaxGuess() : null;
    }
    getMaxRound(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        return lobby ? lobby.getMaxRound() : null;
    }
    getMaxLives(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        return lobby ? lobby.getMaxLives() : null;
    }
    givePoints(lobbyId) {
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby == undefined) {
            return undefined;
        }
        return lobby.givePoints();
    }
    async addGameToDb(lobbyId) {
        var _a;
        let gameModeId = 2;
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby == undefined) {
            return Promise.reject();
        }
        switch (lobby.getGamemode()) {
            case "battleRoyal": {
                gameModeId = 3;
                break;
            }
            case "coop": {
                if (((_a = this.gameLobbies.get(lobbyId)) === null || _a === void 0 ? void 0 : _a.getPlayersId().length) === 2) {
                    gameModeId = 0;
                }
                else {
                    gameModeId = 1;
                }
            }
        }
        const difficultyLevel = this.getDifficulty(lobbyId);
        const gameLength = this.getGameLength(new Date(), lobbyId) || 0;
        const idGame = await game_1.addNewGame(gameModeId, difficultyLevel, gameLength);
        await this.addPlayersToGame(idGame, lobbyId, gameModeId, gameLength);
    }
    async addPlayersToGame(idGame, lobbyId, gameModeId, gameLength) {
        const idPlayers = this.getPlayersId(lobbyId);
        const lobbyName = "Lobby " + lobbyId;
        const lobby = this.gameLobbies.get(lobbyId);
        if (lobby == undefined) {
            console.warn(`lobby ${lobbyId} not found when trying to addPlayersToGame`);
        }
        else {
            for (const idPlayer of idPlayers) {
                let playerDbId = idPlayer;
                if (idPlayer > 999) {
                    playerDbId = lobby.getArtistPureId();
                }
                const isWinner = lobby.isWinner(playerDbId);
                const result = lobby.getResult(playerDbId) || 0;
                await game_1.addNewPlayerGame(idGame, playerDbId, isWinner, result);
                await game_1.updatePlayerStats(playerDbId, isWinner, gameModeId, result, gameLength);
                await channel_1.leaveChannelLobbyWithIdPlayer(lobbyName, playerDbId);
                await channel_1.clearHistory(lobbyName);
            }
        }
    }
    getGameLength(finalTime, lobbyId) {
        var _a;
        const startTime = (_a = this.gameLobbies.get(lobbyId)) === null || _a === void 0 ? void 0 : _a.getGameStartedTime();
        if (startTime == undefined) {
            return undefined;
        }
        const time = finalTime.getTime() - startTime.getTime();
        const secondes = Math.round(time / 1000);
        return secondes;
    }
    startGameTimer(lobbyId) {
        var _a;
        (_a = this.gameLobbies.get(lobbyId)) === null || _a === void 0 ? void 0 : _a.setGameStartedTime(new Date());
    }
    removeLobby(lobbyId) {
        this.gameLobbies.delete(lobbyId);
    }
    playerHasLeft(userId) {
        var _a;
        const lobbyId = this.getUserLobby(userId);
        if (lobbyId !== null) {
            (_a = this.gameLobbies.get(lobbyId)) === null || _a === void 0 ? void 0 : _a.setState(AbsGameLobby_1.LobbyState.gameHasEnded);
        }
    }
    comparisonCost(guess, answer) {
        // https://fr.wikipedia.org/wiki/Distance_de_Levenshtein
        const a = " " + guess;
        const b = " " + answer;
        const aSize = a.length;
        const bSize = b.length;
        let D = [];
        let i, j, cost = 0;
        for (i = 0; i <= aSize; ++i) {
            D[i] = [];
            D[i][0] = i;
        }
        for (j = 0; j <= bSize; ++j) {
            D[0][j] = j;
        }
        for (i = 1; i <= aSize; ++i) {
            for (j = 1; j <= bSize; ++j) {
                if (a[i] === b[j]) {
                    cost = 0;
                }
                else {
                    cost = 1;
                }
                D[i][j] = Math.min(D[i - 1][j] + 1, // effacement
                D[i][j - 1] + 1, // insertion
                D[i - 1][j - 1] + cost //substitution
                );
            }
        }
        return D[aSize][bSize];
    }
}
exports.GameService = GameService;
