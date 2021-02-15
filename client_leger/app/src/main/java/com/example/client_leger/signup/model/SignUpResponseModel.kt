package com.example.client_leger.signup.model

import com.google.gson.annotations.SerializedName

class SignUpResponseModel constructor(
    @SerializedName("signin") val signInIsSuccessFull: Boolean
)