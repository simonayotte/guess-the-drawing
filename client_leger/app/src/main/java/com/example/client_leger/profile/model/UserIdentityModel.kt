package com.example.client_leger.profile.model

import android.os.Parcelable
import kotlinx.android.parcel.Parcelize

@Parcelize
class UserIdentityModel(
        val firstName: String,
        val lastName: String,
        val email: String,
        val avatar: String
): Parcelable {

}
