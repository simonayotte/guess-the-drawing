package com.example.client_leger.view

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.util.AttributeSet
import android.view.MotionEvent
import android.view.View
import com.example.client_leger.viewmodel.DrawingCanvasVM
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class DrawingCanvas(context: Context, attributes: AttributeSet?) : View(context, attributes) {
    private lateinit var bitmap : Bitmap // contains the saved drawing
    private lateinit var canvas : Canvas // to draw on the bitmap
    private val backgroundColor = Color.WHITE

    @Inject
    lateinit var viewModel : DrawingCanvasVM

    /**
     * Called when the view size is set for the first time
     * or when it changes (we keep a fixed size so not applicable in our case)
     */
    override fun onSizeChanged(width: Int, height: Int, oldWidth: Int, oldHeight: Int) {
        super.onSizeChanged(width, height, oldWidth, oldHeight)
        bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        canvas = Canvas(bitmap)
        canvas.drawColor(backgroundColor)
    }

    override fun onDraw(viewCanvas: Canvas?) {
        viewCanvas?.let {
            super.onDraw(viewCanvas)
            // redrawing existing paths saved in bitmap
            viewCanvas.drawBitmap(bitmap, 0f, 0f, null)

            // drawing current path (not yet saved in bitmap)
            viewModel.currentDrawingPath?.let {
                viewCanvas.drawPath(it.path, it.paint)
            }
        }
    }

    @SuppressLint("ClickableViewAccessibility") // Accessibility not applicable to drawings
    override fun onTouchEvent(event: MotionEvent?): Boolean {
        event?.let {
            super.onTouchEvent(it)
            when(it.action) {
                MotionEvent.ACTION_DOWN -> onTouchStart(it.x, it.y)
                MotionEvent.ACTION_MOVE -> onTouchMove(it.x, it.y)
                MotionEvent.ACTION_UP -> onTouchEnd()
            }
        }
        return true
    }

    private fun onTouchStart(posX: Float, posY: Float) {
        viewModel.startDrawingPath(posX, posY)
    }

    private fun onTouchMove(posX: Float, posY: Float) {
        if(viewModel.updateDrawingPath(posX, posY))
            invalidate() // refreshing the view if the path was updated
    }

    private fun onTouchEnd() {
        viewModel.currentDrawingPath?.let {
            canvas.drawPath(it.path, it.paint) // saving the path in the bitmap
        }
        viewModel.endDrawingPath()
        invalidate()
    }
}