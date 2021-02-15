package com.example.client_leger.signin.model

import com.google.gson.annotations.SerializedName


class SignInRequestModel constructor(
        @SerializedName("username") val pseudo: String,
        @SerializedName("password") val password: String
)