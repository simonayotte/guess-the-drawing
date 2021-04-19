package com.example.client_leger.lobby.model

import com.example.client_leger.leaderboard.model.LeaderboardModel
import com.google.gson.annotations.SerializedName

class LeaderboardStatsResponse constructor(
        @SerializedName("stats") val stats: ArrayList<LeaderboardModelString>
)