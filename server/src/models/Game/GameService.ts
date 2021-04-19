import { clearHistory, leaveChannelLobbyWithIdPlayer } from "../../database/channel"
import { addNewGame, addNewPlayerGame, updatePlayerStats } from "../../database/game"
import { AbsGameLobby, LobbyState, MAX_ROUND } from "./AbsGameLobby"
import { BattleRoyalLivesModel } from "./battleRoyaleLivesModel"
import { GameLobbyBattleRoyal } from "./GameLobbyBattleRoyal"
import { GameLobbyClassic } from "./GameLobbyClassic"
import { GameLobbyCoop } from "./GameLobbyCoop"
import { GivePointsModel } from "./giverPointsModel"
import { PlayerInfo } from "./playerinfo"
import { UserInfo } from '../../models/lobby/userInfo';

export class GameService {
    gameLobbies: Map<number, AbsGameLobby>
    constructor() {
        this.gameLobbies = new Map()
    }

    addLobby(lobbyId:number, playersId: Array<number>, difficulty: string, gamemode: string): void {
        switch(gamemode) {
            case "Sprint Solo": 
            case "Sprint Co-Op": {
                this.gameLobbies.set(lobbyId, new GameLobbyCoop(lobbyId, playersId, difficulty))
                console.log("Sprint Co-Op");
                break
            }
            case "Classique": {
                this.gameLobbies.set(lobbyId, new GameLobbyClassic(lobbyId, playersId, difficulty))   
                console.log("Classique");
                break
            }
            case "Battle Royale": {
                this.gameLobbies.set(lobbyId, new GameLobbyBattleRoyal(lobbyId, playersId, difficulty))   
                console.log("BR");
                break
            }
        }
    }

    getUserLobby(userId: number): number | null {
        for( const lobby of this.gameLobbies.values() ) {
            if(lobby.containsPlayer(userId)) {
                return lobby.gameLobbyId
            }
        }
        return null
    }

    lobbyReadyToStart(lobbyId: number): boolean {
        const lobby = this.gameLobbies.get(lobbyId)
        if(lobby !== undefined){
            return lobby.isReadyToStart()
        }
        return false
    }

    getGamemode(lobbyId: number): string {
        const lobby = this.gameLobbies.get(lobbyId)
        if(lobby !== undefined) {
            return lobby.getGamemode()
        } else {
            return "error gamemode"
        }
    }

    getArtist(lobbyId: number): number {
        const lobby = this.gameLobbies.get(lobbyId)
        if(lobby !== undefined) {
            return lobby.getArtist()
        } else {
            return -1
        }
    }
    getArtistPureId(lobbyId: number): number {
        const lobby = this.gameLobbies.get(lobbyId)
        if(lobby !== undefined) {
            return lobby.getArtistPureId()
        } else {
            return -1
        }
    }
    getPlayersId(lobbyId: number): number[] {
        const lobby = this.gameLobbies.get(lobbyId)
        if(lobby !== undefined) {
            return lobby.getPlayersId()
        } else {
            return []
        }
    }
    getPlayerInfo(lobbyId: number, users: UserInfo[]): PlayerInfo[] {
        const lobby = this.gameLobbies.get(lobbyId)
        if(lobby !== undefined) {
            return lobby.getPlayerInfo(users)
        } else {
            return []
        }
    }
    getVirtualPlayers(lobbyId: number): number[] {
        const lobby = this.gameLobbies.get(lobbyId)
        if(lobby !== undefined) {
            return lobby.getVirtualPlayers()
        } else {
            return []
        }
    }

    async prepareLobbyForNewRound(lobbyid: number): Promise<void> {
        await this.gameLobbies.get(lobbyid)?.nextRound()
    }

    async genWord(lobbyId: number): Promise<void> {
        const lobby = this.gameLobbies.get(lobbyId)
        if(lobby !== undefined){
            await lobby.genWord()
        }
    }

    getWord(lobbyId: number): string {
        const lobby = this.gameLobbies.get(lobbyId)
        if(lobby !== undefined) {
            return lobby.getWord()
        } else {
            return ""
        }
    }

