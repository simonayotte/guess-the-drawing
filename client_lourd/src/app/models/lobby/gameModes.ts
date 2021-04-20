// Fichier d'utilite pour lie le gameModeID au gameModeName
export const gameModes = [
    "Sprint Solo", // ID : 0
    "Sprint Co-Op", // ID : 1
    "Classique", // ID : 2
    "Battle Royale" // ID : 3
];

export const gameModesDescription = [
    "Dans un laps de temps prédéterminé, un joueur humain tente de deviner un maximum de mots ou expression à partir de dessins réalisés par un joueur virtuel.",
    "Dans un laps de temps prédéterminé, une équipe de joueurs humains collabore pour tenter de deviner un maximum de mots ou expression à partir de dessins réalisés par un joueur virtuel.",
    "Deux équipes de 2 joueurs s'affrontent dans une partie enflammé pour tenter de deviner le plus de dessins en équipe !",
    "Chaque joueur affronte 3 autres joueurs humains pour tenter de deviner le plus rapidement le dessin à l'écran. Si il ne réussit pas, il sera éliminé de la partie. Le dernier survivant sera victorieux !", 
];

export function getDescription(gamemode : string) : string {
    if (gamemode == gameModes[0])
        return gameModesDescription[0]
    else if (gamemode == gameModes[1])
        return gameModesDescription[1]
    else if (gamemode == gameModes[2])
          return gameModesDescription[2]
    else if (gamemode == gameModes[3])
        return gameModesDescription[3]
    return gameModesDescription[0]
}

export function getMaxPlayers(gamemode : string) : number {
    if (gamemode == gameModes[0])
        return 1
    else if (gamemode == gameModes[1])
        return 3
    else if (gamemode == gameModes[2])
          return 4
    else if (gamemode == gameModes[3])
        return 3
    return 4
}