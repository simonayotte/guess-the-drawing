package com.example.client_leger.drawing.viewModel

import android.graphics.Color
import android.graphics.PointF
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModel
import com.example.client_leger.UndoRedo.model.DrawCommand
import com.example.client_leger.UndoRedo.model.EraseCommand
import com.example.client_leger.UndoRedo.service.CommandInvoker
import com.example.client_leger.drawing.model.*
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlin.math.abs
import kotlin.math.roundToInt


@HiltViewModel
class DrawingCanvasVM @Inject constructor(
        private val commandInvoker: CommandInvoker,
        private val pathRepository: PathRepository,
        val drawingOptions: DrawingOptions,
        val eraserOptions: EraserOptions,
        val gridOptions: GridOptions
) : ViewModel() {
    private var pathIdCounter: Int = 0
    var drawingPaths = hashMapOf<Int, DrawingPath>()
    var currentDrawingPath : DrawingPath? = null
        private set

    var currentErasingPath : ErasingPath? = null
        private set

    var otherClientPath: DrawingPath? = null
        private set

    var updateOtherClientPath: MutableLiveData<Boolean> = MutableLiveData()
    var refreshCanvas: MutableLiveData<Boolean> = MutableLiveData()
    val drawing: MutableLiveData<Boolean> = MutableLiveData(false)

    // minimum distance (in pixels) to draw on new point on the path
    private val minMoveDistance = 4
    private var lastMovePos: PointF = PointF()
    init {
        pathRepository.firstPoint.observeForever( Observer {
            val androidColor = rgbaToAndroidFormat(it.color)
            otherClientPath = DrawingPath(PointF(it.point[0], it.point[1]), androidColor.first, it.thickness, androidColor.second)
            updateOtherClientPath.value = false
        })
        pathRepository.middlePoint.observeForever { middlePoint ->
            otherClientPath?.addPoint(PointF(middlePoint.point[0], middlePoint.point[1]))
            updateOtherClientPath.value = false
        }
        pathRepository.lastPoint.observeForever { lastPoint ->
            otherClientPath?.let {
                it.finish(PointF(lastPoint.point[0], lastPoint.point[1]))
                updateOtherClientPath.value = true
                drawingPaths[lastPoint.pathId] = it
                commandInvoker.addCommand(DrawCommand(this, lastPoint.pathId, it))
            }
            otherClientPath = null
        }
        pathRepository.pathToErase.observeForever { pathToErase ->
            val eraseCmd = EraseCommand(this)
            for(id in pathToErase.pathId) {
                if (drawingPaths.containsKey(id)) {
                    val drawingPath = drawingPaths[id]
                    if(drawingPath != null) {
                        eraseCmd.addPath(id, drawingPath)
                    }
                    drawingPaths.remove(id)
                }
            }
            commandInvoker.addCommand(eraseCmd)
            refreshCanvas.value = true
        }
    }

    fun startDrawingPath(pos: PointF) {
        if(drawingOptions.isDrawingMode) {
            val hexColor = String.format("#%06X", 0xFFFFFF and drawingOptions.color)
            val rgbaColor = hexToRgbaFormat(hexColor, drawingOptions.opacity.toString())
            currentDrawingPath = DrawingPath(pos, drawingOptions.color, drawingOptions.strokeWidth, drawingOptions.opacity)
            pathRepository.sendFirstPoint(pos, drawingOptions.strokeWidth, rgbaColor)
            drawing.value = true
        } else if(drawingOptions.isErasingMode) {
            currentErasingPath = ErasingPath(pos, eraserOptions.strokeWidth)
        }
        lastMovePos.set(pos)
    }

    /**
     * Returns true if the current path was updated
     */
    fun updateDrawingPath(pos: PointF): Boolean {
        if (abs(pos.x - lastMovePos.x) < minMoveDistance && abs(pos.y - lastMovePos.y) < minMoveDistance)
            return false // not updating when moved less than minMoveDistance pixels
        lastMovePos.set(pos)

        if(drawing.value == true) {
            currentDrawingPath?.let {
                it.addPoint(pos)
                pathRepository.sendMiddlePoint(pos)
                return true
            }
        } else {
            return erase(pos)
        }
        return false
    }

    fun endDrawingPath(pos: PointF): Boolean {
        if (drawing.value == true){
            currentDrawingPath?.let {
                it.finish(pos)
                val pathId = pathIdCounter++
                pathRepository.sendLastPoint(pathId, pos)
                drawingPaths[pathId] = it
                commandInvoker.addCommand(DrawCommand(this, pathId, it))
            }
        } else {
            return eraseLast(pos)
        }
        return false
    }

    fun resetDrawingPath() {
        drawing.value = false
        currentDrawingPath = null
        currentErasingPath = null
    }

    fun resetAll() {
        pathIdCounter = 0;
        drawingPaths = hashMapOf<Int, DrawingPath>()
        drawing.value = false
        currentDrawingPath = null
        currentErasingPath = null
        otherClientPath = null
        refreshCanvas.value = true
    }

    private fun erase(pos: PointF): Boolean {
        currentErasingPath?.let { eraser ->
            val erasingPoints = eraser.getPrecisePoints(pos)
            drawingPaths.keys.forEach {
                val path = drawingPaths[it]
                if(path?.contains(erasingPoints, path.paint.strokeWidth / 2 + eraser.radius) == true) {
                    drawingPaths.remove(it)
                    pathRepository.sendPathToErase(intArrayOf(it))
                    commandInvoker.addCommand(EraseCommand(this, mutableMapOf(Pair(it,path))))
                    return true
                }
            }
        }
        return false
    }


    private fun eraseLast(pos: PointF): Boolean {
        currentErasingPath?.let { eraser ->
            val erasingPoints = eraser.getPrecisePoints(pos)
            val foundPair = drawingPaths.entries.findLast {
                it.value.contains(erasingPoints, it.value.paint.strokeWidth / 2 + eraser.radius)
            }
            return if(foundPair != null){
                drawingPaths.remove(foundPair.key)
                pathRepository.sendPathToErase(intArrayOf(foundPair.key))
                commandInvoker.addCommand(EraseCommand(this, mutableMapOf(foundPair.toPair())))
                true
            }else{
                false
            }
        }
        return false
    }

    private fun hexToRgbaFormat(hexColor: String, alpha: String): String {
        val initColor = Color.parseColor(hexColor)
        val r = Color.red(initColor)
        val g = Color.green(initColor)
        val b = Color.blue(initColor)
        val a = alpha.toInt() / 255.0
        return "rgba($r, $g, $b, $a)";
    }

    private fun rgbaToAndroidFormat(rgbaString: String): Pair<Int, Int> {
        val values = rgbaString.split(',').map { it.replace("[^\\d.]".toRegex(), "") }
        val r = values[0].toInt()
        val g = values[1].toInt()
        val b = values[2].toInt()
        val a = values[3].toFloat() * 255
        val androidColor = Color.rgb(r,g,b)
        return Pair(androidColor, a.roundToInt())
    }
}