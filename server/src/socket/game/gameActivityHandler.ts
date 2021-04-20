import { Server, Socket } from 'socket.io';
import { TimeRemaining } from './timeRemaining';
import { ClientIsReadyModel } from '../../models/Game/clientIsReadyModel';
import { StartGameInfoModel } from '../../models/Game/StartGameInfoModel';
import { newRoundModel } from '../../models/Game/newRoundModel';
import { gameService } from '../../index';
import { virtualPlayerService } from '../../index';
import { PlayerInfo } from '../../models/Game/playerinfo'
import { RoundInfo } from '../../models/Game/roundInfo';
import { getAvatar, getUsername, getId } from '../../database/login';
import { GuessModel } from '../../models/Game/GuessModel';
import { GuessResponseModel } from '../../models/Game/GuessResponseModel';
import { lobbyList } from '../../index';
import { LobbyState, MAX_HINT } from '../../models/Game/AbsGameLobby';
import { EndGameModel } from '../../models/Game/endGameModel';
import { addMessage } from '../../database/messages';
import { GivePointsModel } from '../../models/Game/giverPointsModel';
import { UserInfo } from '../../models/lobby/userInfo';
import { getLine } from '../../database/game';
import { PathLine } from '../../models/Game/pathLineModel';
import { FirstPointModel } from '../../models/Path/firstPointModel'
import { MiddlePointModel } from '../../models/Path/middlePointModel'
import { LastPointModel } from '../../models/Path/lastPointModel'

export const EASY = 1;
export const MEDIUM = 2;
export const DIFFICULT = 3;
export const TIME_PERCENTAGE_COMPLETION = 0.75;

import { ThumbsModel} from '../../models/Game/tumbsModel';
import { thumbsUp, thumbsDown } from '../../database/thumbs';
import { BattleRoyalLivesModel } from '../../models/Game/battleRoyaleLivesModel';


