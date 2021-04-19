package com.example.client_leger.drawing.model

import android.graphics.*

data class ErasingPath(val initPos: PointF, val radius: Int) {

    val paint: Paint = Paint()
    init {
        paint.color = Color.GRAY
        paint.style = Paint.Style.STROKE
    }

    var path: Path = Path()
    var lastPos: PointF = initPos
    init {
        path.moveTo(initPos.x, initPos.y)
    }

    private val pointsDistancePx = 4
    fun getPrecisePoints(newPos: PointF): MutableList<PointF> {
        if(newPos == lastPos){
            return mutableListOf(newPos)
        }

        val precisePoints = mutableListOf<PointF>()
        path.reset()
        path.moveTo(lastPos.x, lastPos.y)
        path.lineTo(newPos.x, newPos.y)
        val pathMeasure = PathMeasure(path, false)
        val pathLength = pathMeasure.length.toInt()
        val positions = FloatArray(2)
        for(distanceFromEnd in pathLength downTo 0 step pointsDistancePx) {
            if(pathMeasure.getPosTan(distanceFromEnd.toFloat(), positions, null))
                precisePoints.add(PointF(positions[0], positions[1]))
        }
        lastPos.set(newPos)
        return precisePoints
    }
}
