package com.example.client_leger.lobby.model

import com.google.gson.annotations.SerializedName

class LobbyPlayer(
    @SerializedName("id") val playerId: Int,
    @SerializedName("name") val username: String,
    @SerializedName("avatar") val avatar: String
)