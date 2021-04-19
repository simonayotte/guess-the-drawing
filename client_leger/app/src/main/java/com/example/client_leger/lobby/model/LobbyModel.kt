package com.example.client_leger.lobby.model

import com.google.gson.annotations.SerializedName

class LobbyModel(
    @SerializedName("id") val id: Int,
    @SerializedName("gamemode") val gameMode: GameMode,
    @SerializedName("difficulty") val difficulty: Difficulty,
    @SerializedName("players") val players: List<LobbyPlayer>
) {
    enum class GameMode(val value: String) {
        @SerializedName("Classique") CLASSIC("Classique"),
        @SerializedName("Sprint Solo") SPRINT_SOLO("Sprint Solo"),
        @SerializedName("Sprint Co-Op") SPRINT_COOP("Sprint Co-Op"),
        @SerializedName("Battle Royale") BATTLE_ROYAL("Battle Royale"),
    }

    enum class Difficulty(val value: String) {
        @SerializedName("Facile") EASY("Facile"),
        @SerializedName("Intermédiaire") MEDIUM("Intermédiaire"),
        @SerializedName("Difficile") HARD("Difficile"),
    }

    val description: String
        get() = when(gameMode) {
            GameMode.CLASSIC -> "Deux équipes de 2 joueurs s'affrontent dans une partie enflammé " +
                    "pour tenter de deviner le plus de dessins en équipe !"
            GameMode.SPRINT_SOLO -> "Dans un laps de temps prédéterminé, un joueur humain tente de " +
                    "deviner un maximum de mots ou expressions à partir de dessins réalisés par " +
                    "un joueur virtuel."
            GameMode.SPRINT_COOP -> "Dans un laps de temps prédéterminé, une équipe de joueurs " +
                    "humains collabore pour tenter de deviner un maximum de mots ou expression à " +
                    "partir de dessins réalisés par un joueur virtuel."
            GameMode.BATTLE_ROYAL -> "Chaque joueur affronte 3 autres joueurs humains pour tenter " +
                    "de deviner le plus rapidement le dessin à l'écran. Si il ne réussit pas, " +
                    "il sera éliminé de la partie. Le dernier survivant sera victorieux !"
        }

    val maxPlayers: Int
        get() = when(gameMode) {
            GameMode.CLASSIC -> 4
            GameMode.SPRINT_SOLO -> 1
            GameMode.SPRINT_COOP -> 3
            GameMode.BATTLE_ROYAL -> 3
        }

    val minPlayers: Int
        get() = when(gameMode) {
            GameMode.CLASSIC -> 2
            GameMode.SPRINT_SOLO -> 1
            GameMode.SPRINT_COOP -> 2
            GameMode.BATTLE_ROYAL -> 2
        }
}