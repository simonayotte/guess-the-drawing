package com.example.client_leger.signin.model

import com.google.gson.annotations.SerializedName

class SignInResponseModel constructor(
        @SerializedName("login") val loginIsSuccessFull: Boolean
)