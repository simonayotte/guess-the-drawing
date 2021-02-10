package com.example.client_leger.loginModel

import com.google.gson.annotations.SerializedName

class SignInResponseModel constructor(
        @SerializedName("login") val loginIsSuccessFull: Boolean
)