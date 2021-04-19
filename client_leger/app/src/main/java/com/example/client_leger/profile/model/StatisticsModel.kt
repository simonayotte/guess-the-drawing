package com.example.client_leger.profile.model

import android.os.Parcelable
import kotlinx.android.parcel.Parcelize

@Parcelize
class StatisticsModel (
    val gamePlayed : Int,
    val winRate : Float,
    val averageTimePerGame: String,
    val totalTimePlayed: String,
    val bestScoreSprintSolo: Int,
    val likes: Int,
    val dislikes: Int
) : Parcelable {

}