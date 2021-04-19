package com.example.client_leger.channel_join.model

import com.google.gson.annotations.SerializedName

class GetAllChannelResponseModel constructor(
        @SerializedName("appChannels") val appChannels: ArrayList<String>
)