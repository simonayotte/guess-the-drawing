package com.example.client_leger.game.model

import com.google.gson.annotations.SerializedName

class RoundInfo (
        @SerializedName("roundRemaining") val roundRemaining: Int?,
        @SerializedName("guessRemaining") val guessRemaining: Int?,
        @SerializedName("lifeRemaining") val lifeRemaining: BattleRoyalLivesModel?,
        @SerializedName("maxGuess") val maxGuess: Int?,
        @SerializedName("maxRound") val maxRound: Int?,
        @SerializedName("maxLife") val maxLife: Int?
)

class BattleRoyalLivesModel (
        @SerializedName("players") val players: Array<Int>,
        @SerializedName("lives") val lives: Array<Int>,
)