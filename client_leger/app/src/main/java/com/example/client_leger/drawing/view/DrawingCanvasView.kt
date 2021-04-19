package com.example.client_leger.drawing.view

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.*
import android.util.AttributeSet
import android.view.MotionEvent
import android.view.View
import com.example.client_leger.drawing.viewModel.DrawingCanvasVM
import dagger.hilt.android.AndroidEntryPoint
import kotlin.math.ceil

@AndroidEntryPoint
class DrawingCanvasView(context: Context, attributes: AttributeSet?) : View(context, attributes) {
    private lateinit var drawingBitmap : Bitmap // contains the saved drawing
    private lateinit var drawingCanvas : Canvas // to draw on the drawing bitmap
    private lateinit var gridBitmap : Bitmap // contains the grid as bitmap
    private lateinit var gridCanvas : Canvas // to draw on the grid bitmap
    private val backgroundColor = Color.WHITE
    lateinit var viewModel : DrawingCanvasVM

    init {
        this.isEnabled = false
    }

    /**
     * Called when the view size is set for the first time
     * or when it changes (we keep a fixed size so not applicable in our case)
     */
    override fun onSizeChanged(width: Int, height: Int, oldWidth: Int, oldHeight: Int) {
        super.onSizeChanged(width, height, oldWidth, oldHeight)
        drawingBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        drawingCanvas = Canvas(drawingBitmap)
        drawingCanvas.drawColor(backgroundColor)
        gridBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        gridCanvas = Canvas(gridBitmap)
        recreateGrid()
        viewModel.updateOtherClientPath.observeForever {
            viewModel.otherClientPath?.let { otherClientPath ->
                drawingCanvas?.let {
                    invalidate()
                }
                if (it){
                    drawingCanvas?.drawPath(otherClientPath.path, otherClientPath.paint )
                    invalidate()
                }
            }
        }
        viewModel.refreshCanvas.observeForever {
            if(it)
                redrawBitmap()
        }
    }

    override fun onDraw(viewCanvas: Canvas?) {
        viewCanvas?.let {
            super.onDraw(viewCanvas)
            // redrawing finished paths saved in drawingBitmap (from drawingCanvas)
            viewCanvas.drawBitmap(drawingBitmap, 0f, 0f, null)
            viewModel.otherClientPath?.let {
                viewCanvas.drawPath(it.path, it.paint)
            }
            // draw current unfinished path
            if(viewModel.drawingOptions.isDrawingMode) {
                viewModel.currentDrawingPath?.let {
                    viewCanvas.drawPath(it.path, it.paint)
                }
            }

            // draw grid
            if(viewModel.gridOptions.visible){
                viewCanvas.drawBitmap(gridBitmap, 0f, 0f, viewModel.gridOptions.paint)
            }

            // draw eraser cursor
            if (viewModel.drawingOptions.isErasingMode) {
                viewModel.currentErasingPath?.let {
                    viewCanvas.drawRect(it.lastPos.x - it.radius, it.lastPos.y - it.radius,
                        it.lastPos.x + it.radius, it.lastPos.y + it.radius, it.paint)
                }
            }
        }
    }

    @SuppressLint("ClickableViewAccessibility") // Accessibility not applicable to drawings
    override fun onTouchEvent(event: MotionEvent?): Boolean {
        event?.let {
            super.onTouchEvent(it)
            if(viewModel.drawingOptions.isGridMode || !this.isEnabled)
                return true
            //Log.d(TAG, ("x " + it.x + " y " + it.y + " precision x " + it.xPrecision))
            val pos = PointF(it.x.coerceIn(0f, drawingCanvas.width.toFloat()), it.y.coerceIn(0f, drawingCanvas.height.toFloat()))

            when(it.action) {
                MotionEvent.ACTION_DOWN -> onTouchStart(pos)
                MotionEvent.ACTION_MOVE -> onTouchMove(pos)
                MotionEvent.ACTION_UP -> onTouchEnd(pos)
            }
        }
        return true
    }

    private fun onTouchStart(pos: PointF) {
        viewModel.startDrawingPath(pos)
        invalidate()
    }

    private fun onTouchMove(pos: PointF) {
        val updateNeeded = viewModel.updateDrawingPath(pos)

        if (viewModel.drawingOptions.isErasingMode)
            if(updateNeeded)
                redrawBitmap() // drawing path erased, need to redraw the whole bitmap
            else
                invalidate() // to show the eraser cursor
        else
            if(updateNeeded)
                invalidate() // drawing path updated, only need to refresh the view
    }

    private fun onTouchEnd(pos: PointF) {
        if(viewModel.endDrawingPath(pos)) {
            redrawBitmap()
        }
        viewModel.currentDrawingPath?.let {
            drawingCanvas.drawPath(it.path, it.paint) // saving the path in the bitmap
        }
        viewModel.resetDrawingPath()
        invalidate()
    }

    // when an already existing path was edited / removed
    private fun redrawBitmap() {
        drawingCanvas.drawColor(backgroundColor)
        viewModel.drawingPaths.values.forEach {
            drawingCanvas.drawPath(it.path, it.paint)
        }
        invalidate()
    }

    // when the grid step changed. invalidate() is enough when changing visibility/opacity
    fun recreateGrid() {
        if(!this::gridCanvas.isInitialized)
            return
        gridCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR)
        val gridPaint = Paint()
        gridPaint.color = Color.BLACK
        for(x in 0 until gridCanvas.width step viewModel.gridOptions.step) {
            gridCanvas.drawLine(x.toFloat(), 0f, x.toFloat(), gridCanvas.height.toFloat(), gridPaint)
        }
        for(y in 0 until gridCanvas.height step viewModel.gridOptions.step) {
            gridCanvas.drawLine(0f, y.toFloat(), gridCanvas.width.toFloat(), y.toFloat(), gridPaint)
        }

        invalidate()
    }
}