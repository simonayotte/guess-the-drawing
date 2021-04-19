import { virtualPlayerService } from '../..';
import { AbsGameLobby, LobbyState } from './AbsGameLobby';
import { GivePointsModel } from './giverPointsModel';
export class GameLobbyCoop extends AbsGameLobby {

    constructor(id: number, playerIds: Array<number>, difficulty: string) {
        super(id, playerIds, difficulty)
        this.playersIds[0] = virtualPlayerService.newPlayer(playerIds[0])
        this.playerStatus.set(this.playersIds[0], true)
        this.firstTeam = [this.playersIds[0]]
        this.secondTeam = []
        for (const player of playerIds) {
            this.playersIds.push(player)
            this.playerStatus.set(player, false)
            this.firstTeam.push(player)
        }
        this.initPlayerScore()
        this.artist = this.playersIds[0]
        this.round = 4
    }

    getVirtualPlayers(): number[] {
        const virtualPlayers = []
        virtualPlayers.push(this.playersIds[0])
        return virtualPlayers
    }

    getGamemode(): string {
        return "coop"
    }

    newWrongGuess(): void {
        this.activeGuess += 1
        if(this.activeGuess > this.maxGuess) {
            this.state = LobbyState.failedRightOfReply
        }
    }

    async nextRound(): Promise<void> {
        this.state = LobbyState.guessing
        this.activeGuess = 0
        this.round = this.time === 0 ? 5 : 4
        this.hintNumber = 0
        await this.genWord()
    }

    givePoints(): GivePointsModel {
        this.playerScores.set(this.getArtistPureId(), (this.playerScores.get(this.getArtistPureId()) || 0) + 4 - this.hintNumber)
        for (const playerId of this.playersIds) {
            if (playerId < 1000) {  
                this.playerScores.set(playerId, (this.playerScores.get(playerId) || 0) + 4 - this.hintNumber)
            } 
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

    getMaxGuess(): number | null {
        return this.maxGuess + 1
    }

    getNumberOfRound(): number | null {
        return this.round
    }
}