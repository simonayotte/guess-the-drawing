package com.example.client_leger.UndoRedo.model

import com.example.client_leger.drawing.model.DrawingPath
import com.example.client_leger.drawing.viewModel.DrawingCanvasVM
import javax.inject.Inject

class EraseCommand constructor (
        private val drawingCanvasVM: DrawingCanvasVM,
        var pathsMap: MutableMap<Int, DrawingPath> = mutableMapOf()
): CommandInterface {

    override fun execute() {
        for(pathId in pathsMap.keys){
            drawingCanvasVM.drawingPaths.remove(pathId)
        }
        drawingCanvasVM.refreshCanvas.value = true
    }

    override fun cancel() {
        for (pair in pathsMap.entries) {
            drawingCanvasVM.drawingPaths[pair.key] = pair.value
        }
        drawingCanvasVM.refreshCanvas.value = true
    }
    fun addPath(pathId:Int, path: DrawingPath ){
        if(!pathsMap.containsKey(pathId))
            pathsMap[pathId] = path
    }
}