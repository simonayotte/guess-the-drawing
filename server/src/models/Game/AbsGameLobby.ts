import { getNewWord } from '../../database/game';
import { getIdSocket } from '../../database/login';
import { WordModel } from '../WordModel';
import { GivePointsModel } from './giverPointsModel';
import { virtualPlayerService } from '../../index';
import { BattleRoyalLivesModel } from './battleRoyaleLivesModel';
import { PlayerInfo } from './playerinfo';
import { UserInfo } from '../lobby/userInfo';
export enum LobbyState {
    MaxGuessReached = "MaxGuessReached",
    rightOfReply = "RightOfReply",
    failedRightOfReply = "failedRightOfReply",
    default = "default",
    guessing = "guessing",
    foundRightWord = "foundRightWord",
    gameHasEnded = "gameHasEnded",
    waitingForPlayerResponse = "waitingForPlayerResponse"
}
//TODO : changer
export const MAX_GUESS = 4
export const MAX_ROUND = 4
export const MAX_HINT = 3
export abstract class AbsGameLobby {
    gameLobbyId: number
    playersIds: Array<number>
    firstTeam: Array<number>
    secondTeam: Array<number>
    artist: number
    playerStatus: Map<number, boolean> /* représente l'état d'un joueur dans une partie. Ca évite de partir une game pendant qu'un client load son ui
                                        False indique qu'il n'est pas dans une position pour commencer une round ou partie
                                        True indique qu'il est prêt */
    playerScores: Map<number, number>
    word: WordModel
    lastArtistFirstTeam: number
    lastArtistSecondTeam: number
    state: LobbyState
    round: number
    difficulty: number
    hintNumber: number
    isArtistTeamGuessing: boolean
    activeGuess: number
    maxGuess: number
    scoreSecondTeam: number
    scoreFirstTeam: number
    time: number
    gameStartedTime: Date
    virtualPlayerIsDrawing: boolean
    constructor(id: number, playerIds: Array<number>, difficulty: string) {
        this.gameLobbyId = id
        this.playersIds = []
        this.playerStatus = new Map()
        this.playerScores = new Map()
        this.initPlayerStatus()
        this.firstTeam = []
        this.secondTeam = []
        this.artist = -1
        this.word = {idDrawing: 0,
            drawingName: "",
            indice: ["Botty Crocker"],
            isRandom: true}  as WordModel
        this.lastArtistFirstTeam = 1
        this.lastArtistSecondTeam = 1
        this.state = LobbyState.default
        this.round = 1
        this.difficulty = 1
        this.time = 60000
        this.maxGuess = 4
        switch(difficulty) {
            case "Intermédiaire": {
                this.difficulty = 2
                this.time =  40000
                this.maxGuess = 2
                break
            }
            case "Difficile": {
                this.difficulty = 3
                this.time =  20000
                this.maxGuess = 0
            }
        }
        this.hintNumber = 0
        this.isArtistTeamGuessing = true
        this.activeGuess = 0
        this.scoreFirstTeam = 0
        this.scoreSecondTeam = 0
        this.gameStartedTime = new Date()
        this.virtualPlayerIsDrawing = false
    }

    containsPlayer(playerId: number): boolean {
        return this.playersIds.includes(playerId)
    }

    protected initPlayerStatus(): void {
        for(const id of this.playersIds) {
            this.playerStatus.set(id, false)
        }
    }

    protected initPlayerScore(): void {
        for(const id of this.playersIds) {
            if (id > 999) {
                this.playerScores.set(virtualPlayerService.getIdPlayer(id), 0)
            }
            else {
                this.playerScores.set(id, 0)
            }
        }
    }

    isReadyToStart(): boolean {
        return Array.from(this.playerStatus.values()).every(it => it === true)
    }

    getRoundGuess() {
        return this.maxGuess + 1
    }

    getActiveGuess(): number {
        return this.activeGuess 
    }

    getPlayerLives(){
        const model: BattleRoyalLivesModel = {players: [], lives: []}
        return model
    }
    
    getArtist(): number {
            return this.artist
    }
    getArtistPureId(): number {
        if (this.artist > 999) {
            return virtualPlayerService.getIdPlayer(this.artist)
        }
        else {
            return this.artist
        }
    }
    getArtistSocket(): Promise<any> {
        return Promise.resolve(getIdSocket(this.artist))
    }
    getPlayersId(): number[] { 
        return this.playersIds
    }
    getPlayerInfo(users: UserInfo[]): PlayerInfo[] {
        return []
    }
    getVirtualPlayers(): number[] {
        const virtualPlayers = []
        if (this.playersIds[2] > 999) {
            virtualPlayers.push(this.playersIds[2])
        }
        if (this.playersIds[3] > 999) {
            virtualPlayers.push(this.playersIds[3])
        }
        return virtualPlayers
    }

    getWordID(): number {
        return this.word.idDrawing
    }

    getIsBoolean(): boolean {
        return this.word.isRandom;
    }

    getWord(): string {
        return this.word.drawingName
    }

    getWordHint(): string {
        if (this.hintNumber === MAX_HINT) {
            return "Tous les indices utilisés"
        }
        const hintsLenght = this.word.indice.length
        let hint =  ""
        if (this.hintNumber < hintsLenght - 1) {
            hint = this.word.indice[this.hintNumber]
            this.hintNumber++
        }
        else {
            hint = this.word.indice[hintsLenght - 1]
        }
        if (this.artist > 999) {
            return virtualPlayerService.getHint(this.artist) + hint
        }
        else {
            return "Le prochain indice est: " + hint
        }
    }

    getDifficulty(): number {
        return this.difficulty
    }

    getTime(): number {
        return this.time
    }

