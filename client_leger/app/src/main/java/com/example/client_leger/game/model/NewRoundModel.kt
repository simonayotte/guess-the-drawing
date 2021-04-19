package com.example.client_leger.game.model

import com.google.gson.annotations.SerializedName

class NewRoundModel (
    @SerializedName("artist") val artistId: Int,
    @SerializedName("word") val word: String
)
