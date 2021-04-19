import { virtualPlayerService } from '../..';
import { AbsGameLobby, MAX_ROUND } from './AbsGameLobby';
export class GameLobbyClassic extends AbsGameLobby {

    constructor(id: number, playerIds: Array<number>, difficulty: string) {
        //TODO: check si t'as tes 4 joueurs
        //TODO: si t'as des joueurs virtuels tu dois set true dès mtn son status
        super(id, playerIds, difficulty)
        this.playersIds = playerIds
        this.initPlayerStatus()
        if (this.playersIds.length === 3) {
            this.playersIds[3] = virtualPlayerService.newPlayer(this.playersIds[0])
            this.playerStatus.set(this.playersIds[3], true)
        }
        if (this.playersIds.length === 2) {
            this.playersIds[2] = virtualPlayerService.newPlayer(this.playersIds[0])
            this.playerStatus.set(this.playersIds[2], true)
            this.playersIds[3] = virtualPlayerService.newPlayer(this.playersIds[1], virtualPlayerService.getIdPlayer(this.playersIds[2]) - 11)
            this.playerStatus.set(this.playersIds[3], true)
        }
        this.initPlayerScore()
        this.firstTeam = [this.playersIds[0], this.playersIds[2]]
        this.secondTeam = [this.playersIds[1], this.playersIds[3]]
        
        this.artist = this.playersIds[2]
    }

    

    getGamemode(): string {
        return "classic"
    }
    
    getMaxGuess(): number | null {
        return this.maxGuess + 1
    }

    getMaxRound(): number | null {
        return MAX_ROUND
    }

    getNumberOfRound(): number | null {
        return this.round
    }
}