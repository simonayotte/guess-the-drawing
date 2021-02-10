package com.example.client_leger.signin.model

import com.google.gson.annotations.SerializedName


class SignInRequestModel constructor(
        @SerializedName("pseudo") val pseudo: String,
        @SerializedName("password") val password: String
)