package com.example.client_leger.model

import android.graphics.Color
import android.graphics.Paint
import android.graphics.Path

data class DrawingPath(val posX: Float, val posY: Float) {
    // will eventually replace those with parameter
    private val colorCode: Int = Color.BLACK
    private val strokeWidth: Float = 7f
    private val opacity: Float = 1f

    var paint: Paint = Paint()
    init {
        paint.color = colorCode
        paint.strokeWidth = strokeWidth
        paint.alpha = (opacity * 255).toInt()
        paint.isAntiAlias = true
        paint.strokeJoin = Paint.Join.ROUND
        paint.style = Paint.Style.STROKE
    }

    var path: Path = Path()
    var lastPosX: Float = posX
    var lastPosY: Float = posY
    init {
        path.moveTo(lastPosX, lastPosY)
    }
}