package com.example.client_leger.drawing.model

import com.google.gson.annotations.SerializedName

data class FirstPointModel(
        @SerializedName("point") val point: FloatArray,
        @SerializedName("room") val room: Int,
        @SerializedName("color")val color: String,
        @SerializedName("thickness") val thickness: Int
)