    getIsBoolean(lobbyId: number): boolean {
        const lobby = this.gameLobbies.get(lobbyId)
        if(lobby !== undefined) {
            return lobby.getIsBoolean();
        } else {
            return false;
        }
    }

    getHint(lobbyId: number): string {
        const lobby = this.gameLobbies.get(lobbyId)
        if(lobby !== undefined) {
            return lobby.getWordHint()
        } else {
            return ""
        }
    }

    getWordID(lobbyId: number): number {
        const lobby = this.gameLobbies.get(lobbyId)
        if(lobby !== undefined) {
            return lobby.getWordID()
        } else {
            return 1
        }
    }

    getDifficulty(lobbyId: number): number {
        const lobby = this.gameLobbies.get(lobbyId)
        if(lobby !== undefined) {
            return lobby.getDifficulty()
        } else {
            return 1
        }
    }
    getTime(lobbyId: number): number {
        const lobby = this.gameLobbies.get(lobbyId)
        if(lobby !== undefined) {
            return lobby.getTime()
        } else {
            return 1
        }
    }

    setTime(roomId:number, time: number): void {
        this.gameLobbies.get(roomId)?.setTime(time)
    }


    setPlayerStatus(roomId:number, artistId: number, status: boolean): void {
        this.gameLobbies.get(roomId)?.setPlayerStatus(artistId, status)
    }

    getUsersTeam(userId: number, lobbyId:number): number | undefined {
        const lobby = this.gameLobbies.get(lobbyId)
        if(lobby !== undefined){
            return this.gameLobbies.get(lobbyId)?.getUserTeamNumber(userId); 
        }
        return undefined
    }

    rightOfReply(lobbyId: number): void {
        this.gameLobbies.get(lobbyId)?.rightOfReply()
    }

    guessIsARighOfReply(lobbyId: number): boolean | undefined {
        const lobby = this.gameLobbies.get(lobbyId)
        return lobby?.isWaitingForRightOfReply()
    }

    getNumberOfGuess(lobbyId: number): number | undefined {
        const lobby = this.gameLobbies.get(lobbyId)
        return lobby?.getNumberOfGuess()
    }

    correctGuess(lobbyId: number, playerId: number): void {
        this.gameLobbies.get(lobbyId)?.correctGuess(playerId)
    }

    newWrongGuess(lobbyId: number): void {
        this.gameLobbies.get(lobbyId)?.newWrongGuess()
    }

    async getArtistSocket(lobbyid: number): Promise<any> {
        const lobby = this.gameLobbies.get(lobbyid)
        if(lobby) {
            return await lobby.getArtistSocket()
        } else {
            return Promise.reject()
        }
    }

    getState(lobbyId: number): LobbyState | undefined {
        const lobby = this.gameLobbies.get(lobbyId)
        return lobby?.getSate()
    }

    setState(lobbyId: number, state: LobbyState): void {
        this.gameLobbies.get(lobbyId)?.setState(state)
    }

    lobbyHasNextRound(lobbyId: number): boolean | undefined {
        const lobby = this.gameLobbies.get(lobbyId)
        if(lobby == undefined) {
            return undefined
        }
        const nbOfRound = lobby.getNumberOfRound()
        return nbOfRound ? nbOfRound <= MAX_ROUND : false
    }

    getRoundNumber(lobbyId: number): number | null{
        const lobby = this.gameLobbies.get(lobbyId)
        return lobby ? lobby.getNumberOfRound() : null
    }

    getActiveGuess(lobbyId: number): number | null {
        const lobby = this.gameLobbies.get(lobbyId)
        return lobby ? lobby.getActiveGuess() : null
    }

    getRoundGuess(lobbyId: number): number | null {
        const lobby = this.gameLobbies.get(lobbyId)
        return lobby ? lobby.getRoundGuess() : null
    }

    getPlayerLives(lobbyId: number): BattleRoyalLivesModel | null {
        const lobby = this.gameLobbies.get(lobbyId)
        return lobby ? lobby.getPlayerLives() : null
    }

    getMaxGuess(lobbyId: number): number | null {
        const lobby = this.gameLobbies.get(lobbyId)
        return lobby ? lobby.getMaxGuess() : null
    }

