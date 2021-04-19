import { virtualPlayerService } from '../..';
import { UserInfo } from '../lobby/userInfo';
import { AbsGameLobby, LobbyState } from './AbsGameLobby';
import { BattleRoyalLivesModel } from './battleRoyaleLivesModel';
import { GivePointsModel } from './giverPointsModel';
import { PlayerInfo, RoleType } from './playerinfo';

export const MAX_LIVES = 3

export class GameLobbyBattleRoyal extends AbsGameLobby {

    maxLives: number
    playerLives: Map<number, number>
    playerWordGuessed: Map<number, boolean>
    playersAlive: number

    constructor(id: number, playerIds: Array<number>, difficulty: string) {
        super(id, playerIds, difficulty)
        this.maxLives = 5
        switch(difficulty) {
            case "Intermédiaire": {
                this.maxLives = 3
                break
            }
            case "Difficile": {
                this.maxLives = 1
            }
        }
        this.playerLives = new Map()
        this.playerWordGuessed = new Map()
        this.playersIds[0] = virtualPlayerService.newPlayer(playerIds[0])
        this.playerStatus.set(this.playersIds[0], true) 
        this.firstTeam = [this.playersIds[0]]
        this.secondTeam = []
        this.playersAlive = 0
        for (const player of playerIds) {
            this.playersIds.push(player)
            this.playerStatus.set(player, false)
            this.firstTeam.push(player)
            this.playersAlive++ 
        }
        this.playersAlive--
        this.initPlayers()
        this.initPlayerScore()
        this.artist = this.playersIds[0] 
        this.time = 60000
    }

    private initPlayers() {
        for(const id of this.playersIds) {
            this.playerLives.set(id, this.maxLives )
            this.playerWordGuessed.set(id, false)
            if (id < 999) {
                this.playerScores.set(id, 0)
            }
        }
    }

    private resetGuesses() {
        for(const player of this.playerWordGuessed) {
            this.playerWordGuessed.set(player[0], false)
        }
    }

    getPlayerInfo(users: UserInfo[]): PlayerInfo[] {
        let players: PlayerInfo[] = []
        for (const user of users) {
            let player: PlayerInfo = {
                id : user.id,
                name: user.name,
                avatar: user.avatar,
                team: this.getUserTeamNumber(user.id),
                score: this.playerScores.get(user.id),
                role: this.getRole(user.id)
            }
            players.push(player)
        }
        const virtualPlayer: PlayerInfo = {
            id : this.getArtistPureId(),
            name: virtualPlayerService.getName(this.artist),
            avatar: virtualPlayerService.getAvatar(this.artist).toString(),
            team: 1,
            score: this.playerScores.get(this.getArtistPureId()),
            role: RoleType.Drawing
        } 
        players.push(virtualPlayer)
        return players
    }

    private getRole(userId: number): RoleType {
        const team = this.getUserTeamNumber(userId)
        if (team === 1) {
            return RoleType.Guessing
        }
        else {
            return RoleType.Watching
        }
    }
    

    correctGuess(idPlayer: number): void {
        this.playerWordGuessed.set(idPlayer, true)
        let correctGuessCount = 0
        let wrongPlayer = 0
        for (const player of this.playerWordGuessed) {
            if (player[1]) {
                correctGuessCount++
            } else {
                wrongPlayer = player[0]
            }
        }
        
        this.playerScores.set(idPlayer, (this.playerScores.get(idPlayer) || 0) + 3 - correctGuessCount)
        if (this.playersAlive === 0) {
            this.round = 5
        }
        if (correctGuessCount === this.playersAlive) {
            let playerLives = this.playerLives.get(wrongPlayer)
            if (playerLives === 1) {
                this.playerWordGuessed.delete(wrongPlayer)
                this.playersAlive--
                this.firstTeam.splice(this.firstTeam.indexOf(wrongPlayer), 1)
                this.secondTeam.push(wrongPlayer)
                playerLives--
                this.playerLives.set(wrongPlayer, playerLives)
            } else if(playerLives !== undefined) {
                playerLives--
                this.playerLives.set(wrongPlayer, playerLives)
            }
            this.state = LobbyState.foundRightWord 
        }
    }

    newWrongGuess(): void {
        // to implement
    }

    getGamemode(): string {
        return "battleRoyal"
    }

    getVirtualPlayers(): number[] {
        const virtualPlayers = []
        virtualPlayers.push(this.playersIds[0])
        return virtualPlayers
    } 

    getMaxLives() {
        return this.maxLives
    }

    givePoints(): GivePointsModel {
        this.playerScores.set(this.getArtistPureId(), (this.playerScores.get(this.getArtistPureId()) || 0) + 1)
        const players: number[] = []
        const scores: number[] = []
        for (const player of this.playerScores) {
            if (player[0] < 1000) {
                players.push(player[0])
                scores.push(player[1])
            }
        }
        const model: GivePointsModel = {
            players: players,
            scores: scores
        }
        return model
    }

    async nextRound(): Promise<void> {
        if (this.playersAlive === 0) {
            this.round = 5
            this.state = LobbyState.gameHasEnded
        } 
        else {
            this.state = LobbyState.guessing
        }
        
        this.resetGuesses()
        this.hintNumber = 0
        await this.genWord()
    }

    isWinner(idPlayer: number) : boolean {
        return idPlayer === this.firstTeam[1];
    }

    getPlayerLives(){
        let players: number[] = []
        let lives: number[] = []
        for (let player of this.playerLives) {
            players.push(player[0])
            lives.push(player[1])
        }
        const model: BattleRoyalLivesModel = {
            players: players,
            lives: lives
        }
        return model
    }
    getNumberOfRound(): number | null {
        return this.round
    }
}