package com.example.client_leger.drawing.model

import com.google.gson.annotations.SerializedName

class PathToEraseModel (
    @SerializedName("pathId") val pathId: IntArray,
    @SerializedName("room") val room: Int
)