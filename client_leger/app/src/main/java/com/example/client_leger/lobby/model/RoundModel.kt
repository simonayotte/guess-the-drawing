package com.example.client_leger.lobby.model

import com.example.client_leger.game.model.PlayerInfo

class RoundModel (
    val roundNb: Int,
    val word: String,
    val artistId: Int,
    //var players: List<PlayerInfo>,
    var rightOfReply: Boolean,
    var currentRole: PlayerInfo.RoleType
)