module.exports = (io : Server, socket : Socket) => {
    const CHANNEL_PREFIX = "Lobby "
    const LOBBY_PREFIX = "channel-Lobby " 
    const guess = async (data: any) => {
        const guessModel: GuessModel = JSON.parse(data) as GuessModel
        const lobbyId: number = guessModel.room
        const currentLobbyState: LobbyState | undefined = gameService.getState(lobbyId)
        const gamemode = gameService.getGamemode(lobbyId)
        const guessResult = gameService.getWord(lobbyId).toLowerCase() === guessModel.guess.toLowerCase()
        let isGuessClose = false;
        if(!guessResult){
            const cost: number = gameService.comparisonCost(guessModel.guess.toLowerCase(), gameService.getWord(lobbyId).toLowerCase());
            if(cost <= 1){
                isGuessClose = true;
                const idArtist = gameService.getArtist(lobbyId)
                let message = "";
                if(idArtist > 999){
                    message = virtualPlayerService.getCloseGuess(idArtist)
                } else {
                    message = "Tu es si proche de la bonne réponse!!"
                }
                await sendMessageToChat(lobbyId, idArtist, message)
            }
        }
        if(guessResult) {
            isGuessClose = true;
            if (gamemode === "battleRoyal") {
                const playerId: number = guessModel.userId
                gameService.correctGuess(lobbyId, playerId)
            }
            else {
                gameService.setState(lobbyId, LobbyState.foundRightWord)
            }
        } else if (currentLobbyState === LobbyState.guessing) {
            gameService.newWrongGuess(lobbyId)
        } else if (currentLobbyState === LobbyState.rightOfReply) {
            gameService.setState(lobbyId, LobbyState.failedRightOfReply)
        }
        // Envoie de la reponse du guess pour la retroaction du client
        const guessResponseModel : GuessResponseModel = {
            userId : guessModel.userId,
            isGuessCorrect : guessResult,
            room : guessModel.room,
            isGuessClose : isGuessClose
        }
        guessResponse(guessResponseModel);
        sendRoundInfo(lobbyId)
    }

    const guessResponse = (guessResponse : GuessResponseModel) => {
        io.to(LOBBY_PREFIX + guessResponse.room).emit("guessResponse", JSON.stringify(guessResponse)) 
        socket.emit("guessResponseIsClose", JSON.stringify(guessResponse)) 
    }

    const hint = async (msg: any) => {
        const artist = gameService.getArtist(msg.room)
        const message = gameService.getHint(msg.room)
        await sendMessageToChat(msg.room, artist, message)
    }

    async function virtualPlayerGameStart(lobbyId: number) {
        const artists = gameService.getVirtualPlayers(lobbyId)
        for (const artist of artists) {
            const message = await virtualPlayerService.getGameStart(artist)
            await sendMessageToChat(lobbyId, artist, message)
        }
    }

    async function virtualPlayerRoundEnd(lobbyId: number) {
        const artists = gameService.getVirtualPlayers(lobbyId)
        for (const artist of artists) {
            const message = virtualPlayerService.getRoundEnd(artist)
            await sendMessageToChat(lobbyId, artist, message)
        }
    }

    async function virtualPlayerStats(lobbyId: number) {
        const artist = gameService.getArtist(lobbyId)
        if (artist > 999) {
            const message = await virtualPlayerService.getStat(artist)
            await sendMessageToChat(lobbyId, artist, message)
        }
    }

    async function virtualPlayerCheering(lobbyId: number) {
        const artist = gameService.getArtist(lobbyId)
        if (artist > 999) {
            const message = virtualPlayerService.getCheering(artist)
            await sendMessageToChat(lobbyId, artist, message)
        }
    }

    
    async function sendMessageToChat(lobbyId: number, artist: number, message: string) {
        let username = "Botty Crocker"
        let avatar = "9"
        const time = getCurrentTime()
        let idPlayer = "10"
        if (artist > 999) {
            username = virtualPlayerService.getName(artist)
            avatar = virtualPlayerService.getAvatar(artist).toString()
            idPlayer = virtualPlayerService.getIdPlayer(artist).toString()
        }
        const isMessageAdded = await addMessage(CHANNEL_PREFIX + lobbyId, idPlayer, message, time)
        if(isMessageAdded){
            io.to(LOBBY_PREFIX + lobbyId).emit('chatMessage', {message: message, username: username, avatar: avatar, time: time, room: CHANNEL_PREFIX + lobbyId, idPlayer: idPlayer} );
        }
    }

    function getCurrentTime(){
        const d = new Date();
        const h = `${d.getHours()}`.padStart(2, '0');
        const m = `${d.getMinutes()}`.padStart(2, '0');
        const s = `${d.getSeconds()}`.padStart(2, '0');
        return h + ":" + m + ":" + s;
    }

    const playerLeftHandler = (data: any) => {
        // to implement
    }

    const startGame = async (data: any) => {
        const lobbyId = (JSON.parse(data) as StartGameInfoModel).lobbyId // TODO: passer les avatars et les id aussi
        if(gameService.getState(lobbyId) !== LobbyState.waitingForPlayerResponse) {
            let arrayOfPlayersId = []
            gameService.setState(lobbyId, LobbyState.waitingForPlayerResponse)
            const users = lobbyList.getLobby(lobbyId).players
            for(const player of users) {
                arrayOfPlayersId.push(player.id)
            }
            const difficulty = lobbyList.getLobby(lobbyId).difficulty
            const gamemode = lobbyList.getLobby(lobbyId).gamemode
            gameService.addLobby(lobbyId, arrayOfPlayersId, difficulty, gamemode)
            lobbyList.lobbyGameStarted(lobbyId)
            const list = lobbyList.getLobbies();
            io.emit('lobbyListRequested', list);
            arrayOfPlayersId = gameService.getPlayersId(lobbyId) 
            await gameService.genWord(lobbyId)
            const virtualPlayers = gameService.getVirtualPlayers(lobbyId)
            const players : PlayerInfo[] = await constructPlayersInfo(users, lobbyId, virtualPlayers)
            io.to(LOBBY_PREFIX + lobbyId).emit("gameSetup", JSON.stringify(players))
            io.to(LOBBY_PREFIX + lobbyId).emit("loadGame")
            io.to(LOBBY_PREFIX + lobbyId).emit("toggleChat", {lobbyid: lobbyId});
            gameService.startGameTimer(lobbyId);
            startWaitingTimer(lobbyId)
        }
    }
    async function startWaitingTimer(lobbyId: number) {
        let time = 8000
        const interval = setInterval(async function(){
            time -= 1000
            if(gameService.lobbyReadyToStart(lobbyId)){
                clearInterval(interval)
            } else if(time <= 0) {
                clearInterval(interval)
                endGame(lobbyId, "Erreur! Un joueur a rencontré un problème de connexion, veuillez retourner au lobby et réessayer", false)
            }
        }, 1000);
    }
    async function constructPlayersInfo(lobbyUsers: UserInfo[], lobbyId: number, virtualPlayers: number[]) {
        const players : PlayerInfo[]  = []
        for(const user of lobbyUsers) {
            players.push(await getPlayerInfoForGame(user, lobbyId))
        }
        for (const userId of virtualPlayers) {
            const virtualId = virtualPlayerService.getIdPlayer(userId)
            players.push(getVirtualPlayerInfoForGame(virtualId, userId, lobbyId))
        }
        
        return players
    }
    const clientReadyToStart = async (data: any) => {
        let userId: number= (JSON.parse(data) as ClientIsReadyModel).userId
        const lobbyId = gameService.getUserLobby(userId)
        if(lobbyId !== null){
            gameService.setPlayerStatus(lobbyId, userId, true)
            if(gameService.lobbyReadyToStart(lobbyId) && !gameService.isVirtualPlayerDrawing(lobbyId)) {
                gameService.setVirtualPlayerIsDrawing(lobbyId, true)
                startRound(lobbyId)
                await virtualPlayerGameStart(lobbyId)
                startVirtualPlayerRound(lobbyId)
            }
        }
    }

    const thumpsUp = async (data: any) => {
        const info = (JSON.parse(data) as ThumbsModel);
        io.to(LOBBY_PREFIX + info.lobbyId).emit("thumbsUp", JSON.stringify({idplayer: info.idplayer}));
        thumbsUp(info.idplayer);
    }

    const thumpsDown = async (data: any) => {
        const info = (JSON.parse(data) as ThumbsModel);
        io.to(LOBBY_PREFIX + info.lobbyId).emit("thumbsDown", JSON.stringify({idplayer: info.idplayer}));
        thumbsDown(info.idplayer);
    }

    async function startRound(lobbyId: number) {
        if (gameService.getGamemode(lobbyId) === "battleRoyal") {
            const users = lobbyList.getLobby(lobbyId).players
            const players : PlayerInfo[] = gameService.getPlayerInfo(lobbyId, users)
            io.to(LOBBY_PREFIX + lobbyId).emit("gameSetup", JSON.stringify(players))
        }
        if(gameService.lobbyHasNextRound(lobbyId)) {
            gameService.setState(lobbyId, LobbyState.guessing)
            const newRoundModel: newRoundModel =  {
                artist: gameService.getArtistPureId(lobbyId), // TODO renvoyer l'artiste
                word: gameService.getWord(lobbyId) 
            }
            io.to(LOBBY_PREFIX + lobbyId).emit('newRound', JSON.stringify(newRoundModel))
            io.to(LOBBY_PREFIX + lobbyId).emit('clearDrawing')
            sendRoundInfo(lobbyId);
        } else {
            endGame(lobbyId)
        }
    }

    function sendRoundInfo(lobbyId: number){
        const roundInfo: RoundInfo =  {
            roundRemaining: gameService.getRoundNumber(lobbyId),
            guessRemaining: gameService.getActiveGuess(lobbyId),
            lifeRemaining: gameService.getPlayerLives(lobbyId),
            maxGuess: gameService.getMaxGuess(lobbyId),
            maxRound: gameService.getMaxRound(lobbyId),
            maxLife: gameService.getMaxLives(lobbyId)
        }
        io.to(LOBBY_PREFIX + lobbyId).emit("roundInfo", JSON.stringify(roundInfo))
    }

    function startVirtualPlayerRound(lobbyId: number) {
        if(gameService.lobbyHasNextRound(lobbyId)) {
            if (gameService.getArtist(lobbyId) > 999) {
                startTimer(lobbyId, gameService.getTime(lobbyId))
                sendDrawing(lobbyId)
            }
        }
    }
    
    const artistIsReady = (data: any) => {
        const clientIsReadyModel = JSON.parse(data) as ClientIsReadyModel
        const lobbyId = gameService.getUserLobby((clientIsReadyModel).userId)
        const userId = clientIsReadyModel.userId
        //TODO: aller chercher le temps du mots ici
        if(lobbyId !== null && userId === gameService.getArtist(lobbyId)) {
            io.to(LOBBY_PREFIX + lobbyId).emit('clearDrawing')
            startTimer(lobbyId, gameService.getTime(lobbyId))
        }
    }
   
    function startTimer(lobbyId: number, time: number) {
        const interval = setInterval(async function(){
            time -= 1000
            const timeRemaining: TimeRemaining = {
                time: millisToMinutesAndSeconds(time)
            }
            io.to(LOBBY_PREFIX + lobbyId).emit("updateTime", JSON.stringify(timeRemaining))
            const currentLobbyState: LobbyState | undefined = gameService.getState(lobbyId)
            const gamemode = gameService.getGamemode(lobbyId)
            //Fin d'une round quand le mot est trouvé 
            if(currentLobbyState === LobbyState.foundRightWord) {
                await virtualPlayerCheering(lobbyId)
                if (gamemode === "classic" || gamemode === "battleRoyal") {
                    clearInterval(interval)
                    clearTimer(lobbyId)
                    timeRemaining.time = "00:00"
                    io.to(LOBBY_PREFIX + lobbyId).emit("updateTime", JSON.stringify(timeRemaining))
                    await virtualPlayerRoundEnd(lobbyId)
                    
                    givePoints(lobbyId)

                    await gameService.prepareLobbyForNewRound(lobbyId)
                    startRound(lobbyId)
                    startVirtualPlayerRound(lobbyId) 
                }
                else if (gamemode == "coop") { 
                    givePoints(lobbyId) 
                    gameService.setTime(lobbyId, time += 10000) // TODO ajuster 
                    clearInterval(interval)
                    await gameService.prepareLobbyForNewRound(lobbyId)
                    startRound(lobbyId)
                    startVirtualPlayerRound(lobbyId)
                }
            } else if (currentLobbyState === LobbyState.MaxGuessReached) { 
                if (gamemode == "classic") {
                    gameService.setState(lobbyId, LobbyState.rightOfReply)
                    clearInterval(interval)
                    clearTimer(lobbyId)
                    startRightOfReply(lobbyId) 
                }
            } else if (currentLobbyState === LobbyState.failedRightOfReply) {
                if (gamemode == "coop") {
                    gameService.setTime(lobbyId, time)
                    clearInterval(interval)
                    clearTimer(lobbyId)
                    await virtualPlayerRoundEnd(lobbyId) 
                    await gameService.prepareLobbyForNewRound(lobbyId)
                    startRound(lobbyId)
                    startVirtualPlayerRound(lobbyId)
                } else {
                    clearInterval(interval)
                    clearTimer(lobbyId)
                    await virtualPlayerRoundEnd(lobbyId)
                    await gameService.prepareLobbyForNewRound(lobbyId)
                    startRound(lobbyId)
                }
            } else if (currentLobbyState === LobbyState.gameHasEnded) {
                clearInterval(interval)
                clearTimer(lobbyId)
                endGame(lobbyId, "La partie est terminé, un joueur à quitté")
            } else if(time <= 0) {
                clearInterval(interval)
                clearTimer(lobbyId)
                if(currentLobbyState === LobbyState.guessing) {
                    await virtualPlayerStats(lobbyId)
                    if (gamemode === "classic") { 
                        gameService.setState(lobbyId, LobbyState.rightOfReply)
                        clearInterval(interval)
                        startRightOfReply(lobbyId)
                    }
                    else if (gamemode === "coop") {
                        gameService.setTime(lobbyId, 0)
                        clearInterval(interval)
                        await virtualPlayerRoundEnd(lobbyId)
                        await gameService.prepareLobbyForNewRound(lobbyId)
                        startRound(lobbyId)
                    }
                    else if (gamemode === "battleRoyal") {
                        clearInterval(interval)
                        clearTimer(lobbyId)
                        await virtualPlayerRoundEnd(lobbyId)
                        await gameService.prepareLobbyForNewRound(lobbyId)
                        startRound(lobbyId)
                        startVirtualPlayerRound(lobbyId) 
                    }
                } else {
                    await virtualPlayerRoundEnd(lobbyId)
                    await gameService.prepareLobbyForNewRound(lobbyId)
                    startRound(lobbyId)
                    startVirtualPlayerRound(lobbyId)
                } 
            }
        }, 1000);
    }
    function startRightOfReply(lobbyId: number) {
        gameService.rightOfReply(lobbyId)
        startTimer(lobbyId, gameService.getTime(lobbyId)/2) //TODO: time for right of reply 
        io.to(LOBBY_PREFIX + lobbyId).emit("rightOfReply")
    }
    function millisToMinutesAndSeconds(millis: number) {
        const minutes: number = Math.floor(millis / 60000)
        const seconds: number = (millis % 60000) / 1000
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds
    }
    function clearTimer(lobbyId: number): void {
        const timeRemaining: TimeRemaining = {
            time: "00:00"
        }
        io.to(LOBBY_PREFIX + lobbyId).emit("updateTime", JSON.stringify(timeRemaining))
    }
    function givePoints(lobbyId: number) {
        const model: GivePointsModel | undefined = gameService.givePoints(lobbyId)
        if(model != undefined) {
            io.to(LOBBY_PREFIX + lobbyId).emit("givePoints", JSON.stringify(model))
        }
    } 
    async function getPlayerInfoForGame(user: UserInfo, lobbyId: number): Promise<PlayerInfo> {
        let team = gameService.getUsersTeam(user.id, lobbyId)
        if(team === undefined) {
            console.warn(`can't find team number of userid ${user.id}`)
            team = 1
        }
        const playerInfo: PlayerInfo = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            team: team
        }
        return playerInfo
    }
    async function endGame(lobbyId: number, message?:string, gameIsValid: boolean = true) {
        const lobbyName = "Lobby " + lobbyId
        const endGameModel: EndGameModel = {
            message: message ? message : "La partie est terminée"
        }
        io.to(LOBBY_PREFIX + lobbyId).emit('endGame', JSON.stringify(endGameModel))
        if(gameIsValid){
            await gameService.addGameToDb(lobbyId);
        }
        io.to(LOBBY_PREFIX + lobbyId).emit('leaveChannelLobby', {channelName: lobbyName})
        gameService.setState(lobbyId, LobbyState.gameHasEnded)
        lobbyList.removeAllPlayers(lobbyId)
        gameService.removeLobby(lobbyId)
        lobbyList.lobbyGameEnded(lobbyId)
        const list = lobbyList.getLobbies();
        io.emit('lobbyListRequested', list);
    }
    function getVirtualPlayerInfoForGame(userId: number, virtualPlayerGameId: number, lobbyId: number): PlayerInfo {
        let team = gameService.getUsersTeam(virtualPlayerGameId, lobbyId)
        if(team === undefined) {
            console.warn(`can't find team number of virtualplayerid ${virtualPlayerGameId}`)
            team = 1
        }
        const playerInfo: PlayerInfo = {
            id: userId,
            name: virtualPlayerService.getName(virtualPlayerGameId),
            avatar: virtualPlayerService.getAvatar(virtualPlayerGameId).toString(),
            team: team
        }
        return playerInfo
    }

    async function sendDrawing(lobbyId: number){
        const pathData = await getLine( gameService.getWordID(lobbyId)) as PathLine[];
        let orderedPath = new Array<PathLine>(pathData.length)
        let amountOfPoints = 0;
    
        // Order les paths
        for (let i = 0; i < pathData.length; i++){
            orderedPath[pathData[i].pathorder] = pathData[i];
            for(const path of pathData[i].point){
                amountOfPoints ++;
            }
        }

        // Suffle les paths si mode de dessin random 
        if(gameService.getIsBoolean(lobbyId)){
            orderedPath = shuffleArray(orderedPath);
        }

        const timeBetweenEachPoint = getDelay(lobbyId, amountOfPoints);
        
        // envoie des path
        for (let i = 0; i < pathData.length; i++){                        
            const gameState : LobbyState | undefined = gameService.getState(lobbyId);
            if(gameState === LobbyState.foundRightWord || gameState === LobbyState.failedRightOfReply || gameState === undefined){
                gameService.setVirtualPlayerIsDrawing(lobbyId, false)
                break;
            }

            const firstPoint: FirstPointModel = {thickness: orderedPath[i].thickness, point: orderedPath[i].point[0], color: orderedPath[i].color, room: lobbyId};
            io.to(LOBBY_PREFIX + lobbyId).emit('firstPoint', JSON.stringify(firstPoint));
            
            for (let j = 1; j < orderedPath[i].point.length - 1; j++){
                const middlePoint: MiddlePointModel = { point: orderedPath[i].point[j], room: lobbyId};
                io.to(LOBBY_PREFIX + lobbyId).emit('middlePoint', JSON.stringify(middlePoint));
                await delay(timeBetweenEachPoint);

                const gameState = gameService.getState(lobbyId);
                if(gameState === LobbyState.foundRightWord || gameState === LobbyState.failedRightOfReply || gameState === undefined){
                    gameService.setVirtualPlayerIsDrawing(lobbyId, false)
                    break;
                }
            }
            
            const lastPoint: LastPointModel = { point: orderedPath[i].point[orderedPath[i].point.length - 1], room: lobbyId, pathId: i};
            io.to(LOBBY_PREFIX + lobbyId).emit('lastPoint', JSON.stringify(lastPoint));
            
        }
    }

    async function delay(ms: number) {
        await new Promise<void>(resolve => setTimeout(()=>resolve(), ms));
    }

    function getDelay(lobbyId: number, numberOfPoints: number){
        // TODO changer le gros switch pour gameService.getTime
        const difficulty = gameService.getDifficulty(lobbyId); 
        let time = 60000;
        switch(difficulty) {
          case EASY : {
            time = 60000;
             break;
          }
          case MEDIUM : {
            time = 40000;
            break;
         }
         case DIFFICULT : {
          time = 20000
          break;
        }
       }
        return time * TIME_PERCENTAGE_COMPLETION / numberOfPoints ;
    }

    function shuffleArray(array: PathLine[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    

    socket.on('startGame', startGame)
    socket.on('guess', guess)
    socket.on('hint', hint)
    socket.on('playerLeft', playerLeftHandler)
    socket.on('clientReadyToStart', clientReadyToStart)
    socket.on('artistIsReady', artistIsReady)
    socket.on('thumbsUp', thumpsUp)
    socket.on('thumbsDown', thumpsDown)
};

