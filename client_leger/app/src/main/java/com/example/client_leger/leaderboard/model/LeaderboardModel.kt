package com.example.client_leger.leaderboard.model

import android.os.Parcelable
import kotlinx.android.parcel.Parcelize

@Parcelize
class LeaderboardModel(
        val username: String,
        val position: Int,
        val victories: Int,
        val totalPoints: Int,
        val classicVictories: Int,
        val brVictories: Int,
        val bestScoreSprintSolo: Int,
        val bestScoreCoop: Int,
        val gamesPlayed: Int,
        val likes: Int,
        val dislikes: Int
): Parcelable {
}