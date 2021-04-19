package com.example.client_leger.UndoRedo.model

import com.example.client_leger.drawing.model.DrawingPath
import com.example.client_leger.drawing.viewModel.DrawingCanvasVM

class DrawCommand constructor (
        private val drawingCanvasVM: DrawingCanvasVM,
        var pathId:Int,
        var path: DrawingPath
): CommandInterface {
    override fun execute() {
        drawingCanvasVM.drawingPaths[pathId] = path
        drawingCanvasVM.refreshCanvas.value = true
    }

    override fun cancel() {
        drawingCanvasVM.drawingPaths.remove(pathId)
        drawingCanvasVM.refreshCanvas.value = true
    }
}