package com.example.client_leger.channel.model

import com.google.gson.annotations.SerializedName

class ChannelResponseModel constructor(
        @SerializedName("message") val message: String
)