package com.example.client_leger.UndoRedo.service

import androidx.lifecycle.MutableLiveData
import com.example.client_leger.UndoRedo.model.CommandInterface
import com.example.client_leger.drawing.viewModel.DrawingCanvasVM
import dagger.hilt.android.scopes.ViewModelScoped
import java.util.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CommandInvoker @Inject constructor() {
    private var commandDoneStack = Stack<CommandInterface>()
    private var commandUndoneStack = Stack<CommandInterface>()

    val undoIsClickable: MutableLiveData<Boolean> = MutableLiveData(false)
    val redoIsClickable: MutableLiveData<Boolean> = MutableLiveData(false)

    //to add and execute a command at the same time
    fun execute(command: CommandInterface) {
        command.execute()
        commandDoneStack.push(command)
        commandUndoneStack.clear()
        refreshUndoRedoBtnStatus()
    }

    //To undo the last command in the stack
    fun undo() {
        if(commandDoneStack.size != 0) {
            val lastCommand = commandDoneStack.pop()
            lastCommand.cancel()
            commandUndoneStack.push(lastCommand)
            refreshUndoRedoBtnStatus()
        }
    }

    //To redo the last command in the stack
    fun redo() {
        if(commandUndoneStack.size != 0) {
            val lastCommand = commandUndoneStack.pop()
            lastCommand.execute()
            commandDoneStack.push(lastCommand)
            refreshUndoRedoBtnStatus()
        }
    }

    //When a command is already executed but we want to track it in the commandInvoker
    fun addCommand(command: CommandInterface) {
        commandDoneStack.push(command)
        commandUndoneStack.clear()
        refreshUndoRedoBtnStatus()
    }

    //To call when switching roles or whenever a new drawing occurs
    fun newDrawing() {
        commandDoneStack.clear()
        commandUndoneStack.clear()
        refreshUndoRedoBtnStatus()
    }

    private fun refreshUndoRedoBtnStatus() {
        undoIsClickable.value = commandDoneStack.size != 0
        redoIsClickable.value = commandUndoneStack.size !=0
    }
}