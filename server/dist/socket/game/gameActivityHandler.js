"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIME_PERCENTAGE_COMPLETION = exports.DIFFICULT = exports.MEDIUM = exports.EASY = void 0;
const index_1 = require("../../index");
const index_2 = require("../../index");
const index_3 = require("../../index");
const AbsGameLobby_1 = require("../../models/Game/AbsGameLobby");
const messages_1 = require("../../database/messages");
const game_1 = require("../../database/game");
exports.EASY = 1;
exports.MEDIUM = 2;
exports.DIFFICULT = 3;
exports.TIME_PERCENTAGE_COMPLETION = 0.75;
const thumbs_1 = require("../../database/thumbs");
module.exports = (io, socket) => {
    const CHANNEL_PREFIX = "Lobby ";
    const LOBBY_PREFIX = "channel-Lobby ";
    const guess = async (data) => {
        const guessModel = JSON.parse(data);
        const lobbyId = guessModel.room;
        const currentLobbyState = index_1.gameService.getState(lobbyId);
        const gamemode = index_1.gameService.getGamemode(lobbyId);
        const guessResult = index_1.gameService.getWord(lobbyId).toLowerCase() === guessModel.guess.toLowerCase();
        let isGuessClose = false;
        if (!guessResult) {
            const cost = index_1.gameService.comparisonCost(guessModel.guess.toLowerCase(), index_1.gameService.getWord(lobbyId).toLowerCase());
            if (cost <= 1) {
                isGuessClose = true;
                const idArtist = index_1.gameService.getArtist(lobbyId);
                let message = "";
                if (idArtist > 999) {
                    message = index_2.virtualPlayerService.getCloseGuess(idArtist);
                }
                else {
                    message = "Tu es si proche de la bonne réponse!!";
                }
                await sendMessageToChat(lobbyId, idArtist, message);
            }
        }
        if (guessResult) {
            isGuessClose = true;
            if (gamemode === "battleRoyal") {
                const playerId = guessModel.userId;
                index_1.gameService.correctGuess(lobbyId, playerId);
            }
            else {
                index_1.gameService.setState(lobbyId, AbsGameLobby_1.LobbyState.foundRightWord);
            }
        }
        else if (currentLobbyState === AbsGameLobby_1.LobbyState.guessing) {
            index_1.gameService.newWrongGuess(lobbyId);
        }
        else if (currentLobbyState === AbsGameLobby_1.LobbyState.rightOfReply) {
            index_1.gameService.setState(lobbyId, AbsGameLobby_1.LobbyState.failedRightOfReply);
        }
        // Envoie de la reponse du guess pour la retroaction du client
        const guessResponseModel = {
            userId: guessModel.userId,
            isGuessCorrect: guessResult,
            room: guessModel.room,
            isGuessClose: isGuessClose
        };
        guessResponse(guessResponseModel);
        sendRoundInfo(lobbyId);
    };
    const guessResponse = (guessResponse) => {
        io.to(LOBBY_PREFIX + guessResponse.room).emit("guessResponse", JSON.stringify(guessResponse));
        socket.emit("guessResponseIsClose", JSON.stringify(guessResponse));
    };
    const hint = async (msg) => {
        const artist = index_1.gameService.getArtist(msg.room);
        const message = index_1.gameService.getHint(msg.room);
        await sendMessageToChat(msg.room, artist, message);
    };
    async function virtualPlayerGameStart(lobbyId) {
        const artists = index_1.gameService.getVirtualPlayers(lobbyId);
        for (const artist of artists) {
            const message = await index_2.virtualPlayerService.getGameStart(artist);
            await sendMessageToChat(lobbyId, artist, message);
        }
    }
    async function virtualPlayerRoundEnd(lobbyId) {
        const artists = index_1.gameService.getVirtualPlayers(lobbyId);
        for (const artist of artists) {
            const message = index_2.virtualPlayerService.getRoundEnd(artist);
            await sendMessageToChat(lobbyId, artist, message);
        }
    }
    async function virtualPlayerStats(lobbyId) {
        const artist = index_1.gameService.getArtist(lobbyId);
        if (artist > 999) {
            const message = await index_2.virtualPlayerService.getStat(artist);
            await sendMessageToChat(lobbyId, artist, message);
        }
    }
    async function virtualPlayerCheering(lobbyId) {
        const artist = index_1.gameService.getArtist(lobbyId);
        if (artist > 999) {
            const message = index_2.virtualPlayerService.getCheering(artist);
            await sendMessageToChat(lobbyId, artist, message);
        }
    }
    async function sendMessageToChat(lobbyId, artist, message) {
        let username = "Botty Crocker";
        let avatar = "9";
        const time = getCurrentTime();
        let idPlayer = "10";
        if (artist > 999) {
            username = index_2.virtualPlayerService.getName(artist);
            avatar = index_2.virtualPlayerService.getAvatar(artist).toString();
            idPlayer = index_2.virtualPlayerService.getIdPlayer(artist).toString();
        }
        const isMessageAdded = await messages_1.addMessage(CHANNEL_PREFIX + lobbyId, idPlayer, message, time);
        if (isMessageAdded) {
            io.to(LOBBY_PREFIX + lobbyId).emit('chatMessage', { message: message, username: username, avatar: avatar, time: time, room: CHANNEL_PREFIX + lobbyId, idPlayer: idPlayer });
        }
    }
    function getCurrentTime() {
        const d = new Date();
        const h = `${d.getHours()}`.padStart(2, '0');
        const m = `${d.getMinutes()}`.padStart(2, '0');
        const s = `${d.getSeconds()}`.padStart(2, '0');
        return h + ":" + m + ":" + s;
    }
    const playerLeftHandler = (data) => {
        // to implement
    };
    const startGame = async (data) => {
        let arrayOfPlayersId = [];
        const lobbyId = JSON.parse(data).lobbyId; // TODO: passer les avatars et les id aussi
        const users = index_3.lobbyList.getLobby(lobbyId).players;
        for (const player of users) {
            arrayOfPlayersId.push(player.id);
        }
        const difficulty = index_3.lobbyList.getLobby(lobbyId).difficulty;
        const gamemode = index_3.lobbyList.getLobby(lobbyId).gamemode;
        index_1.gameService.addLobby(lobbyId, arrayOfPlayersId, difficulty, gamemode);
        index_3.lobbyList.lobbyGameStarted(lobbyId);
        const list = index_3.lobbyList.getLobbies();
        io.emit('lobbyListRequested', list);
        arrayOfPlayersId = index_1.gameService.getPlayersId(lobbyId);
        await index_1.gameService.genWord(lobbyId);
        const virtualPlayers = index_1.gameService.getVirtualPlayers(lobbyId);
        const players = await constructPlayersInfo(users, lobbyId, virtualPlayers);
        io.to(LOBBY_PREFIX + lobbyId).emit("gameSetup", JSON.stringify(players));
        io.to(LOBBY_PREFIX + lobbyId).emit("loadGame");
        io.to(LOBBY_PREFIX + lobbyId).emit("toggleChat", { lobbyid: lobbyId });
        index_1.gameService.startGameTimer(lobbyId);
    };
    async function constructPlayersInfo(lobbyUsers, lobbyId, virtualPlayers) {
        const players = [];
        for (const user of lobbyUsers) {
            players.push(await getPlayerInfoForGame(user, lobbyId));
        }
        for (const userId of virtualPlayers) {
            const virtualId = index_2.virtualPlayerService.getIdPlayer(userId);
            players.push(getVirtualPlayerInfoForGame(virtualId, userId, lobbyId));
        }
        return players;
    }
    const clientReadyToStart = async (data) => {
        let userId = JSON.parse(data).userId;
        const lobbyId = index_1.gameService.getUserLobby(userId);
        if (lobbyId !== null) {
            index_1.gameService.setPlayerStatus(lobbyId, userId, true);
            if (index_1.gameService.lobbyReadyToStart(lobbyId)) {
                startRound(lobbyId);
                await virtualPlayerGameStart(lobbyId);
                startVirtualPlayerRound(lobbyId);
            }
        }
    };
    const thumpsUp = async (data) => {
        const info = JSON.parse(data);
        io.to(LOBBY_PREFIX + info.lobbyId).emit("thumbsUp", JSON.stringify({ idplayer: info.idplayer }));
        thumbs_1.thumbsUp(info.idplayer);
    };
    const thumpsDown = async (data) => {
        const info = JSON.parse(data);
        io.to(LOBBY_PREFIX + info.lobbyId).emit("thumbsDown", JSON.stringify({ idplayer: info.idplayer }));
        thumbs_1.thumbsDown(info.idplayer);
    };
    async function startRound(lobbyId) {
        if (index_1.gameService.getGamemode(lobbyId) === "battleRoyal") {
            const users = index_3.lobbyList.getLobby(lobbyId).players;
            // const virtualPlayers = gameService.getVirtualPlayers(lobbyId)
            // const players : PlayerInfo[] = await constructPlayersInfo(users, lobbyId, virtualPlayers) 
            const players = index_1.gameService.getPlayerInfo(lobbyId, users);
            io.to(LOBBY_PREFIX + lobbyId).emit("gameSetup", JSON.stringify(players));
        }
        if (index_1.gameService.lobbyHasNextRound(lobbyId)) {
            index_1.gameService.setState(lobbyId, AbsGameLobby_1.LobbyState.guessing);
            const newRoundModel = {
                artist: index_1.gameService.getArtistPureId(lobbyId),
                word: index_1.gameService.getWord(lobbyId)
            };
            io.to(LOBBY_PREFIX + lobbyId).emit('newRound', JSON.stringify(newRoundModel));
            io.to(LOBBY_PREFIX + lobbyId).emit('clearDrawing');
            sendRoundInfo(lobbyId);
        }
        else {
            endGame(lobbyId);
        }
    }
    function sendRoundInfo(lobbyId) {
        const roundInfo = {
            roundRemaining: index_1.gameService.getRoundNumber(lobbyId),
            guessRemaining: index_1.gameService.getActiveGuess(lobbyId),
            lifeRemaining: index_1.gameService.getPlayerLives(lobbyId),
            maxGuess: index_1.gameService.getMaxGuess(lobbyId),
            maxRound: index_1.gameService.getMaxRound(lobbyId),
            maxLife: index_1.gameService.getMaxLives(lobbyId)
        };
        io.to(LOBBY_PREFIX + lobbyId).emit("roundInfo", JSON.stringify(roundInfo));
    }
    function startVirtualPlayerRound(lobbyId) {
        if (index_1.gameService.lobbyHasNextRound(lobbyId)) {
            if (index_1.gameService.getArtist(lobbyId) > 999) {
                startTimer(lobbyId, index_1.gameService.getTime(lobbyId));
                sendDrawing(lobbyId);
            }
        }
    }
    const artistIsReady = (data) => {
        const clientIsReadyModel = JSON.parse(data);
        const lobbyId = index_1.gameService.getUserLobby((clientIsReadyModel).userId);
        const userId = clientIsReadyModel.userId;
        //TODO: aller chercher le temps du mots ici
        if (lobbyId !== null && userId === index_1.gameService.getArtist(lobbyId)) {
            io.to(LOBBY_PREFIX + lobbyId).emit('clearDrawing');
            startTimer(lobbyId, index_1.gameService.getTime(lobbyId));
        }
    };
    function startTimer(lobbyId, time) {
        const interval = setInterval(async function () {
            time -= 1000;
            const timeRemaining = {
                time: millisToMinutesAndSeconds(time)
            };
            io.to(LOBBY_PREFIX + lobbyId).emit("updateTime", JSON.stringify(timeRemaining));
            const currentLobbyState = index_1.gameService.getState(lobbyId);
            const gamemode = index_1.gameService.getGamemode(lobbyId);
            //Fin d'une round quand le mot est trouvé 
            if (currentLobbyState === AbsGameLobby_1.LobbyState.foundRightWord) {
                await virtualPlayerCheering(lobbyId);
                if (gamemode === "classic" || gamemode === "battleRoyal") {
                    clearInterval(interval);
                    clearTimer(lobbyId);
                    timeRemaining.time = "00:00";
                    io.to(LOBBY_PREFIX + lobbyId).emit("updateTime", JSON.stringify(timeRemaining));
                    await virtualPlayerRoundEnd(lobbyId);
                    givePoints(lobbyId);
                    await index_1.gameService.prepareLobbyForNewRound(lobbyId);
                    startRound(lobbyId);
                    startVirtualPlayerRound(lobbyId);
                }
                else if (gamemode == "coop") {
                    givePoints(lobbyId);
                    index_1.gameService.setTime(lobbyId, time += 10000); // TODO ajuster 
                    clearInterval(interval);
                    await index_1.gameService.prepareLobbyForNewRound(lobbyId);
                    startRound(lobbyId);
                    startVirtualPlayerRound(lobbyId);
                }
            }
            else if (currentLobbyState === AbsGameLobby_1.LobbyState.MaxGuessReached) {
                if (gamemode == "classic") {
                    index_1.gameService.setState(lobbyId, AbsGameLobby_1.LobbyState.rightOfReply);
                    clearInterval(interval);
                    clearTimer(lobbyId);
                    startRightOfReply(lobbyId);
                }
            }
            else if (currentLobbyState === AbsGameLobby_1.LobbyState.failedRightOfReply) {
                if (gamemode == "coop") {
                    index_1.gameService.setTime(lobbyId, time);
                    clearInterval(interval);
                    clearTimer(lobbyId);
                    await virtualPlayerRoundEnd(lobbyId);
                    await index_1.gameService.prepareLobbyForNewRound(lobbyId);
                    startRound(lobbyId);
                    startVirtualPlayerRound(lobbyId);
                }
                else {
                    clearInterval(interval);
                    clearTimer(lobbyId);
                    await virtualPlayerRoundEnd(lobbyId);
                    await index_1.gameService.prepareLobbyForNewRound(lobbyId);
                    startRound(lobbyId);
                }
            }
            else if (currentLobbyState === AbsGameLobby_1.LobbyState.gameHasEnded) {
                clearInterval(interval);
                clearTimer(lobbyId);
                endGame(lobbyId, "La partie est terminé, un joueur à quitté");
            }
            else if (time <= 0) {
                clearInterval(interval);
                clearTimer(lobbyId);
                if (currentLobbyState === AbsGameLobby_1.LobbyState.guessing) {
                    await virtualPlayerStats(lobbyId);
                    if (gamemode === "classic") {
                        index_1.gameService.setState(lobbyId, AbsGameLobby_1.LobbyState.rightOfReply);
                        clearInterval(interval);
                        startRightOfReply(lobbyId);
                    }
                    else if (gamemode === "coop") {
                        index_1.gameService.setTime(lobbyId, 0);
                        clearInterval(interval);
                        await virtualPlayerRoundEnd(lobbyId);
                        await index_1.gameService.prepareLobbyForNewRound(lobbyId);
                        startRound(lobbyId);
                    }
                    else if (gamemode === "battleRoyal") {
                        clearInterval(interval);
                        clearTimer(lobbyId);
                        await virtualPlayerRoundEnd(lobbyId);
                        await index_1.gameService.prepareLobbyForNewRound(lobbyId);
                        startRound(lobbyId);
                        startVirtualPlayerRound(lobbyId);
                    }
                }
                else {
                    await virtualPlayerRoundEnd(lobbyId);
                    await index_1.gameService.prepareLobbyForNewRound(lobbyId);
                    startRound(lobbyId);
                    startVirtualPlayerRound(lobbyId);
                }
            }
        }, 1000);
    }
    function startRightOfReply(lobbyId) {
        index_1.gameService.rightOfReply(lobbyId);
        startTimer(lobbyId, index_1.gameService.getTime(lobbyId) / 2); //TODO: time for right of reply 
        io.to(LOBBY_PREFIX + lobbyId).emit("rightOfReply");
    }
    function millisToMinutesAndSeconds(millis) {
        const minutes = Math.floor(millis / 60000);
        const seconds = (millis % 60000) / 1000;
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }
    function clearTimer(lobbyId) {
        const timeRemaining = {
            time: "00:00"
        };
        io.to(LOBBY_PREFIX + lobbyId).emit("updateTime", JSON.stringify(timeRemaining));
    }
    function givePoints(lobbyId) {
        const model = index_1.gameService.givePoints(lobbyId);
        if (model != undefined) {
            io.to(LOBBY_PREFIX + lobbyId).emit("givePoints", JSON.stringify(model));
        }
    }
    async function getPlayerInfoForGame(user, lobbyId) {
        let team = index_1.gameService.getUsersTeam(user.id, lobbyId);
        if (team === undefined) {
            console.warn(`can't find team number of userid ${user.id}`);
            team = 1;
        }
        const playerInfo = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            team: team
        };
        return playerInfo;
    }
    async function endGame(lobbyId, message) {
        const lobbyName = "Lobby " + lobbyId;
        const endGameModel = {
            message: message ? message : "La partie est terminée, appuyez sur ok pour retourner au lobby"
        };
        io.to(LOBBY_PREFIX + lobbyId).emit('endGame', JSON.stringify(endGameModel));
        await index_1.gameService.addGameToDb(lobbyId);
        io.to(LOBBY_PREFIX + lobbyId).emit('leaveChannelLobby', { channelName: lobbyName });
        index_1.gameService.setState(lobbyId, AbsGameLobby_1.LobbyState.gameHasEnded);
        index_3.lobbyList.removeAllPlayers(lobbyId);
        index_1.gameService.removeLobby(lobbyId);
        index_3.lobbyList.lobbyGameEnded(lobbyId);
        const list = index_3.lobbyList.getLobbies();
        io.emit('lobbyListRequested', list);
    }
    function getVirtualPlayerInfoForGame(userId, virtualPlayerGameId, lobbyId) {
        let team = index_1.gameService.getUsersTeam(virtualPlayerGameId, lobbyId);
        if (team === undefined) {
            console.warn(`can't find team number of virtualplayerid ${virtualPlayerGameId}`);
            team = 1;
        }
        const playerInfo = {
            id: userId,
            name: index_2.virtualPlayerService.getName(virtualPlayerGameId),
            avatar: index_2.virtualPlayerService.getAvatar(virtualPlayerGameId).toString(),
            team: team
        };
        return playerInfo;
    }
    async function sendDrawing(lobbyId) {
        const pathData = await game_1.getLine(index_1.gameService.getWordID(lobbyId));
        let orderedPath = new Array(pathData.length);
        let amountOfPoints = 0;
        // Order les paths
        for (let i = 0; i < pathData.length; i++) {
            orderedPath[pathData[i].pathorder] = pathData[i];
            for (const path of pathData[i].point) {
                amountOfPoints++;
            }
        }
        // Suffle les paths si mode de dessin random 
        if (index_1.gameService.getIsBoolean(lobbyId)) {
            orderedPath = shuffleArray(orderedPath);
        }
        const timeBetweenEachPoint = getDelay(lobbyId, amountOfPoints);
        console.log('Debut d envoie du dessin du lobby ' + lobbyId);
        // envoie des path
        for (let i = 0; i < pathData.length; i++) {
            const gameState = index_1.gameService.getState(lobbyId);
            if (gameState === AbsGameLobby_1.LobbyState.foundRightWord || gameState === AbsGameLobby_1.LobbyState.failedRightOfReply || gameState === undefined) {
                break;
            }
            const firstPoint = { thickness: orderedPath[i].thickness, point: orderedPath[i].point[0], color: orderedPath[i].color, room: lobbyId };
            io.to(LOBBY_PREFIX + lobbyId).emit('firstPoint', JSON.stringify(firstPoint));
            for (let j = 1; j < orderedPath[i].point.length - 1; j++) {
                const middlePoint = { point: orderedPath[i].point[j], room: lobbyId };
                io.to(LOBBY_PREFIX + lobbyId).emit('middlePoint', JSON.stringify(middlePoint));
                await delay(timeBetweenEachPoint);
                const gameState = index_1.gameService.getState(lobbyId);
                if (gameState === AbsGameLobby_1.LobbyState.foundRightWord || gameState === AbsGameLobby_1.LobbyState.failedRightOfReply || gameState === undefined) {
                    break;
                }
            }
            const lastPoint = { point: orderedPath[i].point[orderedPath[i].point.length - 1], room: lobbyId, pathId: i };
            io.to(LOBBY_PREFIX + lobbyId).emit('lastPoint', JSON.stringify(lastPoint));
        }
        console.log('Fin d envoie du dessindu lobby ' + lobbyId);
    }
    async function delay(ms) {
        await new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    function getDelay(lobbyId, numberOfPoints) {
        // TODO changer le gros switch pour gameService.getTime
        const difficulty = index_1.gameService.getDifficulty(lobbyId);
        let time = 60000;
        switch (difficulty) {
            case exports.EASY: {
                time = 60000;
                break;
            }
            case exports.MEDIUM: {
                time = 40000;
                break;
            }
            case exports.DIFFICULT: {
                time = 20000;
                break;
            }
        }
        return time * exports.TIME_PERCENTAGE_COMPLETION / numberOfPoints;
    }
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    socket.on('startGame', startGame);
    socket.on('guess', guess);
    socket.on('hint', hint);
    socket.on('playerLeft', playerLeftHandler);
    socket.on('clientReadyToStart', clientReadyToStart);
    socket.on('artistIsReady', artistIsReady);
    socket.on('thumbsUp', thumpsUp);
    socket.on('thumbsDown', thumpsDown);
};
