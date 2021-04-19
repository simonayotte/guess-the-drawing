package com.example.client_leger.view

import android.content.Context
import android.graphics.PointF
import android.view.InputDevice
import android.view.MotionEvent
import com.example.client_leger.drawing.view.DrawingCanvasView
import com.example.client_leger.drawing.viewModel.DrawingCanvasVM
import io.mockk.*
import io.mockk.impl.annotations.MockK
import io.mockk.impl.annotations.RelaxedMockK
import org.junit.Before
import org.junit.Test

class DrawingCanvasViewTest {
    private lateinit var view: DrawingCanvasView
    @MockK lateinit var context: Context
    @RelaxedMockK lateinit var viewModel: DrawingCanvasVM
    @RelaxedMockK lateinit var defaultMotion: MotionEvent
    private val defaultX = 10f
    private val defaultY = 15f

    @Before
    fun setUp() {
        MockKAnnotations.init(this)
        view = spyk(DrawingCanvasView(context, null))
        view.viewModel = viewModel
        every { defaultMotion.x } returns defaultX
        every { defaultMotion.y } returns defaultY
        every { defaultMotion.source } returns InputDevice.SOURCE_TOUCHSCREEN
        every { viewModel.updateDrawingPath(any()) } returns true
    }

    @Test
    fun testTouchStart() {
        every { defaultMotion.action } returns MotionEvent.ACTION_DOWN

        view.onTouchEvent(defaultMotion)

        verify { viewModel.startDrawingPath(PointF(defaultX, defaultY)) }
    }

    @Test
    fun testTouchMove() {
        every { defaultMotion.action } returns MotionEvent.ACTION_MOVE

        view.onTouchEvent(defaultMotion)

        verify { viewModel.updateDrawingPath(PointF(defaultX, defaultY)) }
        verify { view.invalidate() }
    }

    @Test
    fun testTouchEnd() {
        every { defaultMotion.action } returns MotionEvent.ACTION_UP
        every { viewModel.updateDrawingPath(any()) } returns true
        every { viewModel.currentDrawingPath } returns null

        view.onTouchEvent(defaultMotion)

        verify { viewModel.endDrawingPath(PointF(defaultMotion.x, defaultMotion.y)) }
        verify { view.invalidate() }
    }
}