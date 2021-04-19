package com.example.client_leger.viewmodel

import android.graphics.Color
import android.graphics.PointF
import androidx.core.graphics.plus
import com.example.client_leger.UndoRedo.model.DrawCommand
import com.example.client_leger.UndoRedo.service.CommandInvoker
import com.example.client_leger.drawing.model.*
import com.example.client_leger.drawing.viewModel.DrawingCanvasVM
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.RelaxedMockK
import io.mockk.spyk
import io.mockk.verify
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

class DrawingCanvasVMTest {
    private lateinit var drawingCanvasVM: DrawingCanvasVM
    private val defaultPoint = PointF(10f, 15f)
    private val defaultColorCode = Color.BLACK
    private val defaultStrokeWidth = 4
    private val defaultOpacity = 255
    @RelaxedMockK lateinit var commandInvoker: CommandInvoker
    @RelaxedMockK lateinit var pathRepository: PathRepository
    @RelaxedMockK lateinit var drawingOptions: DrawingOptions
    @RelaxedMockK lateinit var eraserOptions: EraserOptions
    @RelaxedMockK lateinit var gridOptions: GridOptions
    private lateinit var defaultDrawingPath: DrawingPath


    @Before
    fun setUp() {
        MockKAnnotations.init(this)
        drawingCanvasVM = spyk(DrawingCanvasVM(commandInvoker, pathRepository, drawingOptions,
            eraserOptions, gridOptions))
        defaultDrawingPath = DrawingPath(defaultPoint, defaultColorCode, defaultStrokeWidth, defaultOpacity)
        every { drawingOptions.isDrawingMode } returns true
    }

    @Test
    fun testDefaultDrawingPath() {
        assertNotNull(defaultDrawingPath.path)
        assertNotNull(defaultDrawingPath.paint)
        assertEquals(defaultColorCode, defaultDrawingPath.paint.color)
        assertEquals(defaultStrokeWidth, defaultDrawingPath.paint.strokeWidth)
        assertEquals(defaultOpacity, defaultDrawingPath.paint.alpha)
        assertEquals(defaultPoint, defaultDrawingPath.initPos)
        assertEquals(defaultColorCode, defaultDrawingPath.colorCode)
        assertEquals(defaultStrokeWidth, defaultDrawingPath.strokeWidth)
        assertEquals(defaultOpacity, defaultDrawingPath.opacity)
    }

    @Test
    fun testStartDrawingPath() {
        drawingCanvasVM.startDrawingPath(defaultPoint)

        assertEquals(defaultDrawingPath, drawingCanvasVM.currentDrawingPath)
        verify { pathRepository.sendFirstPoint(defaultPoint, defaultStrokeWidth, "#000000") }
        assertEquals(true, drawingCanvasVM.drawing.value)
        assertEquals(0, drawingCanvasVM.drawingPaths.size)
    }

    @Test
    fun testUpdateDrawingPath() {
        drawingCanvasVM.startDrawingPath(defaultPoint)
        val newX = 50f
        val newY = 100f

        drawingCanvasVM.updateDrawingPath(PointF(newX, newY))

        defaultDrawingPath.path.quadTo(defaultPoint.x, defaultPoint.y, (defaultPoint.x + newX)/2, (defaultPoint.y + newY)/2)
        assertEquals(defaultDrawingPath, drawingCanvasVM.currentDrawingPath)
    }

    @Test
    fun testNegligibleUpdate() {
        drawingCanvasVM.startDrawingPath(defaultPoint)
        val newX = defaultPoint.x+3
        val newY = defaultPoint.y+3

        drawingCanvasVM.updateDrawingPath(PointF(newX, newY))

        assertEquals(defaultDrawingPath, drawingCanvasVM.currentDrawingPath)
    }

    @Test
    fun testEndDrawingPath() {
        drawingCanvasVM.startDrawingPath(defaultPoint)
        val movedPoint = defaultPoint.plus(10f)
        drawingCanvasVM.updateDrawingPath(defaultPoint)
        val finishedPoint = movedPoint.plus(20f)
        drawingCanvasVM.endDrawingPath(finishedPoint)

        assertEquals(1, drawingCanvasVM.drawingPaths.size)
        assertEquals(drawingCanvasVM.currentDrawingPath, drawingCanvasVM.drawingPaths[0])
        verify { pathRepository.sendLastPoint(0, finishedPoint) }
        verify { drawingCanvasVM.currentDrawingPath != null }
        drawingCanvasVM.currentDrawingPath?.let {
            verify { commandInvoker.addCommand(DrawCommand(drawingCanvasVM, 0, it)) }
        }
    }
}