package com.example.client_leger.channel.model

import com.google.gson.annotations.SerializedName

class ChannelLeaveResponseModel constructor(
        @SerializedName("message") val message: String,
        @SerializedName("isChannelDeleted") val isChannelDeleted: Boolean
)