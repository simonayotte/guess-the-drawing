package com.example.client_leger.signin.model

import com.google.gson.annotations.SerializedName

class SignInResponseModel constructor(
        @SerializedName("idplayer") val playerid: Int,
        @SerializedName("message") val message: String
)