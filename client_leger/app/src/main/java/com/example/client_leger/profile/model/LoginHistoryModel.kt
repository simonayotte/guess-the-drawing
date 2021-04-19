package com.example.client_leger.profile.model

import android.os.Parcelable
import kotlinx.android.parcel.Parcelize

@Parcelize
class LoginHistoryModel(
        val isLogin: Boolean,
        val loginDate: String
): Parcelable {
}