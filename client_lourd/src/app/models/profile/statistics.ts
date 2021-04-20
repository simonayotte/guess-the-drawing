// Interface pour les statistiques de l'utilisateur pour la fonctionnalite de profile
export interface UserStatistics {
    gamePlayed: number;
    winRate: number;
    averageTimePerGame: string;
    totalTimePlayed: string;
    bestScoreSprintSolo: number;
    likes: number;
    dislikes: number;
}