package com.example.client_leger.drawing.model

import com.google.gson.annotations.SerializedName

class MiddlePointModel (
    @SerializedName("point") val point: FloatArray,
    @SerializedName("room") val room: Int
)