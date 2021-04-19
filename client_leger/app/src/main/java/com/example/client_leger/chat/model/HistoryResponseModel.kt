package com.example.client_leger.chat.model

import com.google.gson.annotations.SerializedName

class HistoryResponseModel constructor(
        @SerializedName("history") val history: ArrayList<MessageModel>
)