package com.example.client_leger.signup.model

import com.google.gson.annotations.SerializedName

class SignUpResponseModel constructor(
    @SerializedName("idplayer") val idplayer: Int,
    @SerializedName("message") val message: String
)