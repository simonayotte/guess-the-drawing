package com.example.client_leger.drawing.model

import android.graphics.*
import kotlin.math.abs

data class DrawingPath(val initPos: PointF, val colorCode: Int, val strokeWidth: Int ,val opacity: Int) {

    // style
    val paint: Paint = Paint()
    init {
        paint.color = colorCode
        paint.strokeWidth = strokeWidth.toFloat()
        paint.alpha = opacity
        paint.isAntiAlias = true
        paint.strokeJoin = Paint.Join.ROUND
        paint.style = Paint.Style.STROKE
        paint.strokeCap = Paint.Cap.ROUND
    }

    // vector path
    val path: Path = Path()
    private val lastPos: PointF = initPos
    private val rawPoints: MutableList<PointF> = mutableListOf(initPos)
    private val precisePoints: MutableList<PointF> = mutableListOf()
    private val pointsDistancePx = 4
    init {
        path.moveTo(initPos.x, initPos.y)
        path.lineTo(initPos.x, initPos.y)
    }

    fun addPoint(newPos: PointF) {
        // the raw points are saved here but they are not always precise
        // we also more calculate precise points in finish(), for erasing for example
        rawPoints.add(newPos)

        // using interpolation to make the transition between vertices look smoother
        path.quadTo(lastPos.x, lastPos.y, (newPos.x + lastPos.x)/2, (newPos.y + lastPos.y)/2)
        lastPos.set(newPos)
    }

    // adding a point at each 'pointsDistance' pixels
    fun finish(finalPoint: PointF) {
        // path.setLastPoint(finalPoint.x, finalPoint.y)
        val pathMeasure = PathMeasure(path, false)
        val pathLength = pathMeasure.length.toInt()
        val positions = FloatArray(2)
        for(distanceFromEnd in pathLength downTo 0 step pointsDistancePx) {
            if(pathMeasure.getPosTan(distanceFromEnd.toFloat(), positions, null))
                precisePoints.add(PointF(positions[0], positions[1]))
        }
        precisePoints.add(initPos)
    }

    // more precise using point interpolation
    fun contains(otherPoints: MutableList<PointF>, range: Float): Boolean {
        return precisePoints.any { point ->
            otherPoints.any { otherPoint ->
                abs(point.x - otherPoint.x) <= range && abs(point.y - otherPoint.y) <= range
            }
        }
    }
}