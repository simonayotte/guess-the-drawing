package com.example.client_leger.signin.model

import com.google.gson.annotations.SerializedName

class SignInResponseModel constructor(
        @SerializedName("idplayer") val playerid: Int,
        @SerializedName("message") val message: String,
        @SerializedName("avatar") val avatar: String,
        @SerializedName("userChannels") val userChannels: ArrayList<String>,
        @SerializedName("appChannels") val appChannels: ArrayList<String>
)