    getMaxRound(lobbyId: number): number | null {
        const lobby =  this.gameLobbies.get(lobbyId)
        return lobby ? lobby.getMaxRound() : null
    }

    getMaxLives(lobbyId: number): number | null {
        const lobby = this.gameLobbies.get(lobbyId)
        return lobby ? lobby.getMaxLives() : null
    }
    givePoints(lobbyId: number): GivePointsModel | undefined  {
        const lobby = this.gameLobbies.get(lobbyId)
        if(lobby == undefined) {
            return undefined
        }
        return lobby.givePoints()
    }

    async addGameToDb(lobbyId: number): Promise<void> {
        let gameModeId = 2
        const lobby = this.gameLobbies.get(lobbyId)
        if(lobby == undefined) {
            return Promise.reject()
        }
        switch(lobby.getGamemode()) {
            case "battleRoyal": {
                gameModeId = 3
                break
            }
            case "coop": {
                if (this.gameLobbies.get(lobbyId)?.getPlayersId().length === 2) {
                    gameModeId = 0
                }
                else {
                    gameModeId = 1
                }
            }
        }
        const difficultyLevel: number = this.getDifficulty(lobbyId)
        const gameLength: number = this.getGameLength(new Date(), lobbyId) || 0

        const idGame = await addNewGame(gameModeId, difficultyLevel, gameLength)
        await this.addPlayersToGame(idGame, lobbyId, gameModeId, gameLength);

        
    }

    async addPlayersToGame(idGame: number, lobbyId: number, gameModeId: number, gameLength: number): Promise<void> {
        const idPlayers = this.getPlayersId(lobbyId);
        const lobbyName = "Lobby " + lobbyId;
        const lobby = this.gameLobbies.get(lobbyId);
        if(lobby == undefined) {
            console.warn(`lobby ${lobbyId} not found when trying to addPlayersToGame`);
        }else{
            for(const idPlayer of idPlayers) {
                let playerDbId = idPlayer
                if (idPlayer > 999) {
                    playerDbId = lobby.getArtistPureId()
                }
                const isWinner = lobby.isWinner(playerDbId);
                const result = lobby.getResult(playerDbId) || 0;
                await addNewPlayerGame(idGame, playerDbId, isWinner, result)
                await updatePlayerStats(playerDbId, isWinner, gameModeId, result, gameLength)
                await leaveChannelLobbyWithIdPlayer(lobbyName, playerDbId);
                await clearHistory(lobbyName);
            }
        }
    }

    private getGameLength(finalTime: Date, lobbyId: number): number | undefined {
        const startTime = this.gameLobbies.get(lobbyId)?.getGameStartedTime()
        if(startTime == undefined) {
            return undefined
        }
        const time = finalTime.getTime() - startTime.getTime();
        const secondes = Math.round(time / 1000)

        return secondes;
    }

    startGameTimer(lobbyId: number): void {
        this.gameLobbies.get(lobbyId)?.setGameStartedTime(new Date());
    }

    removeLobby(lobbyId: number): void {
        this.gameLobbies.delete(lobbyId)
    }
    playerHasLeft(userId: number): void {
        const lobbyId = this.getUserLobby(userId)
        if(lobbyId !== null) {
            this.gameLobbies.get(lobbyId)?.setState(LobbyState.gameHasEnded)
        }
    }

    public comparisonCost(guess: string, answer: string): number{
        // https://fr.wikipedia.org/wiki/Distance_de_Levenshtein
        const a = " " + guess;
        const b = " " + answer;
        const aSize = a.length
        const bSize = b.length
        let D: number[][] = [];
        let i, j, cost = 0
        for(i = 0; i <= aSize; ++i){
            D[i] = []
            D[i][0] = i
        }

        for(j = 0; j <= bSize; ++j){
            D[0][j] = j;
        }

        for(i = 1; i <= aSize; ++i){
            for(j = 1; j <= bSize; ++j){
                if(a[i] === b[j]){
                    cost = 0;
                } else {
                    cost = 1;
                }

                D[i][j] = Math.min(  
                    D[i - 1][j] + 1, // effacement
                    D[i][j - 1] + 1, // insertion
                    D[i - 1][j - 1] + cost //substitution
                );
            }
        }

        return D[aSize][bSize];
    }
}