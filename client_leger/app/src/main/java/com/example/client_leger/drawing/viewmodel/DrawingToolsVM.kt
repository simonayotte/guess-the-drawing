package com.example.client_leger.drawing.viewModel

import android.graphics.Color
import android.view.MotionEvent
import android.view.View
import androidx.core.graphics.alpha
import androidx.databinding.BindingAdapter
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.client_leger.UndoRedo.service.CommandInvoker
import com.example.client_leger.drawing.model.DrawingOptions
import com.example.client_leger.drawing.model.EraserOptions
import com.example.client_leger.drawing.model.GridOptions
import com.example.client_leger.drawing.model.PathRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject


@HiltViewModel
class DrawingToolsVM @Inject constructor(
        private val drawingOptions: DrawingOptions,
        private val eraserOptions: EraserOptions,
        private val gridOptions: GridOptions,
        private val commandInvoker: CommandInvoker,
        private val pathRepository: PathRepository
): ViewModel() {
    val isEnabled: MutableLiveData<Boolean> = MutableLiveData(false)
    val strokeWidthMinValue = 1
    val strokeWidthMaxValue = 100
    val strokeWidthSeekInput: MutableLiveData<Int> = MutableLiveData(drawingOptions.strokeWidth)
    val strokeWidthTextInput: MutableLiveData<String> = MutableLiveData(drawingOptions.strokeWidth.toString())
    val eraserWidthMinValue = 3
    val eraserWidthMaxValue = 100
    val eraserWidthSeekInput: MutableLiveData<Int> = MutableLiveData(eraserOptions.strokeWidth)
    val eraserWidthTextInput: MutableLiveData<String> = MutableLiveData(eraserOptions.strokeWidth.toString())
    val gridVisible: MutableLiveData<Boolean> = MutableLiveData(gridOptions.visible)
    val gridMinOpacity = 50
    val gridMaxOpacity = 255
    val gridOpacity: MutableLiveData<Int> = MutableLiveData(gridOptions.paint.alpha)
    val gridStep: MutableLiveData<Int> = MutableLiveData(gridOptions.step)
    val gridMinStep = 10
    val gridMaxStep = 500
    val previousColors : MutableList<MutableLiveData<Int>> = mutableListOf(MutableLiveData(drawingOptions.color),
            MutableLiveData(Color.parseColor("#80000000")), MutableLiveData(Color.parseColor("#FF9800")),
            MutableLiveData(Color.parseColor("#FFEB3B")), MutableLiveData(Color.parseColor("#4CAF50")),
            MutableLiveData(Color.parseColor("#00BCD4")), MutableLiveData(Color.parseColor("#3F51B5")),
            MutableLiveData(Color.parseColor("#9C27B0")), MutableLiveData(Color.parseColor("#F44336")))
    val pencilButtonSelected : MutableLiveData<Boolean> = MutableLiveData(true)
    val eraserButtonSelected : MutableLiveData<Boolean> = MutableLiveData(false)
    val gridButtonSelected : MutableLiveData<Boolean> = MutableLiveData(false)
    var redoIsClickable = MutableLiveData<Boolean>(false)
    var undoIsClickable = MutableLiveData<Boolean>(false)
    init {
        strokeWidthSeekInput.observeForever { onStrokeWidthSeekChanged() }
        strokeWidthTextInput.observeForever { onStrokeWidthTextChanged() }
        eraserWidthSeekInput.observeForever { onEraserWidthSeekChanged() }
        eraserWidthTextInput.observeForever { onEraserWidthTextChanged() }
        gridVisible.observeForever { gridOptions.visible = it }
        gridOpacity.observeForever { gridOptions.paint.alpha = it }
        gridStep.observeForever { gridOptions.step = it }
        strokeWidthTextInput.observeForever { onStrokeWidthTextChanged() }
        commandInvoker.redoIsClickable.observeForever { redoIsClickable.value = it }
        commandInvoker.undoIsClickable.observeForever { undoIsClickable.value = it }
        pathRepository.commandToExecute.observeForever {
            if(it == "undo")
                commandInvoker.undo()
            else if (it == "redo")
                commandInvoker.redo()
        }
    }

    fun onClickPencil() {
        drawingOptions.selectedOption = DrawingOptions.OptionTypes.DRAWING
        pencilButtonSelected.value = true
        eraserButtonSelected.value = false
        gridButtonSelected.value = false
    }

    fun onClickEraser() {
        drawingOptions.selectedOption = DrawingOptions.OptionTypes.ERASING
        pencilButtonSelected.value = false
        eraserButtonSelected.value = true
        gridButtonSelected.value = false
    }

    fun onClickGrid() {
        drawingOptions.selectedOption = DrawingOptions.OptionTypes.GRID
        pencilButtonSelected.value = false
        eraserButtonSelected.value = false
        gridButtonSelected.value = true
    }

    fun onSelectedColorChanged(color: Int) {
        drawingOptions.color = color
        drawingOptions.opacity = color.alpha
    }

    private fun onStrokeWidthTextChanged() {
        strokeWidthTextInput.value?.let{
            val newValue = it.toIntOrNull()
            newValue?.let{ newInt ->
                val validValue = newInt.coerceIn(strokeWidthMinValue, strokeWidthMaxValue)
                if(strokeWidthSeekInput.value != validValue){
                    strokeWidthSeekInput.value = validValue
                    onStrokeWidthChanged()
                }
            }
        }
    }

    private fun onStrokeWidthSeekChanged() {
        val newValue = strokeWidthSeekInput.value.toString()
        if(strokeWidthTextInput.value != newValue) {
            strokeWidthTextInput.value = newValue
            onStrokeWidthChanged()
        }
    }

    private fun onStrokeWidthChanged() {
        strokeWidthSeekInput.value?.let {
            drawingOptions.strokeWidth = it
        }
    }

    private fun onEraserWidthTextChanged() {
        eraserWidthTextInput.value?.let{
            val newValue = it.toIntOrNull()
            newValue?.let{ newInt ->
                val validValue = newInt.coerceIn(eraserWidthMinValue, eraserWidthMaxValue)
                if(eraserWidthSeekInput.value != validValue){
                    eraserWidthSeekInput.value = validValue
                    onEraserWidthChanged()
                }
            }
        }
    }

    private fun onEraserWidthSeekChanged() {
        val newValue = eraserWidthSeekInput.value.toString()
        if(eraserWidthTextInput.value != newValue) {
            eraserWidthTextInput.value = newValue
            onEraserWidthChanged()
        }
    }

    private fun onEraserWidthChanged() {
        eraserWidthSeekInput.value?.let {
            eraserOptions.strokeWidth = it
        }
    }

    fun onDrawingStarted() {
        val color = drawingOptions.color
        if(previousColors.none { it.value == color }) {
            for (i in previousColors.size - 1 downTo 1) {
                previousColors[i].value = previousColors[i-1].value
            }
            previousColors[0].value = color
        }
    }

    fun onClickUndo() {
        commandInvoker.undo()
        pathRepository.sendUndoCommand()
    }

    fun onClickRedo() {
        commandInvoker.redo()
        pathRepository.sendRedoCommand()
    }

    fun reset() {
        commandInvoker.newDrawing()
    }

}