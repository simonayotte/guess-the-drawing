package com.example.client_leger.game.model

import com.google.gson.annotations.SerializedName

class GivePointsModel (
    @SerializedName("players") val players: Array<Int>,
    @SerializedName("scores") val scores: Array<Int>,
)