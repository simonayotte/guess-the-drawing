package com.example.client_leger.viewmodel

import com.example.client_leger.model.DrawingPath
import org.junit.Assert.*
import org.junit.Test

class DrawingCanvasVMTest {
    private var drawingCanvasVM = DrawingCanvasVM()
    private val defaultX = 10f
    private val defaultY = 15f

    @Test
    fun testDefaultDrawingPath() {
        val drawingPath = DrawingPath(defaultX, defaultY)

        assertNotNull(drawingPath.path)
        assertNotNull(drawingPath.paint)
        assertEquals(drawingPath.lastPosX, defaultX)
        assertEquals(drawingPath.lastPosX, defaultX)
        assertEquals(drawingPath.lastPosY, defaultY)
    }

    @Test
    fun testStartDrawingPath() {
        drawingCanvasVM.startDrawingPath(defaultX, defaultY)

        val expectedPath = DrawingPath(defaultX, defaultY)
        assertEquals(expectedPath, drawingCanvasVM.currentDrawingPath)
        assertEquals(1, drawingCanvasVM.drawingPaths.size)
        assertEquals(expectedPath, drawingCanvasVM.drawingPaths[0])
    }

    @Test
    fun testUpdateDrawingPath() {
        drawingCanvasVM.startDrawingPath(defaultX, defaultY)
        val newX = 50f
        val newY = 100f
        val expectedPath = DrawingPath(defaultX, defaultY)
        assertEquals(expectedPath, drawingCanvasVM.currentDrawingPath)

        drawingCanvasVM.updateDrawingPath(newX, newY)

        expectedPath.path.quadTo(defaultX, defaultY, (defaultX + newX)/2, (defaultY + newY)/2)
        expectedPath.lastPosX = newX
        expectedPath.lastPosY = newX
        assertEquals(expectedPath, drawingCanvasVM.currentDrawingPath)
    }

    @Test
    fun testNegligibleUpdate() {
        drawingCanvasVM.startDrawingPath(defaultX, defaultY)
        val newX = defaultX+3
        val newY = defaultY+3
        val expectedPath = DrawingPath(defaultX, defaultY)
        assertEquals(expectedPath, drawingCanvasVM.currentDrawingPath)

        drawingCanvasVM.updateDrawingPath(newX, newY)

        assertEquals(expectedPath, drawingCanvasVM.currentDrawingPath)
    }

    @Test
    fun testEndDrawingPath() {
        drawingCanvasVM.startDrawingPath(defaultX, defaultY)
        drawingCanvasVM.updateDrawingPath(defaultX+10, defaultY+10)

        drawingCanvasVM.endDrawingPath()

        assertEquals(null, drawingCanvasVM.currentDrawingPath)
        assertEquals(1, drawingCanvasVM.drawingPaths.size)
    }
}