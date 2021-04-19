package com.example.client_leger.profile.model

import android.os.Parcelable
import kotlinx.android.parcel.Parcelize

@Parcelize
class GameHistoryModel(
        val gameModeId: Int,
        val gameDate: String,
        val gameResult: Int,
        val players: ArrayList<String>,
        val iswinner: Boolean
): Parcelable {

}