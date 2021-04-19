package com.example.client_leger.game.model

import com.google.gson.annotations.SerializedName

data class PlayerInfo (
    @SerializedName("id") val id: Int,
    @SerializedName("name") val name: String,
    @SerializedName("avatar") val avatar: String,
    @SerializedName("team") val team: Int,
){
    var score: Int = 0
    var role: RoleType = RoleType.WATCHING

    enum class RoleType(val value: String) {
        DRAWING("Dessine"),
        GUESSING("Devine"),
        WATCHING("")
    }
}