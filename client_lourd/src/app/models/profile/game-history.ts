export interface UserGameHistory {
    gameModeId: number, 
    gameDate: Date,
    gameResult: number, // A revoir le type dependement du mode de jeu 
    players: Array<string>,// Contient les username des joueurs
    iswinner: boolean
}