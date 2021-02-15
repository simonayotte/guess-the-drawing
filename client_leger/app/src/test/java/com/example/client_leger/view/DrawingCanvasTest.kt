package com.example.client_leger.view

import android.content.Context
import android.view.InputDevice
import android.view.MotionEvent
import com.example.client_leger.drawing.view.DrawingCanvas
import com.example.client_leger.drawing.viewmodel.DrawingCanvasVM
import io.mockk.*
import io.mockk.impl.annotations.MockK
import io.mockk.impl.annotations.RelaxedMockK
import org.junit.Before
import org.junit.Test

class DrawingCanvasTest {
    lateinit var drawingCanvas: DrawingCanvas
    @MockK lateinit var context: Context
    @RelaxedMockK lateinit var viewModel: DrawingCanvasVM
    @RelaxedMockK lateinit var defaultMotion: MotionEvent
    private val defaultX = 10f
    private val defaultY = 15f

    @Before
    fun setUp() {
        MockKAnnotations.init(this)
        drawingCanvas = spyk(DrawingCanvas(context, null))
        drawingCanvas.viewModel = viewModel
        every { defaultMotion.x } returns defaultX
        every { defaultMotion.y } returns defaultY
        every { defaultMotion.source } returns InputDevice.SOURCE_TOUCHSCREEN
        every { viewModel.updateDrawingPath(any(), any()) } returns true
    }

    @Test
    fun testTouchStart() {
        every { defaultMotion.action } returns MotionEvent.ACTION_DOWN

        drawingCanvas.onTouchEvent(defaultMotion)

        verify { viewModel.startDrawingPath(defaultX, defaultY) }
    }

    @Test
    fun testTouchMove() {
        every { defaultMotion.action } returns MotionEvent.ACTION_MOVE

        drawingCanvas.onTouchEvent(defaultMotion)

        verify { viewModel.updateDrawingPath(defaultX, defaultY) }
        verify { drawingCanvas.invalidate() }
    }

    @Test
    fun testTouchEnd() {
        every { defaultMotion.action } returns MotionEvent.ACTION_UP
        every { viewModel.updateDrawingPath(any(), any()) } returns true
        every { viewModel.currentDrawingPath } returns null

        drawingCanvas.onTouchEvent(defaultMotion)

        verify { viewModel.endDrawingPath() }
        verify { drawingCanvas.invalidate() }
    }
}