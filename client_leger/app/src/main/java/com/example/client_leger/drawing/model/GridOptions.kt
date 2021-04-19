package com.example.client_leger.drawing.model

import android.graphics.Color
import android.graphics.Paint
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class GridOptions  @Inject constructor() {
    var visible = false
    var step = 100
    val paint = Paint()
    init {
        paint.color = Color.BLACK
        paint.alpha = 255
    }
}