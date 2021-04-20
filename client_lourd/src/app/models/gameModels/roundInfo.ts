export interface BattleRoyalLivesModel {
    players: number[],
    lives: number[],
}
export interface RoundInfo {
    roundRemaining: number | null,
    guessRemaining: number | null,
    lifeRemaining: BattleRoyalLivesModel | null,
    maxGuess: number | null,
    maxRound: number | null,
    maxLife: number | null
}