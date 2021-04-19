package com.example.client_leger.drawing.model

import android.graphics.Color
import androidx.lifecycle.MutableLiveData
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class DrawingOptions @Inject constructor(){
    var color: Int = Color.BLACK
    var strokeWidth: Int = 10
    var opacity: Int = 255

    enum class OptionTypes {
        DRAWING, ERASING, GRID
    }
    var selectedOption: OptionTypes = OptionTypes.DRAWING

    // easier to use than using selectedOption everywhere
    val isDrawingMode: Boolean
        get() = selectedOption == OptionTypes.DRAWING
    val isErasingMode: Boolean
        get() = selectedOption == OptionTypes.ERASING
    val isGridMode: Boolean
        get() = selectedOption == OptionTypes.GRID

}