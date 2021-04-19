package com.example.client_leger.UndoRedo.model

import com.example.client_leger.drawing.model.DrawingPath

interface CommandInterface {
    fun execute()
    fun cancel()
}