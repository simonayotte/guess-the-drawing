package com.example.client_leger.signup.model

import com.google.gson.annotations.SerializedName

class SignUpRequestModel (
        @SerializedName("username") val username: String,
        @SerializedName("email") val email: String,
        @SerializedName("password") val password: String,
        @SerializedName("firstName") val firstName: String,
        @SerializedName("lastName") val lastName: String,
)
