package com.example.client_leger.viewmodel

import androidx.lifecycle.ViewModel
import com.example.client_leger.model.DrawingPath
import javax.inject.Inject
import kotlin.math.abs

class DrawingCanvasVM @Inject constructor() : ViewModel() {
    var drawingPaths : MutableList<DrawingPath> = mutableListOf()
        private set

    var currentDrawingPath : DrawingPath? = null
        private set

    // minimum distance (in pixels) to draw on new point on the path
    private val minVerticesDistance = 4

    fun startDrawingPath(posX: Float, posY: Float) {
        currentDrawingPath = DrawingPath(posX, posY)
        currentDrawingPath?.let {
            drawingPaths.add(it)
        }
    }

    /**
     * Returns true if the current path was updated
     */
    fun updateDrawingPath(posX: Float, posY: Float): Boolean {
        currentDrawingPath?.let {
            val dx = abs(posX - it.lastPosX)
            val dy = abs(posX - it.lastPosY)
            if (dx >= minVerticesDistance || dy >= minVerticesDistance) {
                // using interpolation to make the transition between vertices look smoother
                it.path.quadTo(it.lastPosX, it.lastPosY, (posX + it.lastPosX)/2, (posY + it.lastPosY)/2)
                it.lastPosX = posX
                it.lastPosY = posY
                return true
            }
        }
        return false
    }

    fun endDrawingPath() {
        currentDrawingPath = null
    }
}