    setTime(time: number): void {
        this.time = time
    }

    setPlayerStatus(playerId: number, status: boolean): void {
        this.playerStatus.set(playerId, status)
    }

    getUserTeamNumber(userId: number): number { //if first team returns 1 else return 2
        return this.firstTeam.includes(userId) ? 1 : 2
    }

    getGamemode(): string {
        return "abstract"
    }

    getMaxLives(): number | null{
        return null
    }

    async genWord(): Promise<void> {
        this.word = await getNewWord(this.word.drawingName, this.difficulty)
    }

    async nextRound(): Promise<void> {
        //Ajouter le check des joueurs virtuelles
        // TODO: Check si ton coequipier est virtuel si oui il peut pas deviner
        this.activeGuess = 0
        this.state = LobbyState.guessing
        const lastArtistTeam = this.getUserTeamNumber(this.artist)
        if(lastArtistTeam == 1) { // first team
            if (!this.teamHasVirtualPlayer(2)) {
                this.lastArtistSecondTeam = this.lastArtistSecondTeam == 0 ? 1 : 0
            }
            this.artist = this.secondTeam[this.lastArtistSecondTeam]
            // this.lastArtistSecondTeam = newArtistPosition
        } else if (lastArtistTeam == 2) {
            if (!this.teamHasVirtualPlayer(1)) {
                this.lastArtistFirstTeam = this.lastArtistFirstTeam == 0 ? 1 : 0
            }
            this.artist = this.firstTeam[this.lastArtistFirstTeam]
            // this.lastArtistFirstTeam = newArtistPosition
        }
        this.round += 1
        this.isArtistTeamGuessing = true
        this.hintNumber = 0
        await this.genWord() 
    }

    rightOfReply(): void {
        this.isArtistTeamGuessing = false
        this.activeGuess = 0
    }

    isWaitingForRightOfReply(): boolean {
        return !this.isArtistTeamGuessing
    }

    newWrongGuess(): void {
        this.activeGuess += 1
        if(this.activeGuess > this.maxGuess) {
            this.state = LobbyState.MaxGuessReached
        }
    }

    correctGuess(idPlayer: number): void {
        // to implement
    }

    getNumberOfGuess(): number {
        return this.activeGuess
    }

    getSate(): LobbyState {
        return this.state
    }

    setState(role: LobbyState): void {
        this.state = role
    }

    getNumberOfRound(): number | null {
        return null
    }

    private GetTeamNumberGuessing(): number {
        const artistTeam = this.getUserTeamNumber(this.artist)
        if(this.isArtistTeamGuessing){
            return artistTeam
        } else {
            return artistTeam == 1 ? 2 : 1
        }
    }

    givePoints(): GivePointsModel {
        
        const teamNumber = this.GetTeamNumberGuessing()
        if(teamNumber == 1) {
            this.playerScores.set(this.firstTeam[0], (this.playerScores.get(this.firstTeam[0]) || 0) + 4 - this.hintNumber)
            if (this.firstTeam[1] > 999) {
                this.playerScores.set(virtualPlayerService.getIdPlayer(this.firstTeam[1]), (this.playerScores.get(virtualPlayerService.getIdPlayer(this.firstTeam[1])) || 0) + 4 - this.hintNumber)
            } 
            else {
                this.playerScores.set(this.firstTeam[1], (this.playerScores.get(this.firstTeam[1]) || 0) + 4 - this.hintNumber)
            }
            this.scoreFirstTeam += 4 - this.hintNumber
        } else { 
            this.playerScores.set(this.secondTeam[0], (this.playerScores.get(this.secondTeam[0]) || 0) + 4 - this.hintNumber)
            if (this.secondTeam[1] > 999) {
                this.playerScores.set(virtualPlayerService.getIdPlayer(this.secondTeam[1]), (this.playerScores.get(virtualPlayerService.getIdPlayer(this.secondTeam[1])) || 0) + 4 - this.hintNumber)
            } 
            else {
                this.playerScores.set(this.secondTeam[1], (this.playerScores.get(this.secondTeam[1]) || 0) + 4 - this.hintNumber)
            }
            this.scoreSecondTeam += 4 - this.hintNumber
        }
        const players: number[] = []
        const scores: number[] = []
        for (const player of this.playerScores) {
            players.push(player[0])
            scores.push(player[1])
        }
        const model: GivePointsModel = {
            players: players,
            scores: scores
        }
        return model
    }

    private teamHasVirtualPlayer(teamNumber: number): boolean {
        if (teamNumber === 1) {
            return this.firstTeam[1] > 999 ? true : false
        } else {
            return this.secondTeam[1] > 999 ? true : false
        }
    }

    setGameStartedTime(startedTime: Date) {
        this.gameStartedTime = startedTime;
    }
    getGameStartedTime(): Date {
        return this.gameStartedTime
    }

    isWinner(idPlayer: number) {
        let isWinner = true;
        for(const player of this.firstTeam){
            if(player === idPlayer) {
                isWinner = (this.scoreFirstTeam >= this.scoreSecondTeam)
            }
        }

        for(const player of this.secondTeam){
            if(player === idPlayer) {
                isWinner = (this.scoreFirstTeam <= this.scoreSecondTeam)
            }
        }
        return isWinner;
    }

    getResult(idPlayer: number): number | undefined {
        return this.playerScores.get(idPlayer)
    }
    
    getMaxGuess(): number | null {
        return null
    }

    getMaxRound(): number | null {
        return null
    }
    setVirtualPlayerIsDrawing(value: boolean) {
        this.virtualPlayerIsDrawing = value
    }
    isVirtualPlayerDrawing(): boolean {
        return this.virtualPlayerIsDrawing
